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

    data: {
      id: null,
      name: 'XHR',
      method: 'GET',
      url: 'http://www.suri.io/',
      autosend: false,
      showOptions: false,
      stars: [],
      callCount: 0,
      responseBody: '',
      get responseBodyLength() { return (this.responseBody.length).toLocaleString(); },
      saveButtonClass: 'default',
      sendButtonClass: 'default',
      sendButtonDisabled: false,
      showMoreButton: false,
      formatDate: function(date) {
        return new Date(date).toISOString();
      }
    },

    init: function() {
      // All panels
      sequence.add(this);
      this.set('panelId', utilities.guid());

      // XHR Specific
      this.xhr = new XMLHttpRequest();
      var done = function done() {
        this.fire('displayResponse');
      }.bind(this);
      this.xhr.onload = done;
      this.xhr.onerror = done;
      if (this.get('autosend') === true) {
        this.send();
      }

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

        sendOnEnter: function sendOnEnter(event) {
          if (event.original.keyCode === 13) {
            this.fire('send');
          }
        },

        send: function send() {
          this.set('sendButtonClass', 'default');
          this.set('sendButtonDisabled', true);

          var pUrl = this.parsedUrl();
          this.xhr.open(this.get('method'), pUrl.path, true);
          // Slight optimization to prevent suri from calling itself
          if (pUrl.host !== 'http://suri.io/' && pUrl.host !== 'http://www.suri.io/') {
            this.xhr.setRequestHeader('api-host', pUrl.host);
          }
          var headers = this.parsedRequestHeaders();
          for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
              this.xhr.setRequestHeader(header, headers[header]);
            }
          }

          try {
            this.xhr.send(this.nodes.requestBody.value.trim());
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
        },

        save: function() {
          this.set('saveButtonClass', 'default');
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
        },

        delete: function() {
          var id = this.get('id');
          if (!id) {
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
        }
      });
    },

    parsedRequestHeaders: function parsedRequestHeaders() {
      var headers = {};
      var headerLines = this.nodes.requestHeaders.value.split('\n');
      if (headerLines.length === 1 && headerLines[0].trim() === '') {
        // because callling split on an empty string returns ['']
        headerLines = [];
      }
      for (var i = 0; i < headerLines.length; i++) {
        var headerParts = headerLines[i].split(':');
        var header = headerParts[0].trim();
        if (header) {
          headers[header] = headerParts.splice(1).join(':').trim();
        }
      }
      return headers;
    },

    parsedUrl: function parsedUrl() {
      var result = {
        path: '',
        host: ''
      };

      var url = this.get('url');
      if (url.substring(0, 4) !== 'http') {
        url = 'http://' + url;
      }
      var urlParts = url.split('/');
      result.host = urlParts[0] + '//' + urlParts[2] + '/';
      result.path = '/' + url.split('/').splice(3).join('/');

      return result;
    }
  });

  return XhrPanel;
});
