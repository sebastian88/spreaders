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
    this.addAccordianEvent()
    //this.div.appendChild(document.createElement("hr"))
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
    this.createLi(this.transaction.description, "description")
    this.createLi("£" + spreaders.maths.roundAndFormatForCurrency(this.transaction.amount), "amount")
    this.createLi(this.getPayeeNamesCsv(), "payees")
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
      firstLetter = document.createElement("span")
      firstLetter.className = "firstLetter"
      firstLetter.style.backgroundColor = payee.colour;
      firstLetter.innerHTML = payee.name.charAt(0)
      
      remainingLetters = document.createElement("span")
      remainingLetters.className = "remainingLetters"
      remainingLetters.innerHTML = payee.name.substring(1)
      firstLetter.appendChild(remainingLetters)

      return firstLetter.outerHTML
    }).join("")
  }

  transaction.prototype.getPerson = function (personId) {
    for (var i = 0; i < this.people.length; i++) {
      if (this.people[i].id === personId || this.people[i].externalId === personId)
        return this.people[i]
    }
  }

  transaction.prototype.addButtons = function () {
    this.deleteButton = this.addButton("Delete", "delete")
    this.editButton = this.addButton("Edit", "edit")
    this.deleteButtonHander = this.deleteTransaction.bind(this)
    this.editButtonHandler = this.editTransaction.bind(this)
  }

  transaction.prototype.addButton = function (label, cssClass) {

    var newButton = document.createElement("button")
    newButton.innerHTML = label
    newButton.className = cssClass
    newButton.setAttribute('type', 'button')
    this.div.appendChild(newButton)

    return newButton
  }

  transaction.prototype.addButtonEventListeners = function() {
    this.deleteButton.addEventListener("click", this.deleteButtonHander)
    // this.deleteButton.addEventListener("touchend", this.deleteButtonHander)
    this.editButton.addEventListener("click", this.editButtonHandler)
    // this.editButton.addEventListener("touchend", this.editButtonHandler)
  }
  
  transaction.prototype.removeButtonEventListeners = function() {
    this.deleteButton.removeEventListener("click", this.deleteButtonHander)
    // this.deleteButton.removeEventListener("touchend", this.deleteButtonHander)
    this.editButton.removeEventListener("click", this.editButtonHandler)
    // this.editButton.removeEventListener("touchend", this.editButtonHandler)
  }
  
  transaction.prototype.addAccordianEvent = function () {
    this.div.addEventListener("click", this.addAccordianClass.bind(this))
    // this.div.addEventListener("touchend", this.addAccordianClass.bind(this))
  }
  
  transaction.prototype.addAccordianClass = function (e) {
    e.preventDefault()
    if(this.div.className == "transaction"){
      this.addButtonEventListeners()
      this.div.className = "transaction active"
    }
    else{
      this.removeButtonEventListeners()
      this.div.className = "transaction"
    }
  }

  transaction.prototype.deleteTransaction = function (e) {
    e.stopPropagation()
    e.preventDefault()
    this.transaction.isDeleted = 1
    this.storage.updateTransaction(this.transaction, 1).then(() => {
      this.deleteTransactionCallback()
    })
  }

  transaction.prototype.deleteTransactionCallback = function () {
    this.container.removeChild(this.div)
    this.observer.fire("deleteTransaction", this.transaction)
  }

  transaction.prototype.editTransaction = function (e) {
    e.stopPropagation()
    e.preventDefault()
    window.location.href = this.urlService.getTransactionPage(this.pageContext.getCurrentGroupId(), this.transaction.externalId)
  }


  return transaction;
})()