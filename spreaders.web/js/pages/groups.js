spreaders.pages.groups = (function(){

	var groupPage = function(urlService, storage){
		this.urlService = urlService
		this.storage = storage


		this.container = document.getElementsByClassName("groupContainer")[0]
		
		this.ul = document.createElement("ul")
		this.container.appendChild(this.ul)
		
		this.renderGroups()

		var createGroupButton = document.getElementsByClassName("createGroupButton")[0]
		createGroupButton.addEventListener("click", this.createGroupButtonClick.bind(this))
	}

	groupPage.prototype.renderGroups = function () {
	  this.storage.getAllGroups(this.createGroupsListItem.bind(this))
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

	groupPage.prototype.init = function(){
	}
	
	groupPage.prototype.createGroupButtonClick = function() {
		var groupName = document.getElementsByName("groupName")[0].value
		var group = new spreaders.model.group(groupName)
		this.storage.addGroup(group, this.createGroupButtonClickCallback.bind(this))
	}

  groupPage.prototype.createGroupButtonClickCallback = function (group) {
    window.location.href = this.urlService.getTransactionsPage(group.externalId)
	}
	
	return groupPage
})()

var urlService = new spreaders.urlService()
var pageContext = new spreaders.pageContext(urlService)
var storage = new spreaders.storage()

var thisPage = new spreaders.pages.groups(urlService, storage);
