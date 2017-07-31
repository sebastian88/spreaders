spreaders.storage = (function () {

  var storage = function () {
    
  }

  storage.prototype = new spreaders.storageIndexedDb()

  storage.prototype.handleError = function (error) {
    console.log(error);
  }

  storage.prototype.getById = function (tableName, id, successCallback) {

    var transaction = this.createReadTransaction(tableName)
    var request = transaction.get(parseInt(id));

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      if (successCallback && typeof successCallback === "function")
        successCallback(event.target.result)
    }
  }

  storage.prototype.getAllOfEntity = function (tableName, successCallback) {
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var request = transaction.openCursor()

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.isDeleted)
          entities.push(cursor.value);
        cursor.continue();
      }
      else {
        successCallback(entities)
      }
    }
  }

  storage.prototype.getFromIndexStore = function (tableName, indexName, indexValue, successCallback) {
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var request = transaction.index(indexName).openCursor(indexValue)

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.isDeleted)
          entities.push(cursor.value);
        cursor.continue();
      }
      else {
        successCallback(entities)
      }
    }
  }

  storage.prototype.getAllFromIndexStore = function (tableName, indexName, indexValue, successCallback) {
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var request = transaction.index(indexName).openCursor(indexValue)

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        entities.push(cursor.value);
        cursor.continue();
      }
      else {
        successCallback(entities)
      }
    }
  }

  storage.prototype.getOneFromIndexStore = function (tableName, indexName, indexValue, successCallback) {
    var entities = []

    var transaction = this.createReadTransaction(tableName)
    var request = transaction.index(indexName).openCursor(indexValue)

    request.onerror = this.handleError

    request.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor)
        successCallback(cursor.value)
      else
        successCallback(null)
    }
  }

  storage.prototype.getOneFromIndexStorePromise = function (tableName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      var entities = []

      var transaction = this.createReadTransaction(tableName)
      var request = transaction.index(indexName).openCursor(indexValue)

      request.onerror = function (event) {
        reject(event)
      }

      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor)
          resolve(cursor.value)
        else
          resolve(null)
      }
    })
  }

  storage.prototype.updateEntity = function (tableName, entityToBeUpdated, isSyncNeeded, successCallback) {
    if (isSyncNeeded && isSyncNeeded !== 0)
      isSyncNeeded = 1
    else
      isSyncNeeded = 0

    entityToBeUpdated.isSyncNeeded = isSyncNeeded
    var transaction = this.createReadWriteTransaction(tableName)
    var response = transaction.put(entityToBeUpdated)

    response.onsuccess = function (e) {
      if (successCallback && typeof successCallback === "function")
        successCallback(e.target.result)
    }
  }

  storage.prototype.updateEntityPromise = function (tableName, entityToBeUpdated, isSyncNeeded) {
    return new Promise((resolve, reject) => {
      if (isSyncNeeded && isSyncNeeded !== 0)
        entityToBeUpdated.isSyncNeeded = 1
      else
        entityToBeUpdated.isSyncNeeded = 0

      var transaction = this.createReadWriteTransaction(tableName)
      var response = transaction.put(entityToBeUpdated)

      response.onsuccess = function (e) {
        resolve(e.target.result)
      }
    })
  }

  storage.prototype.addOrUpdateEntityPromise = function (tableName, entityToBeUpdated, mapper) {

    return new Promise((resolve, reject) => {
      var entities = []

      var transaction = this.createReadTransaction(tableName)
      var request = transaction.index("externalId").openCursor(entityToBeUpdated.id)

      request.onerror = function (event) {
        reject(event)
      }

      request.onsuccess = function (event) {

        var cursor = event.target.result;
        var entity = null
        if (cursor)
          entity = cursor.value
        
        var updatedEntity = mapper(entity, entityToBeUpdated)

        var transaction = this.createReadWriteTransaction(tableName)
        var response = transaction.put(updatedEntity)

        response.onsuccess = function (e) {
          resolve(e.target.result)
        }
      }.bind(this)
    })
  }

  storage.prototype.addGroup = function (group, callback) {
    group.externalId = this.generateUUID()
    group.isSyncNeeded = 1
    var transaction = this.createReadWriteTransaction(this.dbSchema.groupsTable.tableName)
    var response = transaction.add(group)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function") {
        group.id = e.target.result
        callback(group)
      }
    }
  }

  storage.prototype.updateGroup = function (group, callback, isSyncNeeded) {
    this.updateEntity(
      this.dbSchema.groupsTable.tableName,
      group,
      isSyncNeeded,
      callback)
  }

  storage.prototype.updateGroupPromise = function (group, isSyncNeeded) {
    return this.updateEntityPromise(
      this.dbSchema.groupsTable.tableName,
      group,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdateGroupPromise = function (group, mapper) {
    return this.addOrUpdateEntityPromise(
      this.dbSchema.groupsTable.tableName,
      group,
      mapper)
  }

  storage.prototype.getAllGroups = function (callback) {
    this.getAllOfEntity(
      this.dbSchema.groupsTable.tableName,
      callback)
  }

  storage.prototype.getGroup = function (groupId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.groupsTable.tableName,
      "externalId",
      groupId,
      callback)
  }

  storage.prototype.getGroupPromise = function (groupId) {
    return this.getOneFromIndexStorePromise(
      this.dbSchema.groupsTable.tableName,
      "externalId",
      groupId)
  }

  storage.prototype.getGroupByExternalId = function (groupId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.groupsTable.tableName,
      "externalId",
      groupId,
      callback)
  }

  storage.prototype.getGroupsForSync = function (callback) {
    this.getAllFromIndexStore(
      this.dbSchema.groupsTable.tableName,
      "isSyncNeeded",
      1,
      callback)
  }

  storage.prototype.addPerson = function (person, callback) {
    person.externalId = this.generateUUID()
    person.isSyncNeeded = 1
    var transaction = this.createReadWriteTransaction(this.dbSchema.peopleTable.tableName)
    var response = transaction.add(person)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function") {
        person.id = e.target.result
        callback(person)
      }
    }
  }

  storage.prototype.updatePerson = function (person, callback, isSyncNeeded) {
    this.updateEntity(
      this.dbSchema.peopleTable.tableName,
      person,
      isSyncNeeded,
      callback)
  }

  storage.prototype.updatePersonPromise = function (person, isSyncNeeded) {
    return this.updateEntityPromise(
      this.dbSchema.peopleTable.tableName,
      person,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdatePersonPromise = function (person, mapper) {
    return this.addOrUpdateEntityPromise(
      this.dbSchema.peopleTable.tableName,
      person,
      mapper)
  }

  storage.prototype.getPeople = function (groupId, callback) {

    var transaction = this.createReadTransaction(this.dbSchema.peopleTable.tableName)

    var people = []

    var index = transaction.index("groupId")
    var cursorRequest = index.openCursor(groupId)

    cursorRequest.onerror = function (error) {
      alert(error);
    };


    cursorRequest.onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (!cursor.value.isDeleted)
          people.push(cursor.value);
        cursor.continue();
      }
      else {
        callback(people)
      }
    };
  }

  storage.prototype.getPeopleForSync = function (callback) {
    this.getAllFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "isSyncNeeded",
      1,
      callback)
  }

	storage.prototype.getPeopleForGroup = function (group, callback) {
    this.getFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "groupId",
      group.externalId,
      callback)
	}
	
  storage.prototype.getPerson = function (personId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "externalId",
      personId,
      callback)
  }

  storage.prototype.getPersonByExternalId = function (personId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "externalId",
      personId,
      callback)
  }

  storage.prototype.getPersonPromise = function (personId, callback) {
    return this.getOneFromIndexStorePromise(
      this.dbSchema.peopleTable.tableName,
      "externalId",
      personId)
  }

  storage.prototype.getAllPeople = function (callback) {
    this.getAllOfEntity(
      this.dbSchema.peopleTable.tableName,
      callback)
  }

  storage.prototype.addTransaction = function (transaction, callback) {
    transaction.externalId = this.generateUUID()
    transaction.isSyncNeeded = 1
    var dbTransaction = this.createReadWriteTransaction(this.dbSchema.transactionsTable.tableName)
    var response = dbTransaction.put(transaction)

    response.onsuccess = function (e) {
      if (callback && typeof callback === "function") {
        transaction.id = e.target.result
        callback(transaction)
      }
    }
  }

  storage.prototype.updateTransaction = function (transaction, callback, isSyncNeeded) {
    this.updateEntity(
      this.dbSchema.transactionsTable.tableName,
      transaction,
      isSyncNeeded,
      callback)
  }

  storage.prototype.updateTransactionPromise = function (transaction, isSyncNeeded) {
    return this.updateEntity(
      this.dbSchema.transactionsTable.tableName,
      transaction,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdateTransactionPromise = function (transaction, mapper) {
    return this.addOrUpdateEntityPromise(
      this.dbSchema.transactionsTable.tableName,
      transaction,
      mapper)
  }

  storage.prototype.getTransaction = function (transactionId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.transactionsTable.tableName,
      "externalId",
      transactionId,
      callback)
  }

  storage.prototype.getTransactionPromise = function (transactionId) {
    return this.getOneFromIndexStorePromise(
      this.dbSchema.transactionsTable.tableName,
      "externalId",
      transactionId)
  }

  storage.prototype.getTransactionByExternalId = function (transactionId, callback) {
    this.getOneFromIndexStore(
      this.dbSchema.transactionsTable.tableName,
      "externalId",
      transactionId,
      callback)
  }

  storage.prototype.getTransactions = function (groupId, callback) {
    this.getFromIndexStore(this.dbSchema.transactionsTable.tableName, "groupId", groupId, callback)
	}

	storage.prototype.getTransactionsForGroup = function (group, callback) {
		this.getFromIndexStore(this.dbSchema.transactionsTable.tableName, "groupId", group.externalId, callback)
	}

  storage.prototype.getAllTransactions = function (callback) {
    this.getAllOfEntity(
      this.dbSchema.transactionsTable.tableName,
      callback)
  }

  storage.prototype.getTransactionsForSync = function (callback) {
    this.getAllFromIndexStore(
      this.dbSchema.transactionsTable.tableName,
      "isSyncNeeded",
      1,
      callback)
  }

  return storage;

})()