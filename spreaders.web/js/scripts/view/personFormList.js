spreaders.view.personFormList = (function () {

	
	var personFormList = function (currentGroup,
		currentTransaction,
    	radioContainer, 
		storage,
		inputType,
		inputName
	) {
		this.currentGroup = currentGroup
		this.currentTransaction = currentTransaction
		this.radioContainer = radioContainer
		this.storage = storage
		this.inputs = []
		this.inputType = inputType
		this.inputName = inputName
		this.addPersonInput = {}
		this.addButton = {}
	}
	
  	personFormList.prototype.createRadios = function () {
    	this.storage.getPeopleForGroup(this.currentGroup.externalId).then((people) => {
			this.createRadioscallback(people)
		})
	  	this.createErrorElement()
	}
	
	personFormList.prototype.createRadioscallback = function (people) {
	  for (var i = 0; i < people.length; i++)
	    this.createRadio(people[i])
	}
	
	personFormList.prototype.createRadio = function (person) {
		var isPersonSelected = this.isPersonSelected(person, this.currentTransaction)
		if(!isPersonSelected && person.isDeleted)
			return

		label = document.createElement("label")
		label.className = "personSelector"
		this.radioContainer.appendChild(label)
		
		var input = document.createElement("input")
		input.setAttribute('type', this.inputType)
		input.setAttribute('name', this.inputName)
		input.setAttribute('value', this.getPersonId(person))
		input.className = "hidden"
		label.appendChild(input)
		
		spanfirstLetter = document.createElement("span")
		spanfirstLetter.className = "firstLetter"
		spanfirstLetter.innerHTML = person.name.charAt(0)
		spanfirstLetter.style.backgroundColor = person.colour
		label.appendChild(spanfirstLetter)
		
		spanName = document.createElement("span")
		spanName.className = "name"
		spanName.innerHTML = person.name
		label.appendChild(spanName)

		if(isPersonSelected)
			input.setAttribute('checked', 'checked')
		
		this.inputs[this.inputs.length] = input
	}

	personFormList.prototype.isPersonSelected = function(person, transaction) {
		throw new Error('You must impliment this method.')
	}

	personFormList.prototype.getPersonId = function (person) {
		if (person.externalId)
			return person.externalId
		else
			return person.id
	}
	
	personFormList.prototype.createErrorElement = function() {
		this.errorElement = document.createElement("div")
		this.errorElement.className = "error error_" + this.inputName
		this.errorElement.innerHTML = "This field is required"
		this.errorElement.style.display = "none"
		this.radioContainer.parentElement.appendChild(this.errorElement)
	}
	
	personFormList.prototype.displayError = function() {
		if(this.isValid())
			return
		else
			this.errorElement.style.display = 'block'
	}
	
	personFormList.prototype.isValid = function() {
		if(this.getValues().length === 0)
			return false
		else
			return true
	}
	
	personFormList.prototype.getValues = function() {
		var values = []
		for(var i = 0; i < this.inputs.length; i++)
			if(this.inputs[i].checked)
				values.push(this.getId(this.inputs[i].value))
		return values
	}

	personFormList.prototype.getId = function (value) {
		if (!String(value).match(/[a-z]/i))
			return parseInt(value)
		else
			return value
	}
	
	return personFormList;
})()