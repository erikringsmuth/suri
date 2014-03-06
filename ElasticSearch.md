## Host
https://fxgkq15w:hk76uwqbxpfp25re@rowan-3702531.us-east-1.bonsai.io/
http://localhost:9200/

## Index
suri-ci

## Types
xhr

## HTTPie

http POST http://localhost:9200/suri-ci

http PUT http://localhost:9200/suri-ci/xhr/1 name="Google Typeahead" method="GET" url="http://suggestqueries.google.com/complete/search?client=firefox&q={{searchTerm}}" info="More information at http://shreyaschand.com/blog/2013/01/03/google-autocomplete-api/"

http PUT http://localhost:9200/suri-ci/xhr/2 name="Google Search" method="GET" url="https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}" info=""

http GET http://localhost:9200/suri-ci/xhr/1


http POST http://localhost:9200/suri-ci/xhr/ name="Yet Another Google Search" method="GET" url="https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}" info=""

http HEAD http://localhost:9200/suri-ci/xhr/1

http GET http://localhost:9200/suri-ci/xhr/1/_source

http DELETE http://localhost:9200/suri-ci/xhr/s2RTMUPgQQCINGv5Jcc9GQ




## xhr IDs
s2RTMUPgQQCINGv5Jcc9GQ
1
2



## XHR JSON
{
  "name": "Yet another Google Search",
  "method": "GET",
  "url": "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}",
  "info": "yet another"
}


http POST https://fxgkq15w:hk76uwqbxpfp25re@rowan-3702531.us-east-1.bonsai.io/suri-ci/xhr name="Google Search" method="GET" url="https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q={{searchTerm}}" info=""


## Short GUID
npm install shortid --save

## DATA

### XHR
{
  name: 'XHR',
  method: 'GET',
  url: 'http://',
  info: null,
  created: new Date(),
  changed: new Date(),
  callCount: 0,
  headers: [
    {
      header: 'Content-Type',
      values: ['application/json', 'application/xml'],
      default: 'application/json',
      required: false
    }
  ],
  body: '',
  corsEnabled: false,
  depricated: false,
  public: true,
  tags: [],
  stars: [
    {
      user: '',
      date: new Date()
    }
  ],
  owner: '',
  forks: [
    'forkedId'
  ],
  forkedFrom: null
}


### User
{
  id: '',
  username: '',
  gitHubId: null,
  stars: [
    {
      id: '',
      date: new Date()
    }
  ],
  following: [
    'userId'
  ],
  followers: [
    'userId'
  ]
}


## Aggregating data

### Most called
search xhr boost callCount

### Most starred
search xhr boost stars.length

### Most followed
search users boost followers


## My stars, following, followed by

### Logs
do logs later to track trends
