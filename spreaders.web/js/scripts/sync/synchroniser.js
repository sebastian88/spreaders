spreaders.sync.synchroniser = (function () {


  var synchroniser = function (storage) {
    this.storage = storage

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
  }

  synchroniser.prototype.processGroups = function (groups) {
    var splitGroups = this.split(groups)
    this.apiUpdateJsonModel.createdObjects.groups = this.createGroupsJson(splitGroups.created)

    this.makeRequest()
  }

  synchroniser.prototype.makeRequest = function (apiUpdateJsonModel) {
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
        this.ProcessResponse(xmlhttp.responseText)
      }
    }
    xmlhttp.open("POST", "http://localhost:7000/api/sync", true)
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(this.apiUpdateJsonModel))
  }

  synchroniser.prototype.ProcessResponse = function (responseText) {
    var responseJson = JSON.parse(responseText)
    this.ProcessResponseGroups(responseJson.AddedGroups)
  }

  synchroniser.prototype.ProcessResponseGroups = function (groups) {
    for (var i = 0; i < groups.length; i++) {
      this.storage.getGroup(groups[i])
    }
  }

  synchroniser.prototype.createGroupsJson = function (groups) {
    groupsJson = []
    for (var i = 0; i < groups.length; i++)
      groupsJson.push({ "ClientId": groups[i].id, "Name": groups[i].name })
    return groupsJson
  }

  synchroniser.prototype.split = function (groups) {
    created = []
    updated = []
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].isSyncNeeded) {
        if (groups[i].externalId)
          updated.push(groups[i])
        else
          created.push(groups[i])
      }
    }
    return { "created": created, "updated": updated }
  }

  return synchroniser
})()