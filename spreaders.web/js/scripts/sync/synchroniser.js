spreaders.sync.synchroniser = (function () {


  var synchroniser = function (storage) {
    this.storage = storage
    this.groupsAddedToJson = false
    this.peopleAddedToJson = false
    this.transactionsAddedToJson = false
    this.processEntities()
  }

  synchroniser.prototype.processEntities = function () {
    this.apiUpdateJsonModel = {
      "createdObjects": {
        "groups": [],
        "people": [],
        "transactions": []
      },
      "updatedObjects": {
        "groups": [],
        "people": [],
        "transactions": []
      }
    }

    this.storage.getAllGroups(this.processGroups.bind(this))
    this.storage.getAllPeople(this.processPeople.bind(this))
    this.storage.getAllTransactions(this.processTransactions.bind(this))
  }

  synchroniser.prototype.processGroups = function (groups) {
    var splitGroups = this.split(groups)
		this.apiUpdateJsonModel.createdObjects.groups = this.createGroupsJson(splitGroups.created)
		this.apiUpdateJsonModel.updatedObjects.groups = this.createGroupsJson(splitGroups.updated)
    this.groupsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processPeople = function (people) {
    var splitPeople = this.split(people)
    //this.apiUpdateJsonModel.createdObjects.people = this.createEntitiesJson(splitPeople.created)
    //this.apiUpdateJsonModel.updatedObjects.people = this.createEntitiesJson(splitPeople.updated)
    this.peopleAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processTransactions = function (transactions) {
    var splitTransactions = this.split(transactions)
		this.apiUpdateJsonModel.createdObjects.transactions = this.createTransactionsJson(splitTransactions.created)
		this.apiUpdateJsonModel.updatedObjects.transactions = this.createTransactionsJson(splitTransactions.updated)
    this.transactionsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.split = function (entities) {
    created = []
    updated = []
    for (var i = 0; i < entities.length; i++) {
      if (entities[i].isSyncNeeded) {
        if (entities[i].externalId)
          updated.push(entities[i])
        else
          created.push(entities[i])
      }
    }
    return { "created": created, "updated": updated }
  }

  synchroniser.prototype.createGroupsJson = function (groups) {
    groupsJson = []
    for (var i = 0; i < groups.length; i++)
      groupsJson.push({ "ClientId": groups[i].id, "Name": groups[i].name })
    return groupsJson
	}

	synchroniser.prototype.createPeopleJson = function (people) {
		groupsJson = []
		for (var i = 0; i < groups.length; i++)
			groupsJson.push({
				"ClientId": people[i].id,
				"Id": people[i].externalId,
				"Name": people[i].name,
				"Deleted": people[i].Deleted,
				"GroupClientId": people[i].groupId,
				"GroupId": people[i].externalGroupId

			})
		return groupsJson
	}

  synchroniser.prototype.createTransactionsJson = function (transactions) {
    transactionJson = []
    for (var i = 0; i < transactions.length; i++)
      transactionJson.push({
				"ClientId": transactions[i].id,
				"Id": transactions[i].externalId,
				"Amount": transactions[i].amount,
				"Description": transactions[i].description,
				// need to figure out payer and payees
				"Deleted": transactions[i].Deleted,
				"GroupClientId": transactions[i].groupId,
				"GroupId": transactions[i].externalGroupId
      })
    return transactionJson
  }

  synchroniser.prototype.makeRequest = function (apiUpdateJsonModel) {
    if (!this.groupsAddedToJson || !this.peopleAddedToJson || !this.transactionsAddedToJson)
      return

    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
        this.ProcessResponse(xmlhttp.responseText)
      }
    }.bind(this)
		xmlhttp.open("POST", "http://localhost:27754/api/sync", true)
    xmlhttp.setRequestHeader("Content-type", "application/json")
    xmlhttp.send(JSON.stringify(this.apiUpdateJsonModel))
  }

  synchroniser.prototype.ProcessResponse = function (responseText) {
    var responseJson = JSON.parse(responseText)
    this.processAddedGroups(responseJson.AddedGroups)
    this.ProcessResponseEntities(responseJson.AddedPeople, this.storage.getPerson, this.storage.updatePerson.bind(this.storage))
    this.ProcessResponseEntities(responseJson.AddedTransactions, this.storage.getTransaction, this.storage.updateTransaction.bind(this.storage))
  }

  synchroniser.prototype.processAddedGroups = function(groups) {
    for (var i = 0; i < groups.length; i++) {
      var entityUpdater = new spreaders.entityUpdater()
      entityUpdater.externalId = entities[i].Id
      entityUpdater.updateFunction = this.storage.updateGroup.bind(this.storage)
      this.storage.getGroup(entities[i].ClientId, entityUpdater.updateExternalId.bind(entityUpdater))
      // get people with groupId = group[i].id and update the people.externalGroupId
      // get transactions with groupId = group[i].id and update the people.externalGroupId
      // update add transactions and add person to use groups.externalId instead of group.Id when it is available
    }
  }

  synchroniser.prototype.ProcessResponseEntities = function (entities, getEntityFunction, callback) {
    for (var i = 0; i < entities.length; i++) {
      var entityUpdater = new spreaders.entityUpdater()
      entityUpdater.externalId = entities[i].Id
      entityUpdater.updateFunction = callback
      getEntityFunction(entities[i].ClientId, entityUpdater.update.bind(entityUpdater))
    }
  }

  return synchroniser
})()