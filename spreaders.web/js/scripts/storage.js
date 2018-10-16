spreaders.storage = (function () {

  var storage = function () {}

  storage.prototype = new spreaders.storageIndexedDb()

  storage.prototype.handleError = function (error) {
    console.log(error)
  }

  storage.prototype.getUtcUnixTimeStamp = function () {
    return Math.floor((new Date()).getTime() / 1000)
  }

  storage.prototype.addEntity = function (entity, tableName) {
    return new Promise((resolve, reject) => {
      entity.externalId = this.generateUUID()
      entity.isSyncNeeded = 1
      var transaction = this.createReadWriteTransaction(tableName)
      var response = transaction.add(entity)

      response.onerror = function(e) {
        reject(e)
      }

      response.onsuccess = function (e) {
        entity.id = e.target.result
        resolve(entity)
      }
    })
  }

  storage.prototype.getAllOfEntity = function(tableName) {
    return new Promise((resolve, reject) => {
      var entities = []
      
      var transaction = this.createReadTransaction(tableName)
      var request = transaction.openCursor()
  
      request.onerror = function(event) {
        reject(event)
      }
  
      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          if (!cursor.value.isDeleted)
            entities.push(cursor.value);
          cursor.continue();
        }
        else {
          resolve(entities)
        }
      }
    })
  }

  storage.prototype.getFromIndexStore = function (tableName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      var entities = []
      
      var transaction = this.createReadTransaction(tableName)
      var request = transaction.index(indexName).openCursor(indexValue)
  
      request.onerror = function(event) {
        reject(event)
      }
  
      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          if (!cursor.value.isDeleted)
            entities.push(cursor.value);
          cursor.continue();
        }
        else {
          resolve(entities)
        }
      }
    })
  }
  
  storage.prototype.getAllFromIndexStore = function (tableName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      var entities = []

      var transaction = this.createReadTransaction(tableName)
      var request = transaction.index(indexName).openCursor(indexValue)

      request.onerror = function (event) {
        reject(event)
      }

      request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          entities.push(cursor.value);
          cursor.continue();
        }
        else {
          resolve(entities)
        }
      }
    })
  }

  storage.prototype.getOneFromIndexStore = function (tableName, indexName, indexValue) {
    return new Promise((resolve, reject) => {

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

  storage.prototype.updateEntity = function (tableName, entityToBeUpdated, isSyncNeeded) {
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

  storage.prototype.addOrUpdateEntity = function (tableName, entityToBeUpdated, mapper, isIdentical) {

    return new Promise((resolve, reject) => {
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
        
        if(isIdentical(entity, entityToBeUpdated)){
          resolve(false)
        }
        else{
          var updatedEntity = mapper(entity, entityToBeUpdated)

          var transaction = this.createReadWriteTransaction(tableName)
          var response = transaction.put(updatedEntity)

          response.onsuccess = function (e) {
                    
            resolve(true)
          }
        }
      }.bind(this)
    })
  }

  storage.prototype.addGroup = function (group) {
    return this.addEntity(group, this.dbSchema.groupsTable.tableName)
  }

  storage.prototype.updateGroup = function (group, isSyncNeeded) {
    return this.updateEntity(
      this.dbSchema.groupsTable.tableName,
      group,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdateGroup = function (group, mapper, isIdentical) {
    return this.addOrUpdateEntity(
      this.dbSchema.groupsTable.tableName,
      group,
      mapper,
      isIdentical)
  }

  storage.prototype.getAllGroups = function () {
    return this.getAllOfEntity(this.dbSchema.groupsTable.tableName)
  }

  storage.prototype.getGroup = function (groupId) {
    return this.getOneFromIndexStore(
      this.dbSchema.groupsTable.tableName,
      "externalId",
      groupId)
  }

  storage.prototype.getGroupsForSync = function () {
    return this.getAllFromIndexStore(
      this.dbSchema.groupsTable.tableName,
      "isSyncNeeded",
      1)
  }

  storage.prototype.addPerson = function (person) {
    return this.addEntity(person, this.dbSchema.peopleTable.tableName)
  }

  storage.prototype.updatePerson = function (person, isSyncNeeded) {
    return this.updateEntity(
      this.dbSchema.peopleTable.tableName,
      person,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdatePerson = function (person, mapper, isIdentical) {
    return this.addOrUpdateEntity(
      this.dbSchema.peopleTable.tableName,
      person,
      mapper,
      isIdentical)
  }

  storage.prototype.getPeopleForSync = function () {
    return this.getAllFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "isSyncNeeded",
      1)
  }
  
  storage.prototype.getPeopleForGroup = function (groupId) {
    return this.getAllFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "groupId",
      groupId)
  }

  storage.prototype.getPerson = function (personId) {
    return this.getOneFromIndexStore(
      this.dbSchema.peopleTable.tableName,
      "externalId",
      personId)
  }

  storage.prototype.addTransaction = function (transaction) {
    return this.addEntity(transaction, this.dbSchema.transactionsTable.tableName)
  }

  storage.prototype.updateTransaction = function (transaction, isSyncNeeded) {
    return this.updateEntity(
      this.dbSchema.transactionsTable.tableName,
      transaction,
      isSyncNeeded)
  }

  storage.prototype.addOrUpdateTransaction = function (transaction, mapper, isIdentical) {
    return this.addOrUpdateEntity(
      this.dbSchema.transactionsTable.tableName,
      transaction,
      mapper,
      isIdentical)
  }

  storage.prototype.getTransaction = function (transactionId) {
    return this.getOneFromIndexStore(
      this.dbSchema.transactionsTable.tableName,
      "externalId",
      transactionId)
  }

  storage.prototype.getTransactionsSortedByCreatedDate = function (groupId) {
    return this.getFromIndexStore(this.dbSchema.transactionsTable.tableName, "groupId", groupId)
      .then((transactions) => {
        return this.sortByCreatedDate(transactions)
      })
  }
  
  storage.prototype.sortByCreatedDate = function (entities) {
    entities.sort(function (a, b) {
        return b.createdOn - a.createdOn
    });
    return entities
  }

  storage.prototype.getTransactions = function (groupId) {
    return this.getFromIndexStore(this.dbSchema.transactionsTable.tableName, "groupId", groupId)
	}

  storage.prototype.getTransactionsForSync = function () {
    return this.getAllFromIndexStore(
      this.dbSchema.transactionsTable.tableName,
      "isSyncNeeded",
      1)
  }

  return storage;

})()