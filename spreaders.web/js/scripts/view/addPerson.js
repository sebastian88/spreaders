spreaders.view.addPerson = (function () {
  var addPerson = function (currentGroup,
    addPersonContainer,
		storage,
		observer
	) {
    this.currentGroup = currentGroup
		this.addPersonContainer = addPersonContainer
		this.storage = storage
		this.observer = observer

		this.colours = ['#f3a683','#f7d794','#778beb','#e77f67','#cf6a87','#e66767','#63cdda','#f8a5c2','#786fa6','#596275']
		
		this.createAddPersonInput()
	}
	
	
	
	addPerson.prototype.createAddPersonInput = function()
	{
		this.addPersonInput = document.createElement("input")
		this.addPersonInput.setAttribute('type', 'text')
		this.addPersonInput.setAttribute('name', 'addPerson')
		this.addPersonInput.setAttribute('placeholder', 'Name')
		this.addPersonInput.className = "addPersonName"
		var inputWrapperDiv = document.createElement("div")
		inputWrapperDiv.className = "addPersonNameWrapper"
		inputWrapperDiv.appendChild(this.addPersonInput)
		this.addPersonContainer.appendChild(inputWrapperDiv)
		
		this.addButton = document.createElement("button")
		this.addButton.innerHTML = "Add"
		this.addButton.setAttribute('type', 'button')
		this.addButton.className = "addPersonButton"
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
	  if (this.addPersonInput.value) {
			var newPerson = new spreaders.model.person(this.currentGroup, this.addPersonInput.value, this.getColour())
			newPerson.createdOn = this.storage.getUtcUnixTimeStamp()
			newPerson.updatedOn = this.storage.getUtcUnixTimeStamp()
		  this.storage.addPerson(newPerson).then((person) => {
				this.processAddPersonClickEventCallback(person)
			})
			this.addPersonInput.value = ""
			this.addPersonInput.focus()
			this.addPersonInput.select()
		}
	}

	addPerson.prototype.processAddPersonClickEventCallback = function (newPerson) {
	  this.observer.fire("personCreated", newPerson)
	}

	addPerson.prototype.getColour = function() {
		return this.colours[Math.floor(Math.random() * this.colours.length)];
	}

	return addPerson
})()