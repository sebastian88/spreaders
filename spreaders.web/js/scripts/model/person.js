spreaders.model.person = (function () {
	
  var person = function (group, name) {
    this.id
    this.externalId
    this.groupId = group.externalId
		this.name = name
		this.isDeleted = 0
		this.isSyncNeeded = 0
  };
	
	return person;
})();