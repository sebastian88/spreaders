spreaders.pageContext = (function(){
	
  var pageContext = function (urlService) {
    this.urlService = urlService
	}
	
	var getParameterByName = function(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var GetUrlPathElement = function (pathElement) {
	  var pathElements = window.location.pathname.split('/');

	  if (pathElements.indexOf(pathElement) !== -1) {
	    index = pathElements.indexOf(pathElement)
	    return pathElements[index + 1]
	  }
	}
	
	pageContext.prototype.getCurrentGroupId = function() {
	  return GetUrlPathElement(this.urlService.GroupsPathSection).toLowerCase()
	}
	
	pageContext.prototype.getCurrentTransaction = function() {
	  return GetUrlPathElement(this.urlService.TransactionsPathSection).toLowerCase()
	}
	
	pageContext.prototype.getCurrentPerson = function() {
	  return GetUrlPathElement(this.urlService.PeoplePathSection).toLowerCase()
	}
	
	return pageContext
})()