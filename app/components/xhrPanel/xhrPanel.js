// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var Ractive = require('Ractive'),
      xhrPanelTemplate = require('rv!./xhrPanelTemplate'),
      sequence = require('components/apiSequence/sequence'),
      utilities = require('components/util/utilities'),
      prettify = require('prettify'),
      $ = require('jquery');
  require('Ractive-transitions-slide');

  var XhrPanel = Ractive.extend({
    template: xhrPanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    // prototype
    data: {
      id: null,
      isPublic: true,
      headers: null,
      body: null,
      corsEnabled: false,
      depricated: false,
      callCount: 0,
      forkedFrom: null,

      // State
      starred: false,
      signedIn: window.suri.session.signedIn,
      responseBody: '',
      showOptions: false,
      saveButtonClass: 'default',
      sendButtonClass: 'default',
      sendButtonDisabled: false,
      showMoreButton: false,
      formatNumber: function(number) {
        return number.toLocaleString();
      },
      formatDate: function(date) {
        var d = new Date(date);
        return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ' ' + d.getHours() + ':' + d.getMinutes();
      }
    },

    init: function() {
      sequence.add(this);

      // non-prototype defaults
      this.set('panelId', utilities.guid());
      if (typeof(this.get('name')) === 'undefined') this.set('name', 'XHR');
      if (typeof(this.get('method')) === 'undefined') this.set('method', 'GET');
      if (typeof(this.get('url')) === 'undefined') this.set('url', 'http://www.suri.io/');
      if (typeof(this.get('headerOptions')) === 'undefined') this.set('headerOptions', []);
      if (typeof(this.get('queryParameterOptions')) === 'undefined') this.set('queryParameterOptions', []);
      if (typeof(this.get('tags')) === 'undefined') this.set('tags', []);
      if (typeof(this.get('stars')) === 'undefined') this.set('stars', []);
      if (typeof(this.get('forks')) === 'undefined') this.set('forks', []);
      if (typeof(this.get('owner')) === 'undefined') this.set('owner', window.suri.session.userId);
      this.set('isOwner', window.suri.session.userId === this.get('owner'));
      if (this.get('stars').indexOf(window.suri.session.userId) !== -1) {
        this.set('starred', true);
      }

      // XHR
      this.xhr = new XMLHttpRequest();
      var done = function done() {
        this.fire('displayResponse');
      }.bind(this);
      this.xhr.onload = done;
      this.xhr.onerror = done;

      this.on({
        // All panels
        teardown: function teardown(event) {
          this.detach();
          sequence.remove(this);
          if (event && event.original && event.original.stopPropagation) {
            event.original.stopPropagation();
          }
        },

        toggleOptions: function() {
          this.set('showOptions', !this.get('showOptions'));
        },

        scrollToPanel: function scrollToPanel() {
          $('html,body').animate({
            scrollTop: document.getElementById(this.get('panelId')).offsetTop + 100
          }, 200, 'easeOutQuint');
        },

        sendOnEnter: function sendOnEnter(event) {
          if (event.original.keyCode === 13) {
            this.fire('send');
          }
        },

        send: function send() {
          this.set('sendButtonClass', 'default');
          this.set('sendButtonDisabled', true);

          if (this.get('corsEnabled')) {
            // Directly talk to server
            this.xhr.open(this.get('method'), this.get('url'), true);
          } else {
            // Proxy request using the 'api-host' header
            var url = this.get('url');
            if (url.substring(0, 4) !== 'http') {
              url = 'http://' + url;
            }
            var urlParts = url.split('/');
            var host = urlParts[0] + '//' + urlParts[2] + '/';
            var path = '/' + url.split('/').splice(3).join('/');

            this.xhr.open(this.get('method'), path, true);
            this.xhr.setRequestHeader('api-host', host);

            // Include the XHR ID so we can increment the call counter
            if (this.get('id')) {
              this.xhr.setRequestHeader('api-id', this.get('id'));
            }
          }

          this.set('callCount', this.get('callCount') + 1);

          var headerLines = this.get('headers').split('\n');
          if (headerLines.length === 1 && headerLines[0].trim() === '') {
            // because callling split on an empty string returns ['']
            headerLines = [];
          }
          for (var i = 0; i < headerLines.length; i++) {
            var headerParts = headerLines[i].split(':');
            var header = headerParts[0].trim();
            if (header) {
              this.xhr.setRequestHeader(header, headerParts.splice(1).join(':').trim());
            }
          }

          try {
            this.xhr.send(this.get('body').trim());
          } catch (exception) {
            this.nodes.responseBody.innerHTML = JSON.stringify(exception, null, 2);
          }
        },

        displayResponse: function displayResponse() {
          // update send button
          this.set('sendButtonDisabled', false);
          if (this.xhr.status >= 200 && this.xhr.status < 300) {
            this.set('sendButtonClass', 'success');
          } else {
            this.set('sendButtonClass', 'danger');
          }

          // headers
          this.set('responseHeaders', 'HTTP/1.1 ' + this.xhr.status + ' ' + this.xhr.statusText + '\n' + this.xhr.getAllResponseHeaders());

          // body
          var contentType = this.xhr.getResponseHeader('content-type');
          this.set('responseBody', '');
          if (contentType) {
            if (contentType.indexOf('json') !== -1) {
              this.set('responseBody', utilities.escape(JSON.stringify(JSON.parse(this.xhr.response), null, 2)));
            } else if (contentType.indexOf('javascript') !== -1) {
              var parsedResponse;
              try {
                parsedResponse = JSON.stringify(JSON.parse(this.xhr.response), null, 2);
              } catch (e) {
                parsedResponse = this.xhr.response;
              }
              this.set('responseBody', utilities.escape(parsedResponse));
            } else if (contentType.indexOf('xml') !== -1) {
              this.set('responseBody', utilities.escape(this.xhr.responseXML));
            } else if (contentType.indexOf('html') !== -1) {
              this.set('responseBody', utilities.escape(this.xhr.response));
            } else {
              this.set('responseBody', utilities.escape(this.xhr.response));
            }
          } else {
            this.set('responseBody', utilities.escape(this.xhr.response));
          }

          if (this.get('responseBody').length > 3000) {
            this.nodes.responseBody.innerHTML = prettify.prettyPrintOne(this.get('responseBody').substring(0, 3000));
            this.set('showMoreButton', true);
          } else {
            this.fire('displayEntireResponse');
          }
        },

        displayEntireResponse: function displayEntireResponse() {
          this.nodes.responseBody.innerHTML = prettify.prettyPrintOne(this.get('responseBody'));
          this.set('showMoreButton', false);
        },

        fork: function() {
          var fork = new XhrPanel({data: this.data});
          fork.set('id', null);
          fork.set('isOwner', true);
          fork.set('owner', window.suri.session.userId);
          fork.set('callCount', 0);
          fork.set('forks', []);
          fork.set('forkedFrom', this.get('id'));
          fork.fire('save');
          this.data.forks.push(''); // increment the forks count, this is faking out what's happening server side
        },

        save: function() {
          this.set('saveButtonClass', 'default');

          if (this.get('id')) {
            // update
            $.ajax('/xhr/' + this.get('id'), {
              type: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(this.data)
            })
              .done(function() {
                this.set('saveButtonClass', 'success');
              }.bind(this))
              .fail(function() {
                this.set('saveButtonClass', 'danger');
              }.bind(this));
          }
          else {
            // save
            $.ajax('/xhr', {
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(this.data)
            })
              .done(function(data) {
                this.set('saveButtonClass', 'success');
                this.set('id', data._id);
              }.bind(this))
              .fail(function() {
                this.set('saveButtonClass', 'danger');
              }.bind(this));
          }
        },

        delete: function() {
          if (!this.get('id')) {
            // This was never saved, remove the panel
            this.teardown();
          } else {
            $.ajax('/xhr/' + this.get('id'), {
              type: 'DELETE'
            })
              .done(function() {
                this.teardown();
              }.bind(this));
          }
        },

        star: function() {
          if (this.get('starred')) {
            // Unstar
            $.ajax('/xhr/' + this.get('id') + '/stars/' + window.suri.session.userId, {
              method: 'DELETE'
            })
              .done(function() {
                this.data.stars.splice(sequence.indexOf(window.suri.session.userId), 1);
                this.set('starred', false);
              }.bind(this));
          } else {
            // Star
            $.ajax('/xhr/' + this.get('id') + '/stars', {
              method: 'POST',
              data: window.suri.session.userId
            })
              .done(function() {
                this.data.stars.push(window.suri.session.userId);
                this.set('starred', true);
              }.bind(this));
          }
        }
      });

      // Scroll to the panel when it's created
      this.fire('scrollToPanel');
    }
  });

  return XhrPanel;
});
