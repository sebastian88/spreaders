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
		this.apiUpdateJsonModel.createdObjects.people = this.createPeopleJson(splitPeople.created)
		this.apiUpdateJsonModel.updatedObjects.people = this.createPeopleJson(splitPeople.updated)
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
		peopleJson = []
		for (var i = 0; i < people.length; i++)
			peopleJson.push({
				"ClientId": people[i].id,
				"Id": people[i].externalId,
				"Name": people[i].name,
				"Deleted": people[i].Deleted,
				"GroupId": people[i].groupId

			})
		return peopleJson
	}

  synchroniser.prototype.createTransactionsJson = function (transactions) {
    transactionJson = []
    for (var i = 0; i < transactions.length; i++)
      transactionJson.push({
				"ClientId": transactions[i].id,
				"Id": transactions[i].externalId,
				"Amount": transactions[i].amount,
				"Description": transactions[i].description,

				// reference objects
				"PayerId": transactions[i].payer,
				"Payees": transactions[i].payees,

				"Deleted": transactions[i].Deleted,
				"GroupId": transactions[i].groupId
      })
    return transactionJson
	}

	synchroniser.prototype.GetInternalIds = function (idsList) {
		var matchedIds = []
		for (var i = 0; i < idsList.length; i++) {
			if (!String(idsList[i]).match(/[a-z]/i)) {
				matchedIds.push(idsList[i])
			}
		}
		return matchedIds
	}

	synchroniser.prototype.GetInternalId = function (id) {
		if (!String(id).match(/[a-z]/i))
			return id
		else
			return null;
	}

	synchroniser.prototype.GetExternalIds = function (idsList) {
		var matchedIds = []
		for (var i = 0; i < idsList.length; i++) {
			if (String(idsList[i]).match(/[a-z]/i)) {
				matchedIds.push(idsList[i])
			}
		}
		return matchedIds
	}

	synchroniser.prototype.GetExternalId = function (id) {
		if (String(id).match(/[a-z]/i))
			return id
		else
			return null;
	}



  synchroniser.prototype.makeRequest = function (apiUpdateJsonModel) {
    if (!this.groupsAddedToJson || !this.peopleAddedToJson || !this.transactionsAddedToJson)
      return

    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
        this.processResponse(xmlhttp.responseText)
      }
    }.bind(this)
		xmlhttp.open("POST", "http://localhost:54321/api/sync", true)
    xmlhttp.setRequestHeader("Content-type", "application/json")
    xmlhttp.send(JSON.stringify(this.apiUpdateJsonModel))
  }

  synchroniser.prototype.processResponse = function (responseText) {
    var responseJson = JSON.parse(responseText)

		this.processResponseEntities(
			responseJson.GroupsToUpdate,
			this.storage.getGroup.bind(this.storage),
			this.storage.updateGroup.bind(this.storage),
			this.mapGroup)

		this.processResponseEntities(
			responseJson.PeopleToUpdate,
			this.storage.getPerson.bind(this.storage),
			this.storage.updatePerson.bind(this.storage),
			this.mapPerson)

		this.processResponseEntities(
			responseJson.TransactionsToUpdate,
			this.storage.getTransaction.bind(this.storage),
			this.storage.updateTransaction.bind(this.storage),
			this.mapTransaction)
  }

	synchroniser.prototype.processResponseEntities = function (entities, getEntityFunction, callback, mapper) {
    for (var i = 0; i < entities.length; i++) {
      var entityUpdater = new spreaders.entityUpdater()
			entityUpdater.externalEntity = entities[i]
			entityUpdater.updateFunction = callback
			entityUpdater.mapper = mapper
			getEntityFunction(entities[i].ClientId, entityUpdater.update.bind(entityUpdater))
    }
	}

	synchroniser.prototype.mapGroup = function (existingGroup, newGroup) {
		existingGroup.externalId = newGroup.Id
		return existingGroup
	}

	synchroniser.prototype.mapPerson = function (existingPerson, newPerson) {
		existingPerson.externalId = newPerson.Id
		existingPerson.groupId = newPerson.GroupId
		return existingPerson
	}

	synchroniser.prototype.mapTransaction = function (existingTransaction, newTransaction) {
		existingTransaction.externalId = newTransaction.Id
		existingTransaction.payees = newTransaction.Payees
		existingTransaction.payer = newTransaction.PayerId
		return existingTransaction
	}
	
  return synchroniser
})()