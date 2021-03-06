spreaders.view.personFormList = (function () {

	
  var personFormList = function (currentGroupId,
    radioContainer, 
		storage,
		inputType,
		inputName,
    callback
	) {
    this.currentGroupId = currentGroupId
		this.radioContainer = radioContainer
		this.storage = storage
		this.inputs = []
		this.inputType = inputType
		this.inputName = inputName
		this.callback = callback
		this.addPersonInput = {}
		this.addButton = {}
	}
	
	personFormList.prototype.createRadios = function() {
	  var payers = this.storage.getPeople(this.currentGroupId, this.createRadiosCallback.bind(this))
	  this.createErrorElement()
	}
	
	personFormList.prototype.createRadiosCallback = function (payers) {
	  for (var i = 0; i < payers.length; i++)
	    this.createRadio(payers[i])
	  this.callback()
	}
	
	personFormList.prototype.createRadio = function (person) {
		label = document.createElement("label")
		this.radioContainer.appendChild(label)
		
		var input = document.createElement("input")
		input.setAttribute('type', this.inputType);
		input.setAttribute('name', this.inputName);
		input.setAttribute('value', person.id);
		label.appendChild(input)
		
		div = document.createElement("div")
		div.className = "box"
		label.appendChild(div)
		
		span = document.createElement("span")
		span.innerHTML = person.name
		div.appendChild(span)
		
		this.inputs[this.inputs.length] = input
	}
	
	personFormList.prototype.createErrorElement = function() {
		this.errorElement = document.createElement("div")
		this.errorElement.className = "error error_" + this.inputName
		this.errorElement.innerHTML = "This field is required"
		this.errorElement.style.display = "none"
		this.radioContainer.appendChild(this.errorElement)
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
				values.push(parseInt(this.inputs[i].value))
		return values
	}
	
	return personFormList;
})()