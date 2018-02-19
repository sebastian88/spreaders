spreaders.pages.groups = (function(){

	var groupPage = function(urlService, storage, synchroniser){
		this.urlService = urlService
		this.storage = storage
		this.synchroniser = synchroniser


		this.container = document.getElementsByClassName("groupContainer")[0]
		
		this.ul = document.createElement("ul")
		this.container.appendChild(this.ul)
		
		this.renderGroups()

		var createGroupButton = document.getElementsByClassName("createGroupButton")[0]
		createGroupButton.addEventListener("click", this.createGroupButtonClick.bind(this))

		this.synchroniser.startServiceWorker()
	}

	groupPage.prototype.renderGroups = function () {
	  this.storage.getAllGroups().then((groups) => {
			this.createGroupsListItem(groups)
		})
	}

	groupPage.prototype.createGroupsListItem = function (groups) {
	  for(var i = 0; i < groups.length; i++) 
	    this.createGroupListItem(groups[i])
	}

	groupPage.prototype.createGroupListItem = function (group) {
	  var li = document.createElement("li")
	  this.ul.appendChild(li)

	  var a = document.createElement("a")
	  a.href = this.urlService.getTransactionsPage(group.externalId)
	  a.innerHTML = group.id + ' ' + group.name
	  a.title = group.id
	  li.appendChild(a)
	}
	
	groupPage.prototype.createGroupButtonClick = function() {
		var groupName = document.getElementsByName("groupName")[0].value
		var group = new spreaders.model.group(groupName)
		group.createdOn = this.storage.getUtcUnixTimeStamp()
		group.updatedOn = this.storage.getUtcUnixTimeStamp()
		this.storage.addGroup(group).then((group) => {
			this.createGroupButtonClickCallback(group)
		})
	}

  groupPage.prototype.createGroupButtonClickCallback = function (group) {
		this.synchroniser.syncWithServer()
    window.location.href = this.urlService.getPeoplePage(group.externalId)
	}
	
	return groupPage
})()

var storage = new spreaders.storage()
storage.connect().then(data => {
	var urlService = new spreaders.urlService()
	var pageContext = new spreaders.pageContext(urlService)
  var apiService = new spreaders.apiService()
  var synchroniser = new spreaders.sync.synchroniser(storage, apiService)

	var thisPage = new spreaders.pages.groups(urlService, storage, synchroniser);
})
