spreaders.pages.payUp = (function () {
    var payUp = function (pageContext, urlService, storage, debtsService) {
        this.pageContext = pageContext
        this.urlService - urlService
        this.storage = storage
        this.debtsService = debtsService

        this.getGroupAndPopulatePage()
    }

    payUp.prototype.getGroupAndPopulatePage = function () {
        this.storage.getGroup(this.pageContext.getCurrentGroupId()).then((group) => {
            this.PopulatePage(group)
        })
    }

    payUp.prototype.PopulatePage = function (group) {

        var promises = []

        promises.push(this.storage.getPeopleForGroup(this.pageContext.getCurrentGroupId()).then(people => {
            this.people = people
        }))
        promises.push(this.storage.getTransactions(this.pageContext.getCurrentGroupId()).then(transactions => {
            this.transactions = transactions
        }))

        Promise.all(promises).then(() => {
            this.renderDebts()
        })
    }

    payUp.prototype.renderDebts = function () {
        var debts = this.debtsService.calculateDebts(this.people, this.transactions)

        var debtsDiv = document.getElementsByClassName('debts')[0]
        var ul = document.createElement('ul')
        debtsDiv.appendChild(ul)
        for (var debt of debts) {
            var li = document.createElement('li')
            li.innerText = debt.payer.name + " pays:"
            var ul2 = document.createElement('ul')
            for (var debtee of debt.debtees) {
                var li2 = document.createElement('li');
                li2.innerText = debtee.payee.name + " £" + debtee.amount
                ul2.appendChild(li2);
            }
            li.appendChild(ul2);
            ul.appendChild(li);
        }
    }

    return payUp
})()


var storage = new spreaders.storage()
storage.connect().then(data => {
    var urlService = new spreaders.urlService()
    var pageContext = new spreaders.pageContext(urlService)
    new spreaders.view.navigation(urlService, pageContext).init()
    var debtsService = new spreaders.debtsService()

    var page = new spreaders.pages.payUp(pageContext, urlService, storage, debtsService)
})