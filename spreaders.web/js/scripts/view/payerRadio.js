spreaders.view.payerRadio = (function () {

	
  var payerRadio = function (currentGroup,
    radioContainer,
		storage,
		observer
		) {
			
		spreaders.view.personFormList.call(this, 
      currentGroup,
      radioContainer,
			storage,
			"radio",
			"payer",
      this.payerRadiosRenderedCallback.bind(this));
		
		this.observer = observer
		this.observer.subscribe("personCreated", this.createRadio, this)
		this.createRadios()
	}
	
	payerRadio.prototype = new spreaders.view.personFormList()

	payerRadio.prototype.payerRadiosRenderedCallback = function () {
	  this.observer.fire("payerRadiosRendered")
	}

	payerRadio.prototype.addSelectedValue = function(value) {
		for(var i = 0; i < this.inputs.length; i++) {
			if(this.inputs[i].value == value) {
				this.inputs[i].setAttribute('checked', 'checked')
			}
		}
	}	
	
	return payerRadio;
}) ()