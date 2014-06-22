({
  appDir: 'app',
  baseUrl: '.',
  dir: 'app-built',
  mainConfigFile : 'app/main.js',
  modules: [
    {
      // inline common modules in main.js
      name: 'main',
      include: ['router', 'bootstrap', 'ractive-events-tap', 'rv', 'amd-loader']
    },
    {
      name: 'ace/ace'
    },
    {
      name: 'bower_components/URIjs/src/URI'
    }
  ]
})
