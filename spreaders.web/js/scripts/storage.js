spreaders.storage = (function () {


  var storage = function () {
    
  }

  storage.prototype = new spreaders.storageIndexedDb()

  storage.prototype.handleError = function (error) {
    console.log(error);
  }

  storage.prototype.getById = function (callback, parameters, tableName, id, successCallback) {
    if (!this.db) {
      this.addCallback(callback, parameters)
      return
    }

    var transaction = this.createReadTransaction(tableName)
    var objectStore = this.getObjectStore(transaction, tableName)
    var request = objectStore.get(parseInt(id));

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      if (successCallback && typeof successCallback === "function")
        successCallback(event.target.result)
    }
  }

  storage.prototype.getAllOfEntity = function (callback, parameters, tableName, successCallback) {
    if (!this.db) {
      this.addCallback(callback, parameters)
      return
    }
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var objectStore = this.getObjectStore(transaction, tableName)
    var request = objectStore.openCursor()

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.deleted)
          entities.push(cursor.value);
        cursor.continue();
      }
      else {
        successCallback(entities)
      }
    }
  }

  storage.prototype.getFromIndexStore = function (callback, parameters, tableName, indexName, indexValue, successCallback) {
    if (!this.db) {
      this.addCallback(callback, parameters)
      return
    }
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var objectStore = this.getObjectStore(transaction, tableName)
    var request = objectStore.index(indexName).openCursor(indexValue)

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.deleted)
          entities.push(cursor.value);
        cursor.continue();
      }
      else {
        successCallback(entities)
      }
    }
  }

  storage.prototype.addGroup = function (group, callback) {
    if (!this.db) {
      this.addCallback(this.addGroup, [group, callback])
      return
    }
    group.isSyncNeeded = true
    var transaction = this.createReadWriteTransaction(this.dbSchema.groupsTable.tableName)
    var objectStore = this.getObjectStore(transaction, this.dbSchema.groupsTable.tableName)
    var response = objectStore.add(group)

    response.onsuccess = function (e) {
      callback(e.target.result)
    }
  }

  storage.prototype.getAllGroups = function (callback) {
    this.getAllOfEntity(
      this.getAllGroups.bind(this),
      [callback],
      this.dbSchema.groupsTable.tableName,
      callback)
  }

  storage.prototype.getGroup = function (groupId, callback) {
    this.getById(
      this.getGroup.bind(this),
      [groupId, callback],
      this.dbSchema.groupsTable.tableName,
      groupId,
      callback)
  }

  storage.prototype.getGroupsToBeSynced = function (callback) {
    this.getFromIndexStore(this.getGroupsToBeSynced.bind(this), [callback], this.dbSchema.groupsTable.tableName, "isSyncNeeded", "true", callback)
  }


  storage.prototype.addPerson = function (person, callback) {
    if (!this.db) {
      this.addCallback(this.addPerson, [person, callback])
      return
    }

    person.isSyncNeeded = true
    var dbTransaction = this.createReadWriteTransaction(this.dbSchema.peopleTable.tableName)
    var objectStore = this.getObjectStore(dbTransaction, this.dbSchema.peopleTable.tableName)
    var response = objectStore.add(person)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function") {
        person.id = e.target.result
        callback(person)
      }
    }
  }

  storage.prototype.getPeople = function (groupId, callback)
  {
    if (!this.db) {
      this.addCallback(this.getPeople, [groupId, callback])
      return
    }

    var transaction = this.createReadTransaction(this.dbSchema.peopleTable.tableName)
    var objectStore = this.getObjectStore(transaction, this.dbSchema.peopleTable.tableName)

    var people = []

    var index = objectStore.index("groupId")
    var cursorRequest = index.openCursor(groupId)

    cursorRequest.onerror = function (error) {
      alert(error);
    };


    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.deleted)
          people.push(cursor.value);
        cursor.continue();
      }
      else {
        callback(people)
      }
    };
  }

  storage.prototype.addTransaction = function (transaction, callback) {
    if (!this.db) {
      this.addCallback(this.addTransaction, [transaction, callback])
      return
    }

    transaction.isSyncNeeded = true
    var dbTransaction = this.createReadWriteTransaction(this.dbSchema.transactionsTable.tableName)
    var objectStore = this.getObjectStore(dbTransaction, this.dbSchema.transactionsTable.tableName)
    var response = objectStore.put(transaction)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function") {
        transaction.id = e.target.result
        callback(transaction)
      }
    }
  }

  storage.prototype.updateTransaction = function (transaction, callback) {
    if (!this.db) {
      this.addCallback(this.addTransaction, [transaction, callback])
      return
    }

    transaction.isSyncNeeded = true
    var dbTransaction = this.createReadWriteTransaction(this.dbSchema.transactionsTable.tableName)
    var objectStore = this.getObjectStore(dbTransaction, this.dbSchema.transactionsTable.tableName)
    var response = objectStore.put(transaction)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function")
        callback(e.target.result)
    }
  }

  storage.prototype.getTransaction = function (transactionId, callback) {
    this.getById(
      this.getTransaction.bind(this),
      [transactionId, callback],
      this.dbSchema.transactionsTable.tableName,
      transactionId,
      callback)
  }

  storage.prototype.getTransactions = function (groupId, callback) {
    this.getFromIndexStore(this.getTransactions.bind(this), [groupId, callback], this.dbSchema.transactionsTable.tableName, "groupId", groupId, callback)
    //if (!this.db) {
    //  this.addCallback(this.getTransactions, [groupId, callback])
    //  return
    //}

    //var transactions = []

    //var transaction = this.createReadTransaction(this.dbSchema.transactionsTable.tableName)
    //var objectStore = this.getObjectStore(transaction, this.dbSchema.transactionsTable.tableName)

    //var index = objectStore.index("groupId")
    //var cursorRequest = index.openCursor(groupId)

    //cursorRequest.onerror = function (error) {
    //  alert(error);
    //}


    //cursorRequest.onsuccess = function (event) {
    //  var cursor = event.target.result;
    //  if (cursor) {
    //    if (!cursor.value.deleted)
    //      transactions.push(cursor.value);
    //    cursor.continue();
    //  }
    //  else {
    //    callback(transactions)
    //  }
    //}
  }

  return storage;

})()