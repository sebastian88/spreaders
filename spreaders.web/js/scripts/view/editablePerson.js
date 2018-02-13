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
    }
    
    editablePerson.prototype.createLi = function (data, cssClass) {
        li = document.createElement("li")
        li.innerHTML = data
        li.className = cssClass
        this.ul.appendChild(li)
    }

    editablePerson.prototype.addButtons = function () {
        this.deleteButton = this.addButton("delete", "delete")
        this.editButton = this.addButton("edit", "edit")
        this.deleteButtonHander = this.deletePerson.bind(this)
        this.editButtonHandler = this.editPerson.bind(this)

        this.addButtonEventListeners()
    }
    
    editablePerson.prototype.addButtonEventListeners = function() {
        this.deleteButton.addEventListener("click", this.deleteButtonHander)
        this.editButton.addEventListener("click", this.editButtonHandler)
    }

    editablePerson.prototype.addButton = function (label, cssClass) {

        var newButton = document.createElement("button")
        newButton.innerHTML = label
        newButton.className = cssClass
        newButton.setAttribute('type', 'button')
        this.div.appendChild(newButton)

        return newButton
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