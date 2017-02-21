spreaders.observer = (function(){


	var observer = function() {
		this.handlers = [];  // observers
	}

	observer.prototype = {

		subscribe: function(type, fn, context) {
			this.handlers.push({type: type, fn: fn, context: context});
		},

		fire: function(type, o) {
			this.handlers.forEach(function(item) {
				if(item.type == type)
					item.fn.call(item.context, o);
			});
		}

	  // unsubscribe: function(fn) {
	  // this.handlers = this.handlers.filter(
	  // function(item) {
	  // if (item !== fn) {
	  // return item;
	  // }
	  // }
	  // );
	  // },
	}

	return observer
})()