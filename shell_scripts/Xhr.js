// Copyright (C) 2014 Erik Ringsmuth <erik.ringsmuth@gmail.com>
'use strict';

module.exports = function Xhr(xhr) {
  this.name = xhr.name || 'XHR';
  this.method = xhr.method || 'GET';
  this.url = xhr.url || 'http://';
  this.info = xhr.info || null;
  this.callCount = xhr.callCount || 0;

  // headerOptions: [
  //   {
  //     header: 'Content-Type',
  //     values: ['application/json', 'application/xml'],
  //     default: 'application/json',
  //     required: false
  //   }
  // ],
  this.headerOptions = xhr.headerOptions || [];
  this.headers = xhr.headers || '';

  // queryParameterOptions: [
  //   {
  //     parameter: 'key',
  //     values: [],
  //     default: 'API_KEY',
  //     required: false
  //   }
  // ]
  this.queryParameterOptions = xhr.queryParameterOptions || [];
  this.body = xhr.body || '';
  this.corsEnabled = xhr.corsEnabled || false;
  this.depricated = xhr.depricated || false;
  this.isPublic = xhr.isPublic || true;
  this.tags = xhr.tags || [];

  // stars: [
  //   {
  //     user: '',
  //     date: Date.now()
  //   }
  // ]
  this.stars = xhr.stars || [];

  // user GUID
  this.owner = xhr.owner || null;
  this.ownerMd5 = xhr.ownerMd5 || null;


  // forks: [
  //   'forkedId'
  // ],
  this.forks = xhr.forks || [];
  this.forkedFrom = xhr.forkedFrom || null;
};
