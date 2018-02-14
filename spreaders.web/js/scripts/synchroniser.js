spreaders.sync.synchroniser = (function () {

  var synchroniser = function (storage, apiService) {
    this.storage = storage
    this.apiService = apiService
    this.groupsAddedToJson = false
    this.peopleAddedToJson = false
    this.transactionsAddedToJson = false
    this.syncedGroups = []
    this.syncedPeople = []
    this.syncedTransactions = []
  }

  synchroniser.prototype.syncEntities = async function () {
    this.apiUpdateJsonModel = {
      "groups": [],
      "people": [],
      "transactions": []
    }
    var groups = await this.storage.getGroupsForSync()
    var people = await this.storage.getPeopleForSync()
    var transactions = await this.storage.getTransactionsForSync()

    this.apiUpdateJsonModel.groups = this.createGroupsJson(groups)
    this.apiUpdateJsonModel.people = this.createPeopleJson(people)
    this.apiUpdateJsonModel.transactions = this.createTransactionsJson(transactions)

    return this.makeRequest();
  }

  synchroniser.prototype.createGroupsJson = function (groups) {
    groupsJson = []
    for (var i = 0; i < groups.length; i++) {
      groupsJson.push({
        "id": groups[i].externalId,
        "name": groups[i].name,
        "isDeleted": groups[i].isDeleted,
        "createdOn": groups[i].createdOn,
        "updatedOn": groups[i].updatedOn
      })
      this.syncedGroups.push(groups[i])
    }
    return groupsJson
  }

  synchroniser.prototype.createPeopleJson = function (people) {
    peopleJson = []
    for (var i = 0; i < people.length; i++) {
      peopleJson.push({
        "id": people[i].externalId,
        "name": people[i].name,
        "colour": people[i].colour,
        "isDeleted": people[i].isDeleted,
        "groupId": people[i].groupId,
        "createdOn": people[i].createdOn,
        "updatedOn": people[i].updatedOn
      })
      this.syncedPeople.push(people[i])
    }
    return peopleJson
  }

  synchroniser.prototype.createTransactionsJson = function (transactions) {
    transactionJson = []
    for (var i = 0; i < transactions.length; i++) {
      transactionJson.push({
        "id": transactions[i].externalId,
        "amount": transactions[i].amount,
        "description": transactions[i].description,
        "createdOn": transactions[i].createdOn,
        "updatedOn": transactions[i].updatedOn,

        // reference objects
        "payerId": transactions[i].payer,
        "payees": transactions[i].payees,
        "isDeleted": transactions[i].isDeleted,
        "groupId": transactions[i].groupId
      })
      this.syncedTransactions.push(transactions[i])
    }
    return transactionJson
  }

  synchroniser.prototype.makeRequest = async function () {
    return new Promise((resolve, reject) => {
      if (!this.isSyncNeeded())
        resolve()
      else {
        this.apiService.syncWithFetch(this.apiUpdateJsonModel).then(() => {
          this.setEntitiesToSynced()
          resolve()
        })
      }
    })
  }

  synchroniser.prototype.isSyncNeeded = function () {
    if (this.apiUpdateJsonModel.groups.length > 0
      || this.apiUpdateJsonModel.people.length > 0
      || this.apiUpdateJsonModel.transactions.length > 0) {
      return true
    }
    else {
      return false
    }
  }

  synchroniser.prototype.setEntitiesToSynced = function () {
    this.processResponseEntities(
      this.syncedGroups,
      this.storage.getGroup.bind(this.storage),
      this.storage.updateGroup.bind(this.storage),
      this.mapEntity)

    this.processResponseEntities(
      this.syncedPeople,
      this.storage.getPerson.bind(this.storage),
      this.storage.updatePerson.bind(this.storage),
      this.mapEntity)

    this.processResponseEntities(
      this.syncedTransactions,
      this.storage.getTransaction.bind(this.storage),
      this.storage.updateTransaction.bind(this.storage),
      this.mapEntity)
  }

  synchroniser.prototype.mapEntity = function (existingEntity, newEntity) {
    existingEntity.isSyncNeeded = 0
    return existingEntity
  }

  synchroniser.prototype.processResponseEntities = function (entities, getEntityFunction, updateEntityFunction, mapper) {
    for (var i = 0; i < entities.length; i++) {
      this.processResponseEntity(entities[i], getEntityFunction, updateEntityFunction, mapper)
    }
  }

  synchroniser.prototype.processResponseEntity = function (serverEntity, getEntityFunction, updateEntityFunction, mapper) {
    // var entityUpdater = new spreaders.entityUpdater()
    // entityUpdater.externalEntity = entity
    // entityUpdater.updateFunction = callback
    // entityUpdater.mapper = mapper
    // getEntityFunction(entity.externalId, entityUpdater.update.bind(entityUpdater))

    getEntityFunction(serverEntity.externalId).then((clientEntity) => {
      clientEntity = mapper(clientEntity, serverEntity)
      updateEntityFunction(clientEntity, 0)
    })
  }

  synchroniser.prototype.mapGroup = function (existingGroup, newGroup) {
    if(!existingGroup)
      existingGroup = new spreaders.model.group()
    
    existingGroup.externalId = newGroup.id
    existingGroup.name = newGroup.name
    existingGroup.createdOn = newGroup.createdOn
    existingGroup.updatedOn = newGroup.updatedOn
    existingGroup.isDeleted = 0
    if(newGroup.isDeleted)
      existingGroup.isDeleted = 1
    existingGroup.isSyncNeeded = 0
    return existingGroup
  }

  synchroniser.prototype.mapPerson = function (existingPerson, newPerson) {
    if(!existingPerson)
      existingPerson = new spreaders.model.person()
    
    existingPerson.externalId = newPerson.id
    existingPerson.groupId = newPerson.groupId
    existingPerson.name = newPerson.name
    existingPerson.colour = newPerson.colour
    existingPerson.createdOn = newPerson.createdOn
    existingPerson.updatedOn = newPerson.updatedOn
    existingPerson.isDeleted = 0
    if(newPerson.isDeleted)
      existingPerson.isDeleted = 1
		existingPerson.isSyncNeeded = 0
    return existingPerson
  }

  synchroniser.prototype.mapTransaction = function (existingTransaction, newTransaction) {
    if(!existingTransaction)
      existingTransaction = new spreaders.model.transaction()
    
    existingTransaction.externalId = newTransaction.id
    existingTransaction.groupId = newTransaction.groupId
    existingTransaction.payees = newTransaction.payees
    existingTransaction.payer = newTransaction.payerId
    existingTransaction.amount = newTransaction.amount
    existingTransaction.description = newTransaction.description
    existingTransaction.createdOn = newTransaction.createdOn
    existingTransaction.updatedOn = newTransaction.updatedOn
    existingTransaction.isDeleted = 0
    if(newTransaction.isDeleted)
      existingTransaction.isDeleted = 1
    existingTransaction.createdOn = newTransaction.createdOn
    existingTransaction.updatedOn = newTransaction.updatedOn
    existingTransaction.isSyncNeeded = 0
    return existingTransaction
  }

  synchroniser.prototype.checkForGroupUpdates = function(groupId, callback) {
    this.apiService.getGroup(groupId, this.UpdateGroup.bind(this), callback)
  }

  synchroniser.prototype.UpdateGroup = function (groupInformation) {
    return new Promise((resolve, reject) => {
      if(!groupInformation)
        reject("no group infomation passed in")

      var promises = []
      
      var groupPromise = this.storage.addOrUpdateGroup(
        groupInformation.group, 
        this.mapGroup, 
        this.isGroupIdentical)
      promises.push(groupPromise)
      
      for(var i = 0; i < groupInformation.people.length; i++) { 
        var personPromise = this.storage.addOrUpdatePerson(
          groupInformation.people[i], 
          this.mapPerson, 
          this.isPersonIdentical)
        promises.push(personPromise)
      }
        
      for(var i = 0; i < groupInformation.transactions.length; i++) {
        var transactionPromise = this.storage.addOrUpdateTransaction(
          groupInformation.transactions[i], 
          this.mapTransaction, 
          this.isTransactionIdentical.bind(this))
        promises.push(transactionPromise)
      }

      Promise.all(promises).then(values => {
        var anyEntitiesUpdated = values.includes(true)
        resolve(anyEntitiesUpdated)
      }, function (){}.bind(this))
    })
  }

  synchroniser.prototype.isGroupIdentical = function(clientGroup, serverGroup) {
    if(!clientGroup)
      return false
    
    if(clientGroup.name != serverGroup.name)
      return false

    if(clientGroup.isDeleted != serverGroup.isDeleted)
      return false
    
    return true
  }

  synchroniser.prototype.isPersonIdentical = function(clientPerson, serverPerson) {
    if(!clientPerson)
      return false
    
    if(clientPerson.name != serverPerson.name)
      return false

    if(clientPerson.colour != serverPerson.colour)
      return false
    
    if(clientPerson.isDeleted != serverPerson.isDeleted)
      return false

    return true
  }

  synchroniser.prototype.isTransactionIdentical = function(clientTransaction, serverTransaction) {
    if(!clientTransaction)
      return false

    if(!this.areArraysEqual(clientTransaction.payees, serverTransaction.payees))
      return false

    if(clientTransaction.payer != serverTransaction.payerId)
      return false

    if(clientTransaction.amount != serverTransaction.amount)
      return false

    if(clientTransaction.description != serverTransaction.description)
      return false

    if(clientTransaction.isDeleted != serverTransaction.isDeleted)
      return false

    return true
  }

  synchroniser.prototype.areArraysEqual = function(array1, array2) {
    if(!array1 && !array2)
      return true

    if(!array1 || !array2)
      return false

    if(array1.length != array2.length)
      return false

    for(var i = 0; i < array1.length; i++) {
      if(!array2[i].includes(array1[i]))
        return false
    }
    
    return true;
  }

  synchroniser.prototype.isServiceWorkerAvailable = function() {
    return "serviceWorker" in navigator
  }

  synchroniser.prototype.startServiceWorker = function() {
    if(this.isServiceWorkerAvailable()) {
      navigator.serviceWorker.register("/serviceWorker.js")
      .then(function(registration) {
      }).catch(function(err) {
      })
    }
  }

  synchroniser.prototype.syncWithServer = function() {
    if(this.isServiceWorkerAvailable()) {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.sync.register("sync-updated-entities")
      })
    }
  }

  synchroniser.prototype.getUpdatesForGroup = function(groupId) {
    if(this.isServiceWorkerAvailable()) {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.sync.register("sync-group-" + groupId)
      })
    }
  }

  return synchroniser
})()