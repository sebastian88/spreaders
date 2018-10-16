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
	
	payerRadio.prototype.isPersonSelected = function(person, transaction) {
		return transaction.payer == this.getPersonId(person)
	}
	
	return payerRadio;
}) ()