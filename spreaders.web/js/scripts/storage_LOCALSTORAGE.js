
spreaders.storage_LOCALSTORAGE = (function () {
	
	
	var storage = function (groupId) {
		this.groupStoragePrefix = "group_"
		var groupJson = localStorage.getItem(this.groupStoragePrefix + groupId)
		if(groupJson)
			this.group = JSON.parse(groupJson)
		
	};
	
	var getArrayLocationById = function (id, arrayToSearch){
    for (var i=0; i < arrayToSearch.length; i++) {
			if (arrayToSearch[i].id === id) {
				return i
			}
    }
		return null
	}
	
	var getObjectFromArrayById = function (id, arrayToSearch){
    for (var i=0; i < arrayToSearch.length; i++) {
			if (arrayToSearch[i].id == id) {
				return arrayToSearch[i];
			}
    }
	}
	
	var addRelatedTransactionData = function(transaction, people) {
		var transactionWithData = new spreaders.model.transaction()
		transactionWithData.copy(transaction)
		transactionWithData.payer = getObjectFromArrayById(transaction.payer, people)
		for(var i = 0; i < transaction.payees.length; i++)
			transactionWithData.payees[i] = getObjectFromArrayById(transaction.payees[i], people)
		return transactionWithData
	}
	
	var prepairTransactionForSave = function(transaction) {
		if(transaction.payer.id)
			transaction.payer = transaction.payer.id
		
		if(transaction.payees[0].id) {
			for(var i = 0; i < transaction.payees.length; i++)
				transaction.payees[i] = transaction.payees[i].id
		}
		
		return transaction
			
	}

	/** class methods **/
	storage.prototype = {
		getGroup: function() {
			return this.group
		},
		getAllGroups: function () {
		  var groups = [],
        keys = Object.keys(localStorage),
        i = keys.length;
		  while (i--) {
		    if (keys[i].startsWith(this.groupStoragePrefix))
		      groups.push(JSON.parse(localStorage.getItem(keys[i])));
		  }

		  return groups;
		},
		addGroup: function(group) {
			this.group = group
			this.commit()
		},
		addTransaction: function (transaction) {
			transaction.id = this.group.currentTransactionKey
			this.group.transactions.push(prepairTransactionForSave(transaction))
			this.group.currentTransactionKey++
			this.commit()
		},
		updateTransaction: function(transaction) {
			oldtransactionKey = getArrayLocationById(transaction.id, this.group.transactions)
			if(oldtransactionKey !== null) {
				this.group.transactions[oldtransactionKey] = prepairTransactionForSave(transaction)
				this.commit()
			}
		},
		getRawTransactions: function() {
			return this.group.transactions
		},
		getTransactions : function() {
			var transactionsAndReleatedData = []
			for(var i = 0; i < this.group.transactions.length; i++) {
				var transaction = addRelatedTransactionData(this.group.transactions[i], this.group.people)
				transactionsAndReleatedData.push(transaction)
			}
			return transactionsAndReleatedData
		},
		getRawTransaction: function(id) {
			return getObjectFromArrayById(id, this.group.transactions)
			
			
		},
		getTransaction: function(id) {
			var transaction = getObjectFromArrayById(id, this.group.transactions)
			return addRelatedTransactionData(transaction, this.group.people)
			
		},
		addPerson: function(person) {
			person.id = this.group.currentPeopleKey
			this.group.people.push(person)
			this.group.currentPeopleKey++
			this.commit()
			return person.id
		},
		getPeople: function() {
			return this.group.people
		},
		commit: function() {
			localStorage.setItem(this.groupStoragePrefix + this.group.id, JSON.stringify(this.group))
		}
	};

	return storage;
})();