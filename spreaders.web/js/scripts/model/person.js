spreaders.model.person = (function () {
	
  var person = function (group, name) {
    this.id
    this.externalId
		this.groupId = group.id
		this.externalGroupId = group.externalId
		this.name = name
		this.deleted = false
		this.isSyncNeeded = false
  };
	
	return person;
})();