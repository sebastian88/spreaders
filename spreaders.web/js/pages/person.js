spreaders.pages.person = (function () {
    var person = function(pageContext, storage, urlService, synchroniser) {
        this.pageContext = pageContext
        this.storage = storage
        this.urlService = urlService
        this.synchroniser = synchroniser
        this.person
        
        this.colours = ['#f3a683','#f7d794','#778beb','#e77f67','#cf6a87','#e66767','#63cdda','#f8a5c2','#786fa6','#596275']

        this.name = document.getElementsByName("name")[0]
        this.colour = document.getElementsByName("colour")[0]
        this.firstLetter = document.getElementsByClassName("firstLetter")[0]
        this.changeIconButton = document.getElementsByClassName("changeIcon")[0]
        this.iconSelection = document.getElementsByClassName("iconSelection")[0]
        this.iconSelectionList = document.getElementsByClassName("iconSelectionList")[0]
        this.updateButton = document.getElementsByClassName("submit")[0]

        this.populateBackButton()

        this.changeIconButton.addEventListener("click", this.handleChangeIconClick.bind(this))
        this.iconSelectionList.addEventListener("click", this.handleIconListClick.bind(this))
        this.updateButton.addEventListener("click", this.processUpdateButtonClick.bind(this))
        
        var personId = this.pageContext.getCurrentPerson()
        this.storage.getPerson(personId).then(person => {
            this.person = person
            this.populateForm()
            this.populateIcons()
        })
        this.synchroniser.startServiceWorker()
    }
    
    person.prototype.populateBackButton = function() {
        var backButton = document.getElementsByClassName("backButton")[0]
        backButton.href = this.urlService.getPeoplePage(this.pageContext.getCurrentGroupId())
    }

    person.prototype.populateForm = function() {
        this.name.value = this.person.name
        this.colour.value = this.person.colour
        this.firstLetter.innerHTML = this.person.name.charAt(0)
        this.firstLetter.style.backgroundColor = this.person.colour
    }

    person.prototype.handleChangeIconClick = function(e) {
        e.preventDefault()
        if(this.iconSelection.classList.contains('active')) {
            this.iconSelection.className = 'iconSelection'
        }
        else {
            this.iconSelection.className = 'iconSelection active'
        }
    }

    person.prototype.populateIcons = function() {
        for (var i = 0; i < this.colours.length; i++) {
            var li = this.createIcon(this.colours[i])
            this.iconSelectionList.appendChild(li)
        }
    }

    person.prototype.createIcon = function(colour) {
        var li = document.createElement("li")
        if(colour == this.person.colour)
            li.classList = "firstLetter active"
        else    
            li.classList = "firstLetter"
        li.setAttribute("data-colour", colour)
        li.style.backgroundColor = colour
        li.innerText = this.person.name.charAt(0)
        return li
    }

    person.prototype.handleIconListClick = function(e) {
        if(e.target && e.target.nodeName == "LI") {
            var selectedIcon = document.getElementsByClassName("firstLetter active")[0]
            selectedIcon.className = "firstLetter"
            e.target.className = "firstLetter active"
            var colour = e.target.getAttribute("data-colour")
            this.colour.value = colour
            this.firstLetter.style.backgroundColor = colour

        }
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