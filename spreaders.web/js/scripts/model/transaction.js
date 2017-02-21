spreaders.model.transaction = (function () {
	
	var transaction = function (groupId, payer, payees, amount, description) {
	  this.id
	  this.externalId
	  this.groupId = groupId
		if(payees)
			this.payees = payees
		else
			this.payees = []
		this.payer = payer
		this.amount = amount
		this.description = description
		this.deleted = false
		this.isSyncNeeded = false
	};
	
	return transaction;
})();