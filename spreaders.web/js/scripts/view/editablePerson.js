spreaders.view.editablePerson = (function(){
    var editablePerson = function(person, container, storage, observer, urlService, pageContext) {
        this.person = person
        this.container = container
        this.storage = storage
        this.observer = observer
        this.urlService = urlService
        this.pageContext = pageContext

        this.createDiv()
        this.populateDiv()
        this.addButtons()
        this.addAccordianEvent()
    }

    editablePerson.prototype.createDiv = function() {
        this.div = document.createElement("div")
        this.div.className = "person"
        this.container.appendChild(this.div)
    }
    
    editablePerson.prototype.populateDiv = function () {
        this.ul = document.createElement("ul")
        this.ul.className = "personDetails"
        this.div.appendChild(this.ul)

        this.createLi(this.person.name, "name")
        var li = this.createLi(this.person.name.charAt(0), "firstLetter")
        li.style.backgroundColor = this.person.colour;
    }
    
    editablePerson.prototype.createLi = function (data, cssClass) {
        li = document.createElement("li")
        li.innerHTML = data
        li.className = cssClass
        this.ul.appendChild(li)
        return li
    }
    
    editablePerson.prototype.addButtons = function () {
        this.buttonDiv = document.createElement("div")
        this.buttonDiv.className = "personButtons"
        this.div.appendChild(this.buttonDiv)

        this.deleteButton = this.addButton("Delete", "delete")
        this.editButton = this.addButton("Edit", "edit")
    }
    
    editablePerson.prototype.addButton = function (label, cssClass) {

        var newButton = document.createElement("button")
        newButton.innerHTML = label
        newButton.className = cssClass
        newButton.setAttribute('type', 'button')
        this.buttonDiv.appendChild(newButton)

        return newButton
    }
    
    editablePerson.prototype.addAccordianEvent = function () {
      this.div.addEventListener("click", this.addAccordianClass.bind(this))
    }
    
    editablePerson.prototype.addAccordianClass = function () {
      if(this.div.className == "person"){
        this.addButtonEventListeners()
        this.div.className = "person active"
      }
      else{
        this.removeButtonEventListeners()
        this.div.className = "person"
      }
    }
    
    editablePerson.prototype.addButtonEventListeners = function() {
        this.deleteButton.addEventListener("click", this.deletePerson.bind(this))
        this.editButton.addEventListener("click", this.editPerson.bind(this))
    }
    
    editablePerson.prototype.removeButtonEventListeners = function() {
      this.deleteButton.removeEventListener("click", this.deletePerson.bind(this))
      this.editButton.removeEventListener("click", this.editPerson.bind(this))
    }

    editablePerson.prototype.deletePerson = function (e) {
        this.person.isDeleted = 1;
        this.storage.updatePerson(this.person, 1).then(() => {this.observer.fire("personDeleted")})
    }
    
    editablePerson.prototype.editPerson = function (e) {
        e.stopPropagation()
        var editPersonurl = this.urlService.getPersonEditPage(this.pageContext.getCurrentGroupId(), this.person.externalId)
        window.location.href = editPersonurl
    }

    return editablePerson
    
})()