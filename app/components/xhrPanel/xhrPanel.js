// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define(function(require) {
  'use strict';
  var config = require('config'),
      Ractive = require('Ractive'),
      xhrPanelTemplate = require('rv!./xhrPanelTemplate'),
      sequence = require('components/apiSequence/sequence'),
      utilities = require('components/util/utilities'),
      prettify = require('prettify'),
      URI = require('bower_components/URIjs/src/URI'),
      vkbeautify = require('vkbeautify'),
      $ = require('jquery');
  require('Ractive-transitions-slide');

  var XhrPanel = Ractive.extend({
    template: xhrPanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    // prototype
    data: {
      starred: false,
      signedIn: config.session.signedIn,
      responseBody: '',
      showOptions: false,
      saveButtonClass: 'default',
      sendButtonClass: 'default',
      sendButtonDisabled: false,
      showMoreButton: false,
      fullScreen: false,
      formatNumber: function(number) {
        return number.toLocaleString();
      },
      formatDate: function(date) {
        var d = new Date(date);
        return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + ' ' + d.getHours() + ':' + d.getMinutes();
      }
    },

    init: function() {
      // set non-prototype defaults
      this.set('panelId', utilities.guid());
      if (typeof(this.get('name')) === 'undefined') this.set('name', 'XHR');
      if (typeof(this.get('method')) === 'undefined') this.set('method', 'GET');
      if (typeof(this.get('url')) === 'undefined') this.set('url', 'http://www.suri.io/');
      if (typeof(this.get('headers')) === 'undefined') this.set('headers', []);
      if (typeof(this.get('queryParameters')) === 'undefined') this.set('queryParameters', []);
      if (typeof(this.get('body')) === 'undefined') this.set('body', '');
      if (typeof(this.get('corsEnabled')) === 'undefined') this.set('corsEnabled', false);
      if (typeof(this.get('isPublic')) === 'undefined') this.set('isPublic', true);
      if (typeof(this.get('callCount')) === 'undefined') this.set('callCount', 0);
      if (typeof(this.get('tags')) === 'undefined') this.set('tags', []);
      if (typeof(this.get('stars')) === 'undefined') this.set('stars', []);
      if (typeof(this.get('starCount')) === 'undefined') this.set('starCount', 0);
      if (typeof(this.get('forks')) === 'undefined') this.set('forks', []);
      if (typeof(this.get('forkCount')) === 'undefined') this.set('forkCount', 0);
      if (typeof(this.get('owner')) === 'undefined') this.set('owner', config.session.userId);
      this.set('isOwner', !this.get('id') || config.session.userId === this.get('owner'));
      if (this.get('stars').indexOf(config.session.userId) !== -1) {
        this.set('starred', true);
      }

      // add this XHR to the api sequence
      sequence.add(this);

      this.on({
        teardown: function teardown(event) {
          this.detach();
          sequence.remove(this);
          if (event && event.original && event.original.stopPropagation) {
            event.original.stopPropagation();
          }
        },

        scrollToPanel: function scrollToPanel() {
          $('html,body').animate({
            scrollTop: document.getElementById(this.get('panelId')).offsetTop + $('#api-sequence').offset().top - 15
          }, 200, 'easeOutQuint');
        },

        setupTooltips: function() {
          $('.bs-tooltip').tooltip();
        },

        toggleOptions: function() {
          this.set('showOptions', !this.get('showOptions'));
          this.fire('setupTooltips');
        },

        toggleFullscreen: function() {
          this.set('fullScreen', !this.get('fullScreen'));
        },

        star: function() {
          if (this.get('starred')) {
            // Unstar
            $.ajax('/xhr/' + this.get('id') + '/stars/' + config.session.userId, {
              method: 'DELETE'
            })
              .done(function() {
                this.data.stars.splice(sequence.indexOf(config.session.userId), 1);
                this.set('starred', false);
              }.bind(this));
          } else {
            // Star
            $.ajax('/xhr/' + this.get('id') + '/stars', {
              method: 'POST',
              data: config.session.userId
            })
              .done(function() {
                this.data.stars.push(config.session.userId);
                this.set('starred', true);
              }.bind(this));
          }
        },

        save: function() {
          this.set('saveButtonClass', 'default');

          if (!this.get('signedIn')) return;

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

        fork: function() {
          var fork = new XhrPanel({data: this.data});
          fork.set('id', null);
          fork.set('isOwner', true);
          fork.set('owner', config.session.userId);
          fork.set('callCount', 0);
          fork.set('forks', []);
          fork.set('forkedFrom', this.get('id'));
          fork.fire('save');
          this.data.forks.push(''); // increment the forks count, this is faking out what's happening server side
        },

        addTagOnEnter: function(event) {
          if (event.original.keyCode === 13) {
            var tag = event.node.value.replace(/\s/g, '').toLowerCase();
            if (this.get('tags').indexOf(tag) === -1) {
              this.get('tags').push(tag);
              event.node.value = '';
            }
          }
        },

        deleteTag: function(event, tag) {
          this.get('tags').splice(this.get('tags').indexOf(tag), 1);
          event.original.preventDefault();
        },

        addBlankHeader: function() {
          this.get('headers').push({
            header: '',
            options: [],
            selected: '',
            required: false
          });
        },

        removeHeader: function(event, header) {
          this.get('headers').splice(this.get('headers').indexOf(header), 1);
        },

        sendOnEnter: function sendOnEnter(event) {
          if (event.original.keyCode === 13) {
            this.fire('send');
          }
        },

        send: function send() {
          // Clear and disable send button
          this.set('sendButtonClass', 'default');
          this.set('sendButtonDisabled', true);

          // Increment the call count locally, this gets set server-side by the api-id header
          this.set('callCount', this.get('callCount') + 1);

          // Get the selected headers
          var headers = this.get('headers');
          var requestHeaders = {};
          headers.forEach(function(header) {
            requestHeaders[header.header] = header.selected;
          });

          // Make sure URL the protocol is included otherwise default to HTTP
          var url = this.get('url');
          if (url.indexOf('://') === -1) {
            url = 'http://' + url;
          }
          var apiUri = new URI(url);
          var suriHost = new URI(window.location.href).host();
          if (!this.get('corsEnabled') && apiUri.host() !== suriHost) {
            // Proxy through the suri.io server
            requestHeaders['api-host'] = apiUri.protocol() + '://' + apiUri.authority();
            apiUri.authority(suriHost);
            apiUri.protocol(window.location.protocol); // Suri doesn't support HTTPS yet
          }

          // Set the api-id to log the call counts
          requestHeaders['api-id'] = this.get('id');

          // Send the request
          $.ajax({
            type: this.get('method'),
            url: apiUri,
            headers: requestHeaders,
            data: this.get('body')
          })
          .done(function(data, textStatus, jqXHR) {
            this.fire('displayResponse', jqXHR);
          }.bind(this))
          .fail(function(jqXHR) {
            this.fire('displayResponse', jqXHR);
          }.bind(this));
        },

        displayResponse: function displayResponse(jqXHR) {
          // update send button
          this.set('sendButtonDisabled', false);
          if (jqXHR.status >= 200 && jqXHR.status < 300) {
            this.set('sendButtonClass', 'success');
          } else {
            this.set('sendButtonClass', 'danger');
          }

          // headers
          this.set('responseHeaders', 'HTTP/1.1 ' + jqXHR.status + ' ' + jqXHR.statusText + '\n' + jqXHR.getAllResponseHeaders());

          // body
          this.set('responseBody', '');

          if (typeof(jqXHR.responseJSON) !== 'undefined') {
            // JSON
            this.set('responseBody', utilities.escape(JSON.stringify(jqXHR.responseJSON, null, 2)));
          }
          else if (typeof(jqXHR.responseXML) !== 'undefined') {
            // XML
            this.set('responseBody', utilities.escape(vkbeautify.xml(new XMLSerializer().serializeToString(jqXHR.responseXML), 2)));
          }
          else {
            var contentType = jqXHR.getResponseHeader('content-type');
            if (contentType && contentType.indexOf('javascript') !== -1) {
              // This could still be JSON, Google does this :P
              var parsedResponse;
              try {
                parsedResponse = JSON.stringify(JSON.parse(jqXHR.responseText), null, 2);
              } catch (e) {
                parsedResponse = jqXHR.responseText;
              }
              this.set('responseBody', utilities.escape(parsedResponse));
            }
            else {
              // Plain text, html, or something
              this.set('responseBody', utilities.escape(jqXHR.responseText));
            }
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
        }
      });

      // Scroll to the panel when it's created
      this.fire('scrollToPanel');
      this.fire('setupTooltips');
    }
  });

  return XhrPanel;
});
