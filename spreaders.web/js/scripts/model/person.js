spreaders.model.person = (function () {
	
  var person = function (groupId, name) {
    this.id
    this.externalId
    this.groupId = groupId
    this.externalGroupId
		this.name = name
		this.deleted = false
		this.isSyncNeeded = false
  };
	
	return person;
})();