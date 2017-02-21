spreaders.view.addPerson = (function () {
  var addPerson = function (currentGroupId,
    addPersonContainer,
		storage,
		observer
	) {
    this.currentGroupId = currentGroupId
		this.addPersonContainer = addPersonContainer
		this.storage = storage
		this.observer = observer
		
		this.createAddPersonInput()
	}
	
	
	
	addPerson.prototype.createAddPersonInput = function()
	{
		this.addPersonInput = document.createElement("input")
		this.addPersonInput.setAttribute('type', 'text')
		this.addPersonInput.setAttribute('name', 'addPerson')
		this.addPersonContainer.appendChild(this.addPersonInput)
		
		this.addButton = document.createElement("button")
		this.addButton.innerHTML = "add"
		this.addButton.setAttribute('type', 'button')
		this.addPersonContainer.appendChild(this.addButton)
		
		this.addPersonInput.addEventListener("keydown", this.processAddPersonClickEventKeyDown.bind(this))
		this.addButton.addEventListener("click", this.processAddPersonClickEvent.bind(this))
	}
	
	addPerson.prototype.processAddPersonClickEventKeyDown = function(){
		if (event.keyCode == 13) {
			event.preventDefault();
			this.processAddPersonClickEvent()
		}
	}
	
	addPerson.prototype.processAddPersonClickEvent = function() {
		if(this.addPersonInput.value) {
		  var newPerson = new spreaders.model.person(this.currentGroupId, this.addPersonInput.value)
		  this.storage.addPerson(newPerson, this.processAddPersonClickEventCallback.bind(this))
			this.addPersonInput.value = ""
		}
	}

	addPerson.prototype.processAddPersonClickEventCallback = function (newPerson) {
	  this.observer.fire("personCreated", newPerson)
	}

	return addPerson
})()