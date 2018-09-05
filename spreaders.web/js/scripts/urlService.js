  spreaders.urlService = (function(){
  var urlService = function () {
    this.forwardSlash = "/"
    this.GroupsPathSection = "groups"
		this.TransactionsPathSection = "transactions"
		this.PeoplePathSection = "people"
		this.PayUpPathSection = "payup"
	}
	
	urlService.prototype.getGroupPage = function() {
	  return this.forwardSlash + this.GroupsPathSection + this.forwardSlash
	}
	
	urlService.prototype.getTransactionsPage = function(groupId) {
	  return this.getGroupPage() + groupId + this.forwardSlash + this.TransactionsPathSection + this.forwardSlash
	}
	
	urlService.prototype.getTransactionPage = function(groupId, transactionId) {
	  var url = this.getTransactionsPage(groupId)
		
		if(transactionId)
		  url += transactionId + this.forwardSlash
	  else
		  url += "add" + this.forwardSlash

		return url
	}

	urlService.prototype.getPeoplePage = function(groupId) {
		return this.getGroupPage() + groupId + this.forwardSlash + this.PeoplePathSection + this.forwardSlash
	}
	
	urlService.prototype.getPersonEditPage = function(groupId, personId) {
		return this.getPeoplePage(groupId) + personId + this.forwardSlash
	}

	urlService.prototype.getPayUpPage = function(groupId) {
		return this.getGroupPage() + groupId + this.forwardSlash + this.PayUpPathSection + this.forwardSlash
	}

	return urlService
	
})()