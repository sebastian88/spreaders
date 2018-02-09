self.importScripts('/js/scripts/namespaces.js', 
'/js/scripts/model/transaction.js',
'/js/scripts/model/person.js',
'/js/scripts/model/group.js',
'/js/scripts/storageIndexedDb.js', 
'/js/scripts/storage.js', 
'/js/scripts/apiService.js', 
'/js/scripts/sync/synchroniser.js', 
'/js/scripts/urlService.js',
'/js/scripts/sync/entityUpdater.js')

var cacheName = 'spreaders-cachev1'
var immutableRequests = [] 
var mutableRequests = [
  "/groups/", 
  "/groups/transactions", 
  "/groups/transactions/add", 
  "/groups/people",
  "/groups/people/edit"]

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
  event.waitUntil(caches.open("cache-v2").then(function (cache) {
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

self.addEventListener('fetch', function(e) {
    //console.log("fetched") 
});

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


// synchroniser.syncEntities()
// .then(() => apiService.getGroupPromise(groupId))
// .then(groupInformation => synchroniser.UpdateGroup(groupInformation))
// .then(updateNeeded => {
//   if(updateNeeded)
//     sendMessageToClient(urlService.getTransactionsPage(groupId).slice(0, -1), "reload")
//   resolve()
// })
// .catch(err => {reject(err)})