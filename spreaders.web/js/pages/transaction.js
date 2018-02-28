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

    this.populateBackButton()

    this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
      this.populateForm(group)
    })

    this.observer.subscribe("payeeCheckboxesRendered", this.payeeCheckboxesRendered, this)
    this.observer.subscribe("payerRadiosRendered", this.payerRadiosRendered, this)

    this.synchroniser.startServiceWorker()
  }

  transaction.prototype.populateBackButton = function() {
    var backButton = document.getElementsByClassName("backButton")[0]
    backButton.href = this.urlService.getTransactionsPage(this.pageContext.getCurrentGroupId())
  }

  transaction.prototype.populateForm = function (group) {

    this.currentGroup = group

    this.radiosContainer = document.getElementsByClassName("payerRadios")[0]
    this.payerRadios = new spreaders.view.payerRadio(this.currentGroup, this.radiosContainer, this.storage, this.observer)

    this.checkboxsContainer = document.getElementsByClassName("payeeCheckboxs")[0]
    this.payeeCheckboxes = new spreaders.view.payeeCheckboxes(this.currentGroup, this.checkboxsContainer, this.storage, this.observer)

    this.amountInput = document.getElementsByName("amount")[0]
    this.amountInputError = document.getElementsByClassName("error_amount")[0]
    this.descriptionInput = document.getElementsByName("description")[0]
    this.submitButton = document.getElementsByClassName("submit")[0]
    this.addSubmitEvent()

  }


  transaction.prototype.payeeCheckboxesRendered = function () {
    this.isPayeeCheckboxesRendered = true
    this.addTransactionBeingEdited()
  }

  transaction.prototype.payerRadiosRendered = function () {
    this.isPayerRadiosRendered = true
    this.addTransactionBeingEdited()
  }

  transaction.prototype.addTransactionBeingEdited = function () {
    if (!this.isPayeeCheckboxesRendered || !this.isPayerRadiosRendered)
      return
    this.transactionBeingEditedId = this.pageContext.getCurrentTransaction()
    if (this.isGuid(this.transactionBeingEditedId)) {
      this.storage.getTransaction(this.transactionBeingEditedId).then((transactionBeingEdited) => {
        this.addTransactionBeingEditedCallback(transactionBeingEdited)
      })
    }
      
  }

  transaction.prototype.addTransactionBeingEditedCallback = function (transactionBeingEdited) {
    this.transactionBeingEdited = transactionBeingEdited
    this.payerRadios.addSelectedValue(this.transactionBeingEdited.payer)
    this.payeeCheckboxes.addSelectedValues(this.transactionBeingEdited.payees)
    this.amountInput.value = this.transactionBeingEdited.amount
    this.descriptionInput.value = this.transactionBeingEdited.description
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
      this.transactionBeingEdited.payer = payer
      this.transactionBeingEdited.payees = payees
      this.transactionBeingEdited.amount = amount
      this.transactionBeingEdited.description = description
      this.transactionBeingEdited.updatedOn = this.storage.getUtcUnixTimeStamp()
      this.storage.updateTransaction(this.transactionBeingEdited, true)
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




