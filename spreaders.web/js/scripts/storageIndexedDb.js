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
        index: ["externalId", "isSyncNeeded"],
        unique: [true, false]
      },
      peopleTable: {
        tableName: "people",
        keyPath: "id",
        autoIncrement: true,
				index: ["externalId", "groupId", "externalGroupId", "deleted", "isSyncNeeded"],
        unique: [true, false, false, false]
      },
      transactionsTable: {
        tableName: "transactions",
        keyPath: "id",
        autoIncrement: true,
        index: ["externalId", "groupId", "externalGroupId", "deleted", "isSyncNeeded"],
        unique: [true, false, false, false]
      }
    }

    if (indexedDB)
      this.localIndexedDb = indexedDB
    else
      this.localIndexedDb = window.indexedDB

    this.request = this.connect()
  };

  storageIndexedDb.prototype.handleError = function (event) {
    alert("error")
  }

  storageIndexedDb.prototype.handleSuccess = function (event) {
    this.db = event.target.result
    if (this.callbacks[0]) {
      var i
      for (var i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i].callback.apply(this, this.callbacks[i].arguments);
      }
    }
  }

  storageIndexedDb.prototype.connect = function () {
    var request = this.localIndexedDb.open(this.dbSchema.name, this.dbSchema.version)
    request.onupgradeneeded = this.createDatabase.bind(this)
    request.onerror = this.handleError.bind(this)
    request.onsuccess = this.handleSuccess.bind(this)
    return request
  }

  storageIndexedDb.prototype.createDatabase = function (event) {
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

  storageIndexedDb.prototype.addCallback = function (callback, args) {
    this.callbacks.push({ "callback": callback, "arguments": args })
  }

  storageIndexedDb.prototype.createReadWriteTransaction = function (tableNames) {
    return this.db.transaction(tableNames, "readwrite")
  }

  storageIndexedDb.prototype.createReadTransaction = function (tableNames) {
    return this.db.transaction(tableNames, "readonly")
  }

  storageIndexedDb.prototype.getObjectStore = function (transaction, table) {
    return transaction.objectStore(table);
  }

  return storageIndexedDb
})()
