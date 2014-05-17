## suri.io

> Explore REST APIs!

[http://www.suri.io/](http://www.suri.io/)

Set Up
- Create a `config.json` with these environment variables: ENV, LOCAL_ELASTICSEARCH_URL, PROD_ELASTICSEARCH_URL, ELASTICSEARCH_URL, SESSION_SECRET, CLIENT_ID, CLIENT_SECRET, NEW_RELIC_LICENSE_KEY, XHR_INDEX, USER_INDEX, XHR_TYPE, USER_TYPE
- Start an elasticsearch instance
- Create indexes and populate example content with `node ./shell_scripts/populateElasticsearch.js`

Run
`npm run-script local`

Test, lint, watch
`gulp`

Test only
`mocha`

Optimize client-side code
`node r.js -o app.build.js`
