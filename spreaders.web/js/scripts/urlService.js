  spreaders.urlService = (function(){
  var urlService = function () {
    this.forwardSlash = "/"
    this.GroupsPathSection = "groups"
    this.TransactionsPathSection = "transactions"
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
	return urlService
	
})()