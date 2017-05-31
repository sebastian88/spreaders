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
      "entities": {
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
    this.apiUpdateJsonModel.entities.groups = this.createGroupsJson(groups)
    this.groupsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processPeople = function (people) {
    this.apiUpdateJsonModel.entities.people = this.createPeopleJson(people)
    this.peopleAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.processTransactions = function (transactions) {
    this.apiUpdateJsonModel.entities.transactions = this.createTransactionsJson(transactions)
    this.transactionsAddedToJson = true
    this.makeRequest()
  }

  synchroniser.prototype.createGroupsJson = function (groups) {
    groupsJson = []
    for (var i = 0; i < groups.length; i++)
      groupsJson.push({ "Id": groups[i].externalId, "Name": groups[i].name })
    return groupsJson
	}

	synchroniser.prototype.createPeopleJson = function (people) {
		peopleJson = []
		for (var i = 0; i < people.length; i++)
			peopleJson.push({
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
			this.mapEntity)

		this.processResponseEntities(
			responseJson.PeopleToUpdate,
			this.storage.getPerson.bind(this.storage),
			this.storage.updatePerson.bind(this.storage),
			this.mapEntity)

		this.processResponseEntities(
			responseJson.TransactionsToUpdate,
			this.storage.getTransaction.bind(this.storage),
			this.storage.updateTransaction.bind(this.storage),
			this.mapEntity)
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

	synchroniser.prototype.mapEntity = function (existingEntity, newEntity) {
	  existingEntity.isSyncNeeded = false
	  return existingEntity
	}
	
  return synchroniser
})()