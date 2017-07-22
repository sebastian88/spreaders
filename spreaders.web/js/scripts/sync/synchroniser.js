﻿spreaders.sync.synchroniser = (function () {


  var synchroniser = function (storage, apiService) {
    this.storage = storage
    this.apiService = apiService
    this.groupsAddedToJson = false
    this.peopleAddedToJson = false
    this.transactionsAddedToJson = false
    this.syncedGroups = []
    this.syncedPeople = []
    this.syncedTransactions = []
    this.processEntities()
  }

  synchroniser.prototype.processEntities = function () {
    this.apiUpdateJsonModel = {
      "groups": [],
      "people": [],
      "transactions": []
    }
    this.storage.getGroupsForSync(this.processGroups.bind(this))
    this.storage.getPeopleForSync(this.processPeople.bind(this))
    this.storage.getTransactionsForSync(this.processTransactions.bind(this))
  }

  synchroniser.prototype.processGroups = function (groups) {
    this.apiUpdateJsonModel.groups = this.createGroupsJson(groups)
    this.groupsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processPeople = function (people) {
    this.apiUpdateJsonModel.people = this.createPeopleJson(people)
    this.peopleAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processTransactions = function (transactions) {
    this.apiUpdateJsonModel.transactions = this.createTransactionsJson(transactions)
    this.transactionsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.createGroupsJson = function (groups) {
    groupsJson = []
    for (var i = 0; i < groups.length; i++) {
      groupsJson.push({
        "id": groups[i].externalId,
        "name": groups[i].name,
        "isDeleted": groups[i].isDeleted
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
        "isDeleted": people[i].isDeleted,
        "groupId": people[i].groupId
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

  synchroniser.prototype.makeRequest = function () {
    if (!this.groupsAddedToJson || !this.peopleAddedToJson || !this.transactionsAddedToJson)
      return

    if (!this.isSyncNeeded())
      return

    this.apiService.sync(this.apiUpdateJsonModel, this.setEntitiesToSynced.bind(this))
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
      this.storage.getGroupByExternalId.bind(this.storage),
      this.storage.updateGroup.bind(this.storage),
      this.mapEntity)

    this.processResponseEntities(
      this.syncedPeople,
      this.storage.getPersonByExternalId.bind(this.storage),
      this.storage.updatePerson.bind(this.storage),
      this.mapEntity)

    this.processResponseEntities(
      this.syncedTransactions,
      this.storage.getTransactionByExternalId.bind(this.storage),
      this.storage.updateTransaction.bind(this.storage),
      this.mapEntity)
  }

  synchroniser.prototype.mapEntity = function (existingEntity, newEntity) {
    existingEntity.isSyncNeeded = 0
    return existingEntity
  }

  synchroniser.prototype.processResponseEntities = function (entities, getEntityFunction, callback, mapper) {
    for (var i = 0; i < entities.length; i++) {
      this.processResponseEntity(entities[i], getEntityFunction, callback, mapper)
    }
  }

  synchroniser.prototype.processResponseEntity = function (entity, getEntityFunction, callback, mapper) {
    var entityUpdater = new spreaders.entityUpdater()
    entityUpdater.externalEntity = entity
    entityUpdater.updateFunction = callback
    entityUpdater.mapper = mapper
    getEntityFunction(entity.externalId, entityUpdater.update.bind(entityUpdater))
  }

  synchroniser.prototype.mapGroup = function (existingGroup, newGroup) {
    if(!existingGroup)
      existingGroup = new group()
    
    existingGroup.externalId = newGroup.externalId
    existingGroup.name = newGroup.name
    existingGroup.isDeleted = 0
    if(newGroup.isDeleted)
      existingGroup.isDeleted = 1
    existingGroup.isSyncNeeded = 0
    return existingGroup
  }

  synchroniser.prototype.mapPerson = function (existingPerson, newPerson) {
    if(!existingPerson)
      existingPerson = new person()
    
    existingPerson.externalId = newPerson.externalId
    existingPerson.groupId = newPerson.groupId
		existingPerson.name = newPerson.name
    existingPerson.isDeleted = 0
    if(newPerson.isDeleted)
      existingPerson.isDeleted = 1
		existingPerson.isSyncNeeded = 0
    return existingPerson
  }

  synchroniser.prototype.mapTransaction = function (existingTransaction, newTransaction) {
    if(!existingTransaction)
      existingTransaction = new transaction()
    
    existingTransaction.externalId = newTransaction.externalId
    existingTransaction.groupId = newTransaction.groupId
    existingTransaction.payees = newTransaction.payees
    existingTransaction.payer = newTransaction.payer
    existingTransaction.amount = newTransaction.amount
    existingTransaction.description = newTransaction.description
    existingTransaction.isDeleted = 0
    if(newTransaction.isDeleted)
      existingTransaction.isDeleted = 1
    existingTransaction.isSyncNeeded = 0
    return existingTransaction
  }

  synchroniser.prototype.UpdateGroup = function (groupInformation, callback) {
    this.processResponseEntity(
      groupInformation.group,
      this.storage.getGroupByExternalId.bind(this.storage),
      this.storage.updateGroup.bind(this.storage),
      this.mapGroup)

    this.processResponseEntities(
      groupInformation.people,
      this.storage.getPersonByExternalId.bind(this.storage),
      this.storage.updatePerson.bind(this.storage),
      this.mapPerson)

    this.processResponseEntities(
      groupInformation.transactions,
      this.storage.getTransactionByExternalId.bind(this.storage),
      this.storage.updateTransaction.bind(this.storage),
      this.mapTransaction)
  }

  return synchroniser
})()