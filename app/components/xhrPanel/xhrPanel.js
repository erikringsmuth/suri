// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
define([
  'ractive',
  'text!./xhrPanelTemplate.html',
  'components/apiSequence/sequence',
  'components/util/utilities',
  'prettify'
], function(Ractive, xhrPanelTemplate, sequence, utilities, prettify) {
  'use strict';

  return Ractive.extend({
    template: xhrPanelTemplate,

    el: '#api-sequence-placeholder',

    append: true,

    data: {
      name: 'XHR',
      method: 'GET',
      url: 'http://',
      autosend: false,
      responseBody: '',
      get responseBodyLength() { return (this.responseBody.length).toLocaleString(); },
      sendButtonClass: 'default',
      sendButtonDisabled: false,
      showMoreButton: false,
    },

    init: function() {
      // All panels
      sequence.push(this);
      this.set('id', utilities.guid());

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
        close: function close() {
          this.detach();
          sequence.splice(sequence.indexOf(this), 1);
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
            this.xhr.send(this.nodes.requestBody.innerText);
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
            if (contentType.indexOf('json') !== -1 || contentType.indexOf('javascript') !== -1) {
              this.set('responseBody', JSON.stringify(JSON.parse(this.xhr.response), null, 2));
            } else if (contentType.indexOf('xml') !== -1) {
              this.set('responseBody', this.xhr.responseXML);
            } else if (contentType.indexOf('html') !== -1) {
              this.set('responseBody', this.xhr.response
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&quot;')
                .replace(/'/g, '&#039;')
              );
            } else {
              this.set('responseBody', this.xhr.response);
            }
          } else {
            this.set('responseBody', this.xhr.response);
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
    },

    parsedRequestHeaders: function parsedRequestHeaders() {
      var headers = {};
      var headerLines = this.nodes.requestHeaders.innerText.split('\n');
      if (headerLines.length === 1 && headerLines[0].trim() === '') {
        // because callling split on an empty string returns ['']
        headerLines = [];
      }
      for (var i = 0; i < headerLines.length; i++) {
        var headerParts = headerLines[i].split(':');
        headers[headerParts[0].trim()] = headerParts.splice(1).join(':').trim();
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
      result.host = 'http://' + url.split('/')[2] + '/';
      result.path = '/' + url.split('/').splice(3).join('/');

      return result;
    }
  });
});
