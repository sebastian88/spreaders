spreaders.view.payeeCheckboxes = (function () {

	
  var payeeCheckboxes = function (currentGroup,
    radioContainer,
		storage,
		observer
		) {
			
    spreaders.view.personFormList.call(this,
      currentGroup,
			radioContainer, 
			storage,
			"checkbox",
			"payee",
      this.PayeeCheckboxesRenderedCallback.bind(this));

		this.observer = observer
		this.observer.subscribe("personCreated", this.createRadio, this)
		this.createRadios()
	}
	
	payeeCheckboxes.prototype = new spreaders.view.personFormList()
	
	payeeCheckboxes.prototype.PayeeCheckboxesRenderedCallback = function () {
	  this.observer.fire("payeeCheckboxesRendered")
	}

	payeeCheckboxes.prototype.addSelectedValues = function(values) {
		for(var i = 0; i < this.inputs.length; i++) {
			if(values.indexOf(parseInt(this.inputs[i].value)) > -1) {
				this.inputs[i].setAttribute('checked', 'checked')
			}
		}
	}
	
	return payeeCheckboxes;
}) ()