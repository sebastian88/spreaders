spreaders.apiService = (function () {
  var apiService = function () {
    this.apiPath = 'api'
    this.syncEndPoint = 'sync'
    this.getGroupEndPoint = 'getgroup'
    this.forwardSlash = "/"

    this.syncUrl = this.forwardSlash + this.apiPath + this.forwardSlash + this.syncEndPoint
    this.getGroupUrl = this.forwardSlash + this.apiPath + this.forwardSlash + this.getGroupEndPoint + this.forwardSlash
  } 

  apiService.prototype.sync = function (apiUpdateJsonModel) {
    return new Promise((resolve, reject) => {
      var xmlhttp = new XMLHttpRequest()

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          if (xmlhttp.status === 200)
            resolve()
          else
            reject()
        }
      }.bind(this)

      xmlhttp.open("POST", this.syncUrl, true)
      xmlhttp.setRequestHeader("Content-type", "application/json")
      xmlhttp.send(JSON.stringify(apiUpdateJsonModel))
    })
  }

  apiService.prototype.syncWithFetch = function (apiUpdateJsonModel) {
    return fetch(this.syncUrl,
      {
        method: "POST",
        body: JSON.stringify(apiUpdateJsonModel),
        headers: new Headers({ 'content-type': 'application/json' })
      })
  }

  apiService.prototype.getGroup = function (groupId, callback, secondCallback) {
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
        callback(JSON.parse(xmlhttp.response), secondCallback)
      }
    }.bind(this)

    xmlhttp.open("GET", this.getGroupUrl + groupId, true)
    xmlhttp.setRequestHeader("Content-type", "application/json")
    xmlhttp.send()
  }

  apiService.prototype.getGroupPromise = function (groupId) {
    return new Promise((resolve, reject) => {
      fetch(this.getGroupUrl + groupId, {
          headers: new Headers({ 'content-type': 'application/json' })
      }).then(response => {
        response.json().then((data) => {
           return resolve(data)
        })
      }).catch(err => {
        return reject(err)
      })
    })
  }

  return apiService

})()