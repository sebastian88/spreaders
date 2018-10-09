spreaders.view.payerRadio = (function () {

	
	var payerRadio = function (currentGroup,
		currentTransaction,
    radioContainer,
		storage,
		observer
		) {
			
		spreaders.view.personFormList.call(this, 
			currentGroup,
			currentTransaction,
      radioContainer,
			storage,
			"radio",
			"payer");
		
		this.observer = observer
		this.observer.subscribe("personCreated", this.createRadio, this)
		this.createRadios()
	}
	
	payerRadio.prototype = new spreaders.view.personFormList()

	payerRadio.prototype.addSelectedValue = function(value) {
		for(var i = 0; i < this.inputs.length; i++) {
			if(this.inputs[i].value == value) {
				this.inputs[i].setAttribute('checked', 'checked')
			}
		}
	}	
	
	return payerRadio;
}) ()