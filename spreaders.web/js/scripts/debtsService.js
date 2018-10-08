spreaders.debtsService = (function () {
    var debtsService = function () {
    }


    debtsService.prototype.calculateTotals = function (people, transactions) {
        var totals = []
        for (var i = 0; i < people.length; i++) {
            var personTotal = new spreaders.model.personTotal(people[i])
            for (var j = 0; j < transactions.length; j++) {
                var transaction = transactions[j]
                // payer
                if (transaction.payer == personTotal.person.externalId)
                    personTotal.total += Number(transaction.amount)
                //payees
                if (transaction.payees.includes(personTotal.person.externalId) == true)
                    personTotal.total -= Number(transaction.amount / transaction.payees.length)
            }
            var personDeletedAndNothingOwed = people[i].isDeleted == true && personTotal.total == 0

            if (!personDeletedAndNothingOwed)
                totals.push(personTotal)
        }
        return totals
    }


    debtsService.prototype.calculateDebts = function (people, transactions) {
        var peopleTotals = this.calculateTotals(people, transactions)
        peopleOwed = []
        for (var personTotal of peopleTotals) {
            if (personTotal.total >= 0) {
                peopleOwed.push(personTotal)
            }
        }

        for (var personOwed in peopleOwed) {
            var index = peopleTotals.indexOf(personOwed)
            if (index !== -1) {
                peopleTotals.splice(index, 1);
            }
        }

        debts = []

        this.sort(peopleOwed)
        this.sort(peopleTotals)

        for (var personTotal of peopleTotals) {
            var debtor = new spreaders.model.debtor(personTotal.person, personTotal.total)
            var mostGenerousPerson = peopleOwed[peopleOwed.length - 1]
            while (personTotal.total < 0 && mostGenerousPerson.total > 0) { 
                mostGenerousPerson = peopleOwed[peopleOwed.length - 1]
                owed = Math.min(-personTotal.total, mostGenerousPerson.total)
                owed = this.roundUp2db(owed)
                personTotal.total += owed
                personTotal.total = Math.round(personTotal.total * 100) / 100
                mostGenerousPerson.total -= owed
                mostGenerousPerson.total = Math.round(mostGenerousPerson.total * 100) / 100
                if(owed > 0.1)
                    debtor.debtees.push(new spreaders.model.debt(mostGenerousPerson.person, owed))
                this.sort(peopleOwed)
                mostGenerousPerson = peopleOwed[peopleOwed.length - 1]
            }
            if (debtor.debtees.length)
                debts.push(debtor)
        }

        return debts
    }

    debtsService.prototype.roundUp2db = function(number) {
        return Math.ceil(number * 100) / 100
    }

    debtsService.prototype.sort = function (peopleTotals) {
        peopleTotals.sort(function (a, b) {
            return a.total - b.total
        });
    }

    return debtsService
})()