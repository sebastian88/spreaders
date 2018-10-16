spreaders.view.payeeCheckboxes = (function () {

	
  var payeeCheckboxes = function (currentGroup,
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
			"checkbox",
			"payee");

		this.observer = observer
		this.observer.subscribe("personCreated", this.createRadio, this)
		this.createRadios()
	}
	
	payeeCheckboxes.prototype = new spreaders.view.personFormList()
	
	payeeCheckboxes.prototype.isPersonSelected = function(person, transaction)
	{
		return transaction.payees.indexOf(this.getPersonId(person)) > -1
	}

	payeeCheckboxes.prototype.selectAll = function() {
		for (var i = 0; i < this.inputs.length; i++) {
			this.inputs[i].checked = true
		}
	}
	
	return payeeCheckboxes;
}) ()