spreaders.entityUpdater = (function () {

  var entityUpdater = function () {
    this.externalId
    this.updateFunction
  }

  entityUpdater.prototype.updateExternalId = function (entity) {
    entity.externalId = this.externalId
    this.updateFunction(entity, null, false)
  }

  return entityUpdater
})()