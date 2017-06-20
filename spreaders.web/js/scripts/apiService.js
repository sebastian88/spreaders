spreaders.apiService = (function () {
  var apiService = function () {
    this.baseUrl = 'http://localhost:54321/'
    this.apiPath = 'api'
    this.syncEndPoint = 'sync'
    this.getGroupEndPoint = 'getgroup'
    this.forwardSlash = "/"

    this.syncUrl = this.baseUrl + this.forwardSlash + this.apiPath + this.forwardSlash + this.syncEndPoint
    this.getGroupUrl = this.baseUrl + this.forwardSlash + this.apiPath + this.forwardSlash + this.getGroupEndPoint + this.forwardSlash
  }

  apiService.prototype.sync = function (apiUpdateJsonModel, callback) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
        callback()
      }
    }.bind(this)

    xmlhttp.open("POST", this.syncUrl, true)
    xmlhttp.setRequestHeader("Content-type", "application/json")
    xmlhttp.send(JSON.stringify(apiUpdateJsonModel))
  }

  apiService.prototype.getGroup = function (groupId, callback) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
        callback()
      }
    }.bind(this)

    xmlhttp.open("GET", this.getGroupUrl + groupId, true)
    xmlhttp.send(JSON.stringify(apiUpdateJsonModel))
  }

  return apiService

})()