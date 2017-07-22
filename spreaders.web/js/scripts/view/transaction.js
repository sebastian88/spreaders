spreaders.view.transaction = (function () {

  // contructor
  var transaction = function (transaction, people, container, storage, pageContext, urlService, observer) {
    this.transaction = transaction
    this.people = people
    this.container = container
    this.storage = storage
    this.pageContext = pageContext
    this.urlService = urlService
    this.observer = observer
    this.createDiv()
    this.populateDiv()
    this.addButtons()
  }

  // private methods
  transaction.prototype.createDiv = function () {
    this.div = document.createElement("div")
    this.div.className = "transaction"
    this.container.appendChild(this.div)
  }

  transaction.prototype.populateDiv = function () {
    this.ul = document.createElement("ul")
    this.ul.className = "transactionDetails"
    this.div.appendChild(this.ul)

    this.createLi(this.getPerson(this.transaction.payer).name, "payer")
    this.createLi(this.transaction.amount, "amount")
    this.createLi(this.getPayeeNamesCsv(), "payees")
    this.createLi(this.transaction.description, "description")
  }

  transaction.prototype.createLi = function (data, cssClass, ul) {
    li = document.createElement("li")
    li.innerHTML = data
    li.className = cssClass
    this.ul.appendChild(li)
  }

  transaction.prototype.getPayeeNamesCsv = function () {
    var payees = []
    for (var i = 0; i < this.transaction.payees.length; i++) {
      payees.push(this.getPerson(this.transaction.payees[i]))
    }


    return payees.map(function (payee) {
      return payee.name
    }).join(',')
  }

  transaction.prototype.getPerson = function (personId) {
    for (var i = 0; i < this.people.length; i++) {
      if (this.people[i].id === personId || this.people[i].externalId === personId)
        return this.people[i]
    }
  }

  transaction.prototype.addButtons = function () {
    this.deleteButton = this.addButton("delete")
    this.deleteButton.addEventListener("click", this.deleteTransaction.bind(this))

    this.editButton = this.addButton("edit")
    this.editButton.addEventListener("click", this.editTransaction.bind(this))
  }

  transaction.prototype.addButton = function (label) {

    var newButton = document.createElement("button")
    newButton.innerHTML = label
    newButton.setAttribute('type', 'button')
    this.div.appendChild(newButton)

    return newButton
  }

  transaction.prototype.deleteTransaction = function () {
    this.transaction.isDeleted = 1;
    this.storage.updateTransaction(this.transaction, this.deleteTransactionCallback.bind(this), 1)
  }

  transaction.prototype.deleteTransactionCallback = function () {
    this.container.removeChild(this.div)
    this.observer.fire("deleteTransaction", this.transaction)
  }

  transaction.prototype.editTransaction = function () {
    window.location.href = urlService.getTransactionPage(this.pageContext.getCurrentGroupId(), this.transaction.externalId)
  }


  return transaction;
})()