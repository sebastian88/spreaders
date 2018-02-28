self.importScripts('/js/live/library.js')

var CACHE_NAME = 'spreaders-cache-v7'
var immutableRequests = []
var mutableRequests = [
  "/groups/", 
  "/groups/transactions/", 
  "/groups/transactions/add/", 
  "/groups/people/",
  "/groups/people/edit/",
  "/js/live/library.js",
  "/js/live/pages/groups.js",
  "/js/live/pages/people.js",
  "/js/live/pages/person.js",
  "/js/live/pages/transaction.js",
  "/js/live/pages/transactions.js",
  "/css/main.css",
  "/img/transaction-icon.svg",
  "/img/spreaders-logo.svg",
  "/img/spreaders-logo16.png",
  "/img/spreaders-logo192.png",
  "/img/spreaders-logo512.png",
  "https://fonts.googleapis.com/css?family=Roboto:100,300,400,900"
]

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function (cacheNames) { 
    return Promise.all(cacheNames.map(function (cacheName) { 
      if(CACHE_NAME !== cacheName && cacheName.startsWith("spreaders-cache")) {
        return caches.delete(cacheName)
      }
    }))
  }))
})

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    var newImmutableRequests = [] 
    return Promise.all(immutableRequests.map(function(url) { 
      return caches.match(url).then(function (response) {
        if(response) {
          return cache.put(url, response)
        } 
        else {
          newImmutableRequests.push(url)
          return Promise.resolve() 
        }
      }) 
    })).then(function() {
      return cache.addAll(newImmutableRequests.concat(mutableRequests)) 
    }) 
  }))
})

self.addEventListener("fetch", function(event) {
  var url = event.request.url
  
  if (url.substr(-1) != '/') 
    url += '/'

  if(matchUrl(url, '*/groups/*/transactions/')) 
    event.respondWith(matchCacheOrFetch("/groups/transactions/", event.request))
  
  else if(matchUrl(url, '*/groups/*/transactions/add/'))
    event.respondWith(matchCacheOrFetch("/groups/transactions/add/", event.request))
  
  else if(matchUrl(url, '*/groups/*/transactions/*'))
    event.respondWith(matchCacheOrFetch("/groups/transactions/add/", event.request))
  
  else if(matchUrl(url, '*/groups/*/people/'))
    event.respondWith(matchCacheOrFetch("/groups/people/", event.request))
  
  else if(matchUrl(url, '*/groups/*/people/*'))
    event.respondWith(matchCacheOrFetch("/groups/people/edit/", event.request))
  
  else if(matchUrl(url, '*/groups/'))
    event.respondWith(matchCacheOrFetch("/groups/", event.request))

  else event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request)
  })) 
})

var matchCacheOrFetch = function(cache, request) {
  return caches.match(cache).then((response) => {
    return response || fetch(request)
  })
}

self.addEventListener("sync", event => {
  if(event.tag.startsWith("sync-group-")) {
    event.waitUntil(syncGroup(event.tag.slice(11)))
  }
  if(event.tag.startsWith("sync-updated-entities")) {
    event.waitUntil(syncUpdatedEntities())
  }
})

var syncUpdatedEntities = function() {
  return new Promise((resolve, reject) => {
    var storage = new spreaders.storage()
    storage.connect().then(data => {
      var apiService = new spreaders.apiService()
      var synchroniser = new spreaders.sync.synchroniser(storage, apiService)
      synchroniser.syncEntities()
      .then(() => {resolve()})
      .catch(err => {reject(err)})
    })
  })
}

var syncGroup = function(groupId) {
  return new Promise((resolve, reject) => {
    try {
      var storage = new spreaders.storage()
      storage.connect().then(data => {
        var apiService = new spreaders.apiService()
        var synchroniser = new spreaders.sync.synchroniser(storage, apiService)
        var urlService = new spreaders.urlService()
        synchroniser.syncEntities().then(() => {
          apiService.getGroupPromise(groupId).then(groupInformation => {
            synchroniser.UpdateGroup(groupInformation).then(updateNeeded => {
              if(updateNeeded)
                sendMessageToClient(urlService.getTransactionsPage(groupId).slice(0, -1), "reload")
              resolve()
            })
            .catch(err => {reject(err)})
          })
          .catch(err => {reject(err)})
        })
        .catch(err => {reject(err)})
      }) 
    }
    catch (err) {
      reject(err)
    }
  })
}

var sendMessageToClient = function(clientUrl, message) {
  self.clients.matchAll().then(function(allClients){
    for (const client of allClients) {
      if(client.url.includes(clientUrl))
        client.postMessage({action: message})
    }
  })
}

var matchUrl = function(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}