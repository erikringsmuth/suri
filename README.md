## suri.io

> Explore REST APIs!

This is the code that powers [http://www.suri.io/](http://www.suri.io/). The source is released under the MIT license. Explore to your heart's content. You can run your own instance as a private API explorer.

## To-do
- [ ] Choose from pre-populated list of headers with autocomplete
- [ ] Choose from pre-populated list of query parameters with autocomplete
- [ ] Switch to Google's OAuth node module
- [ ] Support API keys (design needed)
- [ ] User variables to populate API keys, query parameters, headers, etc.
- [ ] Cache current API sequence in localStorage
- [ ] Search or filter by host name
- [ ] Pipe output from API to variables in next API in the sequence
- [ ] Redirect to current page on sign-on
- [ ] Switch all CSS to SASS and build with gulp task

## Build and run

#### Set Up
- Create a `config.json` with these environment variables
  - ENV
  - LOCAL_ELASTICSEARCH_URL
  - PROD_ELASTICSEARCH_URL
  - ELASTICSEARCH_URL
  - SESSION_SECRET
  - CLIENT_ID
  - CLIENT_SECRET
  - NEW_RELIC_LICENSE_KEY
  - XHR_INDEX
  - USER_INDEX
  - XHR_TYPE
  - USER_TYPE
- Start an elasticsearch instance
- Create indexes and populate example content with `node ./shell_scripts/populateElasticsearch.js`

#### Run
`npm run-script local`

#### Test, lint, watch
`gulp`

#### Test only
`mocha`

#### Optimize client-side RequireJS code
`node r.js -o app.build.js`

## License
Released under the MIT license.
