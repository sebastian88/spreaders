self.onmessage = function (event) {

  self.importScripts('../namespaces.js', '../storageIndexedDb.js', '../storage.js', '../apiService.js', 'synchroniser.js')

  var storage = new spreaders.storage()
  storage.connect().then(data => {
    var apiService = new spreaders.apiService()
    var synchroniser = new spreaders.sync.synchroniser(storage, apiService)
    synchroniser.syncEntities()
    syncTimeout(synchroniser)
  })
}

function syncTimeout(syncroniser) {
  setTimeout(function () {
    syncroniser.syncEntities()
    syncTimeout(syncroniser)
  }, 5000)
}