spreaders.view.navigation = (function() {
    var navigation = function(urlService, pageContext) {
        this.urlService = urlService
        this.pageContext = pageContext
    }

    navigation.prototype.init = function() {
        var groupId = this.pageContext.getCurrentGroupId()

        var paymentsNavItem = document.querySelector(".mobileNavItem.payments")
        paymentsNavItem.setAttribute("href", this.urlService.getTransactionsPage(groupId))

        var peopleNavItem = document.querySelector(".mobileNavItem.people")
        peopleNavItem.setAttribute("href", this.urlService.getPeoplePage(groupId))
        
        var payUpNavItem = document.querySelector(".mobileNavItem.payUp")
        payUpNavItem.setAttribute("href", this.urlService.getPayUpPage(groupId))
    }

    return navigation
})()