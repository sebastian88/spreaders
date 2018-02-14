spreaders.storageIndexedDb = (function () {

  var storageIndexedDb = function () {
    this.db
    this.callbacks = []

    this.dbSchema = {
      name: "SpreadersDb",
      version: 3,
      groupsTable: {
        tableName: "groups",
        keyPath: "id",
        autoIncrement: true,
        index: ["externalId", "isDeleted", "isSyncNeeded", "createdOn", "updatedOn"],
        unique: [true, false, false]
      },
      peopleTable: {
        tableName: "people",
        keyPath: "id",
        autoIncrement: true,
				index: ["externalId", "groupId", "isDeleted", "isSyncNeeded", "createdOn", "updatedOn"],
        unique: [true, false, false, false]
      },
      transactionsTable: {
        tableName: "transactions",
        keyPath: "id",
        autoIncrement: true,
        index: ["externalId", "groupId", "isDeleted", "isSyncNeeded", "createdOn", "updatedOn"],
        unique: [true, false, false, false]
      }
    }

    if (indexedDB)
      this.localIndexedDb = indexedDB
    else
      this.localIndexedDb = window.indexedDB
  };

  storageIndexedDb.prototype.handleError = function (event) {
    reject("Error")
  }

  storageIndexedDb.prototype.handleSuccess = function (event) {
    this.db = event.target.result
    resolve()
  }

  storageIndexedDb.prototype.connect = function () {
    return new Promise((resolve, reject) => {
      var request = this.localIndexedDb.open(this.dbSchema.name, this.dbSchema.version)
      request.onupgradeneeded = function(event){
        this.createDatabase(event)
        event.target.transaction.oncomplete = function(event) {
          resolve()
        }
      }.bind(this)
      request.onsuccess =  function(event){
        this.db = event.target.result
        resolve()
      }.bind(this)
      request.onerror = function(event){
        this.handleError(event)
        reject("Error")
      }.bind(this)
    })
  }

  storageIndexedDb.prototype.createDatabase = function (event) {
    this.db = event.target.result;
    this.db = event.target.result;

    this.createTable(this.db, this.dbSchema.groupsTable)
    this.createTable(this.db, this.dbSchema.peopleTable)
    this.createTable(this.db, this.dbSchema.transactionsTable)
  }

  storageIndexedDb.prototype.createTable = function (db, tables) {
    if (!db.objectStoreNames.contains(tables.tableName)) {
      var OS = db.createObjectStore(tables.tableName, {
        keyPath: tables.keyPath,
        autoIncrement: tables.autoIncrement
      });

      for (var j in tables.index) {
        OS.createIndex(tables.index[j], tables.index[j], {
          unique: tables.unique[j]
        });
      }
    }
  }

  storageIndexedDb.prototype.isSupported = function () {
    var isSupported = true
    if (!this.localIndexedDb)
      isSupported = false
    return isSupported
  }

  storageIndexedDb.prototype.createReadWriteTransaction = function (tableName) {
    var transaction = this.db.transaction(tableName, "readwrite")
    return this.getObjectStore(transaction, tableName)
  }

  storageIndexedDb.prototype.createReadTransaction = function (tableName) {
    var transaction = this.db.transaction(tableName, "readonly")
    return this.getObjectStore(transaction, tableName)
  }

  storageIndexedDb.prototype.getObjectStore = function (transaction, table) {
    return transaction.objectStore(table);
  }

  storageIndexedDb.prototype.generateUUID = function () {
    var d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
  }

  return storageIndexedDb
})()
