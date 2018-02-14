spreaders.pages.person = (function () {
    var person = function(pageContext, storage, urlService, synchroniser) {
        this.pageContext = pageContext
        this.storage = storage
        this.urlService = urlService
        this.synchroniser = synchroniser
        this.person
        
        this.name = document.getElementsByName("name")[0]
        this.colour = document.getElementsByName("colour")[0]
        this.updateButton = document.getElementsByClassName("submit")[0]

        this.updateButton.addEventListener("click", this.processUpdateButtonClick.bind(this))
        
        var personId = this.pageContext.getCurrentPerson()
        this.storage.getPerson(personId).then(person => {
            this.person = person
            this.populateForm()
        })
        this.synchroniser.startServiceWorker()
    }

    person.prototype.populateForm = function() {
        this.name.value = this.person.name
        this.colour.value = this.person.colour
    }

    person.prototype.processUpdateButtonClick = function() {
        this.person.name = this.name.value
        this.person.colour = this.colour.value
        this.person.updatedOn = this.storage.getUtcUnixTimeStamp()
        this.storage.updatePerson(this.person, true).then(() => {
            this.synchroniser.syncWithServer()
            window.location.href = this.urlService.getPeoplePage(this.pageContext.getCurrentGroupId())
        })
    }

    return person
})()

var storage = new spreaders.storage()
storage.connect().then(data => {
    var urlService = new spreaders.urlService()
    var pageContext = new spreaders.pageContext(urlService)
    var apiService = new spreaders.apiService()
    var synchroniser = new spreaders.sync.synchroniser(storage, apiService)
    var page = new spreaders.pages.person(pageContext, storage, urlService, synchroniser)
})