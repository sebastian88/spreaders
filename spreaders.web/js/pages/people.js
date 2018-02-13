spreaders.pages.people = (function () {

    var people = function (pageContext, urlService, apiService, storage, observer, synchroniser) {
        this.group
        this.pageContext = pageContext
        this.urlService = urlService
        this.apiService = apiService
        this.storage = storage
        this.observer = observer
        this.synchroniser = synchroniser
        this.peopleContainer = document.getElementsByClassName("peopleContainer")[0]
        this.addPersonContainer = document.getElementsByClassName("addPerson")[0]
        
        var groupid = this.pageContext.getCurrentGroupId()
        this.storage.getGroup(groupid).then(group => {
            this.group = group
            this.createAddPeopleForm()
            this.getAndPopulatePeople()
        })
        
        this.observer.subscribe("personCreated", this.handlePersonCreated, this)
        this.observer.subscribe("personDeleted", this.handlePersonDeleted, this)
        this.synchroniser.startServiceWorker()
    }

    people.prototype.handlePersonCreated = function() {
        this.synchroniser.syncWithServer()
        this.getAndPopulatePeople()
    }
    
    people.prototype.handlePersonDeleted = function() {
        this.synchroniser.syncWithServer()
        this.getAndPopulatePeople()
    }

    people.prototype.getAndPopulatePeople = function() {
        this.peopleContainer.innerHTML = ""
        this.storage.getPeopleForGroup(this.group.externalId).then(people => {this.populatePeople(people)})
    }

    people.prototype.populatePeople = function(people) {
        people.forEach(function(person) {
            if(person.isDeleted == 0)
                new spreaders.view.editablePerson(person, this.peopleContainer, this.storage, this.observer, this.urlService, this.pageContext)
        }, this);
    }

    people.prototype.createAddPeopleForm = function() {
        new spreaders.view.addPerson(this.group, this.addPersonContainer, this.storage, this.observer)
    }

    return people
})()

var storage = new spreaders.storage()
storage.connect().then(data => {
  var urlService = new spreaders.urlService()
  var pageContext = new spreaders.pageContext(urlService)
  var observer = new spreaders.observer()
  var apiService = new spreaders.apiService()
  var synchroniser = new spreaders.sync.synchroniser(storage, apiService)

  var page = new spreaders.pages.people(pageContext, urlService, apiService, storage, observer, synchroniser)
})