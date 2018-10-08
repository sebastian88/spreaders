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
    this.transactionContainer = document.getElementsByClassName("transactions")[0]
    this.showUpdatesButton = document.getElementsByClassName("showUpdates")[0]

    this.addClickEvents()
    this.getGroupAndPopulatePage()
    this.startWorker()
  }
  
  transactions.prototype.getGroupAndPopulatePage = function() {
    this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
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
      this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
        this.PopulatePage(group)
      })
    }) 
  }
  
  transactions.prototype.PopulatePage = function(group) {
    if (group) {
      this.group = group

      var promises = []

      promises.push(this.storage.getPeopleForGroup(this.group.externalId).then(people => {
        this.people = people
      }))
      promises.push(this.storage.getTransactionsSortedByCreatedDate(this.group.externalId).then(transactions => {
        this.transactions = this.storage.sortByCreatedDate(transactions)
      }))
      
      Promise.all(promises).then(() => {
        this.renderTransactions()
      })
    }
  }

  transactions.prototype.addClickEvents = function(){

    this.showUpdatesButton.addEventListener("click", this.refreshPage.bind(this))
    
    this.observer.subscribe("deleteTransaction", this.updateTotalsAndSync, this)
  }

  transactions.prototype.refreshPage = function() {
    this.showUpdatesButton.className = "showUpdates closed"
    this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
      this.PopulatePage(group)
    })
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

  transactions.prototype.renderTransactions = function () {
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
  new spreaders.view.navigation(urlService,pageContext).init()
  var observer = new spreaders.observer()
  var apiService = new spreaders.apiService()
  var synchroniser = new spreaders.sync.synchroniser(storage, apiService)

  var page = new spreaders.pages.transactions(pageContext, urlService, apiService, storage, observer, synchroniser)
})