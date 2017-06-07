spreaders.model.transaction = (function () {

  var transaction = function (group, payer, payees, amount, description) {
    this.id
    this.externalId
    this.groupId = group.externalId
    if (payees)
      this.payees = payees
    else
      this.payees = []
    this.payer = payer
    this.amount = amount
    this.description = description
    this.isDeleted = 0
    this.isSyncNeeded = 0
  };

  return transaction
})();