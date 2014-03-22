// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

module.exports = function Xhr(xhr) {
  this.name = xhr.name || 'XHR';
  this.method = xhr.method || 'GET';
  this.url = xhr.url || 'http://';
  this.info = xhr.info || null;
  this.callCount = xhr.callCount || 0;

  // headers: [
  //   {
  //     header: 'Content-Type',
  //     options: ['application/json', 'application/xml'],
  //     selected: 'application/json',
  //     required: false
  //   }
  // ],
  this.headers = xhr.headers || [];

  // queryParameters: [
  //   {
  //     queryParameter: 'Authorization',
  //     options: [],
  //     selected: 'API_KEY',
  //     required: false
  //   }
  // ]
  this.queryParameters = xhr.queryParameters || [];
  this.body = xhr.body || '';
  this.corsEnabled = xhr.corsEnabled || false;
  this.depricated = xhr.depricated || false;
  this.isPublic = xhr.isPublic || true;
  this.tags = xhr.tags || [];

  // stars: ['userId']
  this.stars = xhr.stars || [];

  // user GUID
  this.owner = xhr.owner || null;

  // forks: [
  //   'forkedId'
  // ],
  this.forks = xhr.forks || [];
  this.forkedFrom = xhr.forkedFrom || null;
};
