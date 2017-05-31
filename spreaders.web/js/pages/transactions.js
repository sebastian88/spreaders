spreaders.pages.transactions = (function(){
	
	var transactions = function (pageContext, urlService, storage, observer) {
		this.group
	  this.pageContext = pageContext
    // we need to get the groupd from storage if not get from web service
		this.urlService = urlService
		this.storage = storage
		this.observer = observer
		this.people = []
		this.getPeopleComplete = false
		this.transactions = []
		this.getTransactionsComplete = false
		
		var addTransactionButton = document.getElementsByClassName("addTransactionButton")[0]
		addTransactionButton.addEventListener("click", this.redirectToTransaction.bind(this))

		this.personTotalsContainer = document.getElementsByClassName("personTotals")[0]
		this.transactionContainer = document.getElementsByClassName("transactions")[0]

		this.storage.getGroup(pageContext.getCurrentGroupId(), this.populatePage.bind(this))
	}

	transactions.prototype.populatePage = function (group) {
		// If no group then try from web service
		if (group[0]) {
			this.group = group[0]
      this.storage.getPeopleForGroup(this.group, this.getPeopleCallback.bind(this))
      this.storage.getTransactionsForGroup(this.group, this.getTransactionsCallback.bind(this))

			this.observer.subscribe("deleteTransaction", this.updateTotals, this)
		}
	}


	transactions.prototype.getPeopleCallback = function (people) {
	  this.people = people
	  this.getPeopleComplete = true

	  this.renderTransactionsAndTotals()
	}

	transactions.prototype.getTransactionsCallback = function (transactions) {
	  this.transactions = transactions
	  this.getTransactionsComplete = true

	  this.renderTransactionsAndTotals()
	}

	transactions.prototype.renderTransactionsAndTotals = function () {
	  if (!this.getPeopleComplete || !this.getTransactionsComplete)
	    return
    
	  this.populateTotals();

	  for (var i = 0; i < this.transactions.length; i++) {
	    new spreaders.view.transaction(this.transactions[i],
        this.people,
        this.transactionContainer,
        this.storage,
        this.pageContext,
        this.urlService,
        this.observer);
	  }
	}

	transactions.prototype.updateTotals = function () {
	  this.storage.getTransactions(this.currentGroupId, this.updateTotalsCallback.bind(this))
	}

	transactions.prototype.updateTotalsCallback = function (transactions) {
	  this.transactions = transactions
    this.populateTotals()
	}

	transactions.prototype.populateTotals = function() {
		this.personTotalsContainer.innerHTML = ""
		var personTotals = this.calculateTotals()
		for(var i = 0; i < personTotals.length; i++) {
			this.createPersonTotal(personTotals[i])
		}
	}
	
	transactions.prototype.calculateTotals = function() {
	  var totals = []
	  for (var i = 0; i < this.people.length; i++) {
	    var personTotal = new spreaders.model.personTotal(this.people[i])
	    for (var j = 0; j < this.transactions.length; j++) {
	      var transaction = this.transactions[j]
	      // payer
				if (transaction.payer == personTotal.person.id || transaction.payer == personTotal.person.externalId)
	        personTotal.total -= transaction.amount
				//payees
				if (transaction.payees.includes(personTotal.person.id) == true || transaction.payees.includes(personTotal.person.externalId) == true)
	        personTotal.total += (transaction.amount / transaction.payees.length)
	    }
	    totals.push(personTotal)
	  }
		return totals
	}
	
	transactions.prototype.createPersonTotal = function(personTotal){
		var li = document.createElement("li")
		li.innerHTML = personTotal.person.name + ": " + personTotal.total
		this.personTotalsContainer.appendChild(li)
	}
	
	transactions.prototype.redirectToTransaction = function() {
		window.location.href = this.urlService.getTransactionPage(this.pageContext.getCurrentGroupId())
	}
	
	return transactions
})()


var urlService = new spreaders.urlService()
var pageContext = new spreaders.pageContext(urlService)
var storage = new spreaders.storage()
var observer = new spreaders.observer()
var synchroniser = new spreaders.sync.synchroniser(storage)

var page = new spreaders.pages.transactions(pageContext, urlService, storage, observer, synchroniser)