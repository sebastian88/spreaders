spreaders.pages.groupAdd = (function(){
    
        var groupAddPage = function(urlService, storage, synchroniser){
            this.urlService = urlService
            this.storage = storage
            this.synchroniser = synchroniser
    
            var createGroupButton = document.getElementsByClassName("createGroupButton")[0]
            createGroupButton.addEventListener("click", this.createGroupButtonClick.bind(this))
    
            this.synchroniser.startServiceWorker()
        }
        
        groupAddPage.prototype.createGroupButtonClick = function() {
            var groupName = document.getElementsByName("groupName")[0].value
            var group = new spreaders.model.group(groupName)
            group.createdOn = this.storage.getUtcUnixTimeStamp()
            group.updatedOn = this.storage.getUtcUnixTimeStamp()
            this.storage.addGroup(group).then((group) => {
                this.createGroupButtonClickCallback(group)
            })
        }
    
        groupAddPage.prototype.createGroupButtonClickCallback = function (group) {
            this.synchroniser.syncWithServer()
        window.location.href = this.urlService.getPeoplePage(group.externalId)
        }
        
        return groupAddPage
    })()
    
    var storage = new spreaders.storage()
    storage.connect().then(data => {
        var urlService = new spreaders.urlService()
        var pageContext = new spreaders.pageContext(urlService)
        var apiService = new spreaders.apiService()
        var synchroniser = new spreaders.sync.synchroniser(storage, apiService)
    
        var thisPage = new spreaders.pages.groupAdd(urlService, storage, synchroniser);
    })
    