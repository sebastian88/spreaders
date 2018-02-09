spreaders.model.person = (function () {
	
  var person = function (group, name, colour) {
    this.id
    this.externalId
    if(group)
      this.groupId = group.externalId
    else
      this.groupId
    this.name = name
    this.colour = colour
		this.isDeleted = 0
		this.isSyncNeeded = 0
  };
	
	return person;
})();