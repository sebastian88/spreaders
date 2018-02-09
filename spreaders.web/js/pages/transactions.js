spreaders.pages.transactions = (function () {

  var transactions = function (pageContext, urlService, apiService, storage, observer, synchroniser) {
    this.group
    this.pageContext = pageContext
    this.urlService = urlService
    this.apiService = apiService
    this.storage = storage
    this.observer = observer
    this.synchroniser = synchroniser
    this.people = []
    this.transactions = []

    this.addSection = document.getElementsByClassName("addSection")[0]
    this.opaqueLayer = document.getElementsByClassName("opaqueLayer")[0]
    this.personTotalsContainer = document.getElementsByClassName("personTotals")[0]
    this.transactionContainer = document.getElementsByClassName("transactions")[0]
    this.showUpdatesButton = document.getElementsByClassName("showUpdates")[0]

    this.addClickEvents()
    this.getGroupAndPopulatePage()
    this.startWorker()
  }
  
  transactions.prototype.getGroupAndPopulatePage = function() {
    this.storage.getGroupPromise(this.pageContext.getCurrentGroupId()).then((group) => {
      this.CheckGroupAndPopulatePage(group)
    })
  }
  
  transactions.prototype.CheckGroupAndPopulatePage = function (group) {
    if (!group) {
      this.apiService.getGroupPromise(this.pageContext.getCurrentGroupId()).then((group) => {
        this.processGroupFromApi(group)
      }) 
    }
    else {
      this.PopulatePage(group)
      this.synchroniser.getUpdatesForGroup(group.externalId)
    }
  }
  
  transactions.prototype.processGroupFromApi = function(groupInformation) {
    this.synchroniser.UpdateGroup(groupInformation).then(() => {
      this.storage.getGroupPromise(this.pageContext.getCurrentGroupId()).then((group) => {
        this.PopulatePage(group)
      })
    }) 
  }
  
  transactions.prototype.PopulatePage = function(group) {
    if (group) {
      this.group = group

      var promises = []

      promises.push(this.storage.getPeopleForGroupPromise(this.group.externalId).then(people => {this.people = people}))
      promises.push(this.storage.getTransactionsForGroupPromise(this.group.externalId).then(transactions => {this.transactions = transactions}))
      
      Promise.all(promises).then(() => {
        this.renderTransactionsAndTotals()
      })
    }
  }

  transactions.prototype.addClickEvents = function(){
    var addTransactionButton = document.getElementsByClassName("addTransactionButton")[0]
    addTransactionButton.addEventListener("click", this.redirectToTransaction.bind(this))

    var addPersonButton = document.getElementsByClassName("addPersonButton")[0]
    addPersonButton.addEventListener("click", this.redirectToPeople.bind(this))

    var addButton = document.getElementsByClassName("addSectionExpand")[0]
    addButton.addEventListener("click", this.processAddSectionClick.bind(this))
    
    this.opaqueLayer.addEventListener("click", this.opaqueLayerClick.bind(this))

    this.showUpdatesButton.addEventListener("click", this.refreshPage.bind(this))
    
    this.observer.subscribe("deleteTransaction", this.updateTotalsAndSync, this)
  }

  transactions.prototype.refreshPage = function() {
    this.showUpdatesButton.className = "showUpdates closed"
    this.storage.getGroupPromise(this.pageContext.getCurrentGroupId()).then((group) => {
      this.PopulatePage(group)
    })
  }

  transactions.prototype.processAddSectionClick = function() {
    this.addSection.className = "addSection active"
    this.opaqueLayer.className = "opaqueLayer"
  }

  transactions.prototype.opaqueLayerClick = function() {
    this.addSection.className = "addSection"
    this.opaqueLayer.className = "opaqueLayer visuallyHidden"
  }

  transactions.prototype.startWorker = function() {
    this.synchroniser.startServiceWorker()

    if(this.synchroniser.isServiceWorkerAvailable())
      navigator.serviceWorker.addEventListener("message", this.handleServiceWorkerMessage.bind(this));
  }

  transactions.prototype.handleServiceWorkerMessage = function(event){
    if(event.data.action == "reload")
      setTimeout(this.displayShowUpdatesButton.bind(this), 1000) // delay so it is not instant and annoying
  }

  transactions.prototype.displayShowUpdatesButton = function() {
    this.showUpdatesButton.className = "showUpdates"
  }

  transactions.prototype.renderTransactionsAndTotals = function () {
    this.populateTotals();

    this.transactionContainer.innerHTML = ""
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

  transactions.prototype.refreshPeopleAndPopulateTotals = function() {
    this.storage.getPeopleForGroup(this.group, this.refreshPeopleAndPopulateTotalsCallback.bind(this))
  }

  transactions.prototype.refreshPeopleAndPopulateTotalsCallback = function(people) {
    this.people = people
    this.populateTotals()
  }

  transactions.prototype.updateTotalsAndSync = function () {
    this.synchroniser.syncWithServer()
    this.storage.getTransactions(this.currentGroupId, this.updateTotalsCallback.bind(this))
  }

  transactions.prototype.updateTotalsCallback = function (transactions) {
    this.transactions = transactions
    this.populateTotals()
  }

  transactions.prototype.populateTotals = function () {
    this.personTotalsContainer.innerHTML = ""
    var personTotals = this.calculateTotals()
    for (var i = 0; i < personTotals.length; i++) {
      this.createPersonTotal(personTotals[i])
    }
  }

  transactions.prototype.calculateTotals = function () {
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

  transactions.prototype.createPersonTotal = function (personTotal) {
    var li = document.createElement("li")
    li.innerHTML = personTotal.person.name + ": " + personTotal.total
    this.personTotalsContainer.appendChild(li)
  }

  transactions.prototype.redirectToTransaction = function () {
    window.location.href = this.urlService.getTransactionPage(this.pageContext.getCurrentGroupId())
  }

  transactions.prototype.redirectToPeople = function() {
    window.location.href = this.urlService.getPeoplePage(this.pageContext.getCurrentGroupId())
  }

  return transactions
})()


var storage = new spreaders.storage()
storage.connect().then(data => {
  var urlService = new spreaders.urlService()
  var pageContext = new spreaders.pageContext(urlService)
  var observer = new spreaders.observer()
  var apiService = new spreaders.apiService()
  var synchroniser = new spreaders.sync.synchroniser(storage, apiService)

  var page = new spreaders.pages.transactions(pageContext, urlService, apiService, storage, observer, synchroniser)
})