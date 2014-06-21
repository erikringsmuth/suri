// Copyright (C) 2014 Erik Ringsmuth - MIT license
define(function(require) {
  'use strict';
  var config            = require('config'),
      Ractive           = require('ractive'),
      xhrPanelTemplate  = require('rv!./xhrPanelTemplate'),
      sequence          = require('components/apiSequence/sequence'),
      utilities         = require('components/util/utilities'),
      URI               = require('bower_components/URIjs/src/URI'),
      vkbeautify        = require('vkbeautify'),
      ace               = require('ace/ace'),
      $                 = require('jquery');
  require('ractive-transitions-slide');

  var XhrPanel = Ractive.extend({
    template: xhrPanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    // prototype
    data: {
      name: 'XHR',
      method: 'GET',
      url: 'http://www.suri.io/',
      body: '',
      corsEnabled: false,
      isPublic: true,
      callCount: 0,
      starCount: 0,
      forkCount: 0,
      owner: config.session.userId,
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
      if (!this.data.hasOwnProperty('headers')) this.set('headers', []);
      if (!this.data.hasOwnProperty('queryParameters')) this.set('queryParameters', []);
      if (!this.data.hasOwnProperty('tags')) this.set('tags', []);
      if (!this.data.hasOwnProperty('stars')) this.set('stars', []);
      if (!this.data.hasOwnProperty('forks')) this.set('forks', []);
      this.set('isOwner', !this.get('id') || config.session.userId === this.get('owner'));
      if (this.get('stars').indexOf(config.session.userId) !== -1) {
        this.set('starred', true);
      }
      var responseBody = '';

      // add this XHR to the api sequence
      sequence.add(this);

      // request body ace editor
      var requestBodyEditor = ace.edit(this.nodes.requestBody);
      requestBodyEditor.getSession().setMode('ace/mode/json');
      requestBodyEditor.setTheme('ace/theme/chrome');
      requestBodyEditor.setOption('minLines', 4);
      requestBodyEditor.setOption('maxLines', 10000);
      requestBodyEditor.setAutoScrollEditorIntoView(true);
      requestBodyEditor.renderer.setShowGutter(false);
      requestBodyEditor.renderer.setPadding(7);
      requestBodyEditor.renderer.setScrollMargin(5, 5);
      requestBodyEditor.setShowPrintMargin(false);
      requestBodyEditor.getSession().setTabSize(2);
      requestBodyEditor.getSession().setUseWrapMode(true);
      requestBodyEditor.setValue(this.get('body'), -1);
      requestBodyEditor.on('change', function (data) {
        this.set('body', requestBodyEditor.getValue());
      }.bind(this));

      // response headers ace editor
      var responseHeadersEditor = ace.edit(this.nodes.responseHeaders);
      responseHeadersEditor.setReadOnly(true);
      responseHeadersEditor.setTheme('ace/theme/chrome');
      responseHeadersEditor.setOption('minLines', 0);
      responseHeadersEditor.setOption('maxLines', 10000);
      responseHeadersEditor.renderer.setShowGutter(false);
      responseHeadersEditor.renderer.setPadding(7);
      responseHeadersEditor.renderer.setScrollMargin(5, 5);
      responseHeadersEditor.setShowPrintMargin(false);
      responseHeadersEditor.setHighlightGutterLine(false);
      responseHeadersEditor.getSession().setUseWrapMode(true);

      // response body ace editor
      var responseBodyEditor = ace.edit(this.nodes.responseBody);
      responseBodyEditor.setReadOnly(true);
      responseBodyEditor.setTheme('ace/theme/chrome');
      responseBodyEditor.setOption('minLines', 0);
      responseBodyEditor.setOption('maxLines', 10000);
      responseBodyEditor.renderer.setShowGutter(false);
      responseBodyEditor.renderer.setPadding(7);
      responseBodyEditor.renderer.setScrollMargin(5, 5);
      responseBodyEditor.setShowPrintMargin(false);
      responseBodyEditor.getSession().setTabSize(2);
      responseBodyEditor.getSession().setUseWrapMode(true);

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
                this.data.stars.splice(this.data.stars.indexOf(config.session.userId), 1);
                this.set('starCount', this.get('starCount') - 1);
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
                this.set('starCount', this.get('starCount') + 1);
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
              data: this.toJSON()
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
              data: this.toJSON()
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
          var fork = new XhrPanel({data: JSON.parse(this.toJSON())});
          fork.set({
            id: null,
            isOwner: true,
            owner: config.session.userId,
            callCount: 0,
            starCount: 0,
            forkCount: 0,
            forks: [],
            forkedFrom: this.get('id')
          });
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

            // Set the api-id to log the call counts
            requestHeaders['api-id'] = this.get('id');
          }

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

          responseHeadersEditor.setValue('HTTP/1.1 ' + jqXHR.status + ' ' + jqXHR.statusText + '\n' + jqXHR.getAllResponseHeaders().trim(), -1);

          var contentType = jqXHR.getResponseHeader('content-type');
          var mode = 'text';
          if (contentType) {
            if (contentType.indexOf('json') !== -1) {
              mode = 'json';
            } else if (contentType.indexOf('html') !== -1) {
              mode = 'html';
            } else if (contentType.indexOf('javascript') !== -1) {
              mode = 'javascript';
            } else if (contentType.indexOf('xml') !== -1) {
              mode = 'xml';
            } else if (contentType.indexOf('css') !== -1) {
              mode = 'css';
            }
          }
          responseBodyEditor.getSession().setMode('ace/mode/' + mode);

          if (typeof(jqXHR.responseJSON) !== 'undefined') {
            // JSON
            responseBody = JSON.stringify(jqXHR.responseJSON, null, 2);
          }
          else if (typeof(jqXHR.responseXML) !== 'undefined') {
            // XML
            responseBody = vkbeautify.xml(new XMLSerializer().serializeToString(jqXHR.responseXML), 2);
          }
          else if (contentType && contentType.indexOf('javascript') !== -1) {
            // This could still be JSON, Google does this :P
            try {
              responseBody = JSON.stringify(JSON.parse(jqXHR.responseText), null, 2);
            } catch (e) {
              responseBody = jqXHR.responseText;
            }
          }
          else {
            // Plain text, html, or something
            responseBody = jqXHR.responseText;
          }

          this.set('responseLength', responseBody.length);
          if (responseBody.length > 3000) {
            responseBodyEditor.setValue(responseBody.substring(0, 3000), -1);
            this.set('showMoreButton', true);
          } else {
            this.fire('displayEntireResponse');
          }
        },

        displayEntireResponse: function displayEntireResponse() {
          responseBodyEditor.setValue(responseBody, -1);
          this.set('showMoreButton', false);
        }
      });

      // Scroll to the panel when it's created
      this.fire('scrollToPanel');
      this.fire('setupTooltips');
    },

    // Return the Ractive object data as JSON including the default data properties which are on the prototype
    toJSON: function() {
      var json = {};
      for (var property in this.data) {
        if (typeof(property) !== 'function') {
          json[property] = this.data[property];
        }
      }
      return JSON.stringify(json);
    }
  });

  return XhrPanel;
});
