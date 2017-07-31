spreaders.model.person = (function () {
	
  var person = function (group, name) {
    this.id
    this.externalId
    if(group)
      this.groupId = group.externalId
    else
      this.groupId
    this.name = name
		this.isDeleted = 0
		this.isSyncNeeded = 0
  };
	
	return person;
})();