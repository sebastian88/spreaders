


self.onmessage = function (event) {

  self.importScripts('../namespaces.js')
  self.importScripts('../storageIndexedDb.js')
  self.importScripts('../storage.js')

  processEntities(new spreaders.storage())
}
