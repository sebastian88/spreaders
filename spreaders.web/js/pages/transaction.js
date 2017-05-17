spreaders.pages.transaction = (function () {

  var transaction = function (
		pageContext,
		urlService,
		storage,
		observer
	) {
    this.pageContext = pageContext
    this.urlService = urlService
    this.storage = storage
    this.observer = observer
    this.isPayeeCheckboxesRendered = false
		this.isPayerRadiosRendered = false
		this.currentGroup
		this.storage.getGroup(pageContext.getCurrentGroupId(), this.populateForm.bind(this))

    this.observer.subscribe("payeeCheckboxesRendered", this.payeeCheckboxesRendered, this)
    this.observer.subscribe("payerRadiosRendered", this.payerRadiosRendered, this)
  }

	transaction.prototype.populateForm = function (group) {

		this.currentGroup = group[0]

		this.addPersonContainer = document.getElementsByClassName("addPerson")[0]
		this.payerRadios = new spreaders.view.addPerson(this.currentGroup, this.addPersonContainer, this.storage, this.observer)

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
    this.transactionBeingEditedId = pageContext.getCurrentTransaction()
    if (this.transactionBeingEditedId > 0)
      this.storage.getTransaction(this.transactionBeingEditedId, this.addTransactionBeingEditedCallback.bind(this))
  }

  transaction.prototype.addTransactionBeingEditedCallback = function (transactionBeingEdited) {
    this.transactionBeingEdited = transactionBeingEdited
    this.payerRadios.addSelectedValue(this.transactionBeingEdited.payer)
    this.payeeCheckboxes.addSelectedValues(this.transactionBeingEdited.payees)
    this.amountInput.value = this.transactionBeingEdited.amount
    this.descriptionInput.value = this.transactionBeingEdited.description
    this.submitButton.innerHTML = "update"
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

    if (this.transactionBeingEditedId > 0) {
      this.transactionBeingEdited.payer = payer
      this.transactionBeingEdited.payees = payees
      this.transactionBeingEdited.amount = amount
      this.transactionBeingEdited.description = description
      this.storage.updateTransaction(this.transactionBeingEdited, null, true)
    }
    else {
      var transaction = new spreaders.model.transaction(this.currentGroup, payer, payees, amount, description)
      this.storage.addTransaction(transaction)
    }
    window.location.href = this.urlService.getTransactionsPage(pageContext.getCurrentGroupId())
  }

  transaction.prototype.displayErrors = function () {
    this.payerRadios.displayError()
    this.payeeCheckboxes.displayError()

    if (!this.amountInput.value)
      this.amountInputError.style.display = "block"
  }

  return transaction
})()

var urlService = new spreaders.urlService()
var pageContext = new spreaders.pageContext(urlService)
var storage = new spreaders.storage(pageContext.getCurrentGroupId())
var observer = new spreaders.observer()

var page = new spreaders.pages.transaction(pageContext, urlService, storage, observer)




