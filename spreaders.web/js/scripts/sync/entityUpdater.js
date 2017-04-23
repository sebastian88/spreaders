spreaders.entityUpdater = (function () {

  var entityUpdater = function () {
    this.externalEntity
		this.updateFunction
		this.mapper
  }

  entityUpdater.prototype.update = function (entity) {
		entity = this.mapper(entity, this.externalEntity)
    this.updateFunction(entity, null, false)
  }

  return entityUpdater
})()