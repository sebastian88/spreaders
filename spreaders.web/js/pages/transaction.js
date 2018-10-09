spreaders.pages.transaction = (function () {

  var transaction = function (
    pageContext,
    urlService,
    storage,
    observer,
    synchroniser
  ) {
    this.pageContext = pageContext
    this.urlService = urlService
    this.storage = storage
    this.observer = observer
    this.synchroniser = synchroniser
    this.isPayeeCheckboxesRendered = false
    this.isPayerRadiosRendered = false
    this.currentGroup
    this.currentTransaction

    this.populateBackButton()
    this.transactionBeingEditedId = this.pageContext.getCurrentTransaction()

    this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
      this.currentGroup = group
      
      if (this.isGuid(this.transactionBeingEditedId)) {
        this.storage.getTransaction(this.transactionBeingEditedId).then((currentTransaction) => {
          this.currentTransaction = currentTransaction
          this.populateForm() 
          this.addFormValues()
        })
      }
      else {
        this.populateForm() 
      }
    })

    this.observer.subscribe("payeeCheckboxesRendered", this.payeeCheckboxesRendered, this)
    this.observer.subscribe("payerRadiosRendered", this.payerRadiosRendered, this)

    this.synchroniser.startServiceWorker()
  }

  transaction.prototype.populateBackButton = function() {
    var backButton = document.getElementsByClassName("backButton")[0]
    backButton.href = this.urlService.getTransactionsPage(this.pageContext.getCurrentGroupId())
  }

  transaction.prototype.populateForm = function () {


    this.radiosContainer = document.getElementsByClassName("payerRadios")[0]
    this.payerRadios = new spreaders.view.payerRadio(this.currentGroup, this.currentTransaction, this.radiosContainer, this.storage, this.observer)

    // this.checkboxsContainer = document.getElementsByClassName("payeeCheckboxs")[0]
    // this.payeeCheckboxes = new spreaders.view.payeeCheckboxes(this.currentGroup, this.checkboxsContainer, this.storage, this.observer)

    this.amountInput = document.getElementsByName("amount")[0]
    this.amountInputError = document.getElementsByClassName("error_amount")[0]
    this.descriptionInput = document.getElementsByName("description")[0]
    this.selectAllButton = document.getElementsByClassName("selectAll")[0]
    this.selectAllButton.addEventListener("click", this.selectAllPayees.bind(this))
    this.submitButton = document.getElementsByClassName("submit")[0]
    this.addSubmitEvent()

  }

  transaction.prototype.selectAllPayees = function(e) {
    e.preventDefault()
    this.payeeCheckboxes.selectAll()
  }

  transaction.prototype.addFormValues = function () {
    this.amountInput.value = this.currentTransaction.amount
    this.descriptionInput.value = this.currentTransaction.description
    this.submitButton.innerHTML = "Update"
  }

  transaction.prototype.addSubmitEvent = function () {
    this.submitButton.addEventListener("click", this.processSubmit.bind(this))
  }

  transaction.prototype.processSubmit = function (event) {
    event.preventDefault()
    this.hideAllErrors()

    if (this.formIsValid())
      this.saveTransactionAndRedirect()
    else
      this.displayErrors()
  }

  transaction.prototype.hideAllErrors = function () {
    errorElements = document.getElementsByClassName("error")
    for (var i = 0; i < errorElements.length; i++) {
      errorElements[i].style.display = "none"
    }
  }

  transaction.prototype.formIsValid = function () {
    return this.payerRadios.isValid()
      && this.payeeCheckboxes.isValid()
      && this.amountInput.value !== ""
  }

  transaction.prototype.saveTransactionAndRedirect = function () {
    var payer = this.payerRadios.getValues()[0]
    var payees = this.payeeCheckboxes.getValues()
    var amount = parseFloat(this.amountInput.value).toFixed(2)
    var description = this.descriptionInput.value

    if (this.isGuid(this.transactionBeingEditedId)) {
      this.currentTransaction.payer = payer
      this.currentTransaction.payees = payees
      this.currentTransaction.amount = amount
      this.currentTransaction.description = description
      this.currentTransaction.updatedOn = this.storage.getUtcUnixTimeStamp()
      this.storage.updateTransaction(this.currentTransaction, true)
    }
    else {
      var transaction = new spreaders.model.transaction(
        this.currentGroup,
        payer, 
        payees, 
        amount, 
        description)
      transaction.createdOn = this.storage.getUtcUnixTimeStamp()
      transaction.updatedOn = this.storage.getUtcUnixTimeStamp()
      this.storage.addTransaction(transaction)
    }
    this.synchroniser.syncWithServer()
    window.location.href = this.urlService.getTransactionsPage(this.pageContext.getCurrentGroupId())
  }

  transaction.prototype.displayErrors = function () {
    this.payerRadios.displayError()
    this.payeeCheckboxes.displayError()

    if (!this.amountInput.value)
      this.amountInputError.style.display = "block"
  }

  transaction.prototype.isGuid = function(guidToText) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(guidToText)
  }

  return transaction
})()

var storage = new spreaders.storage()
storage.connect().then(data => {
  var urlService = new spreaders.urlService()
  var pageContext = new spreaders.pageContext(urlService)
  var observer = new spreaders.observer()
  var apiService = new spreaders.apiService()
  var synchroniser = new spreaders.sync.synchroniser(storage, apiService)

  var page = new spreaders.pages.transaction(pageContext, urlService, storage, observer, synchroniser)
})




