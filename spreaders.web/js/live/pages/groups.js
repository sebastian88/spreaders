spreaders.pages.groups=function(){var a=function(b,c,a){this.urlService=b;this.storage=c;this.synchroniser=a;this.container=document.getElementsByClassName("groupContainer")[0];this.ul=document.createElement("ul");this.container.appendChild(this.ul);this.renderGroups();document.getElementsByClassName("createGroupButton")[0].addEventListener("click",this.createGroupButtonClick.bind(this));this.synchroniser.startServiceWorker()};a.prototype.renderGroups=function(){var b=this;this.storage.getAllGroups().then(function(c){b.createGroupsListItem(c)})};
a.prototype.createGroupsListItem=function(b){for(var c=0;c<b.length;c++)this.createGroupListItem(b[c])};a.prototype.createGroupListItem=function(b){var c=document.createElement("li");this.ul.appendChild(c);var a=document.createElement("a");a.href=this.urlService.getTransactionsPage(b.externalId);a.innerHTML=b.id+" "+b.name;a.title=b.id;c.appendChild(a)};a.prototype.createGroupButtonClick=function(){var b=this,a=document.getElementsByName("groupName")[0].value;a=new spreaders.model.group(a);a.createdOn=
this.storage.getUtcUnixTimeStamp();a.updatedOn=this.storage.getUtcUnixTimeStamp();this.storage.addGroup(a).then(function(a){b.createGroupButtonClickCallback(a)})};a.prototype.createGroupButtonClickCallback=function(a){this.synchroniser.syncWithServer();window.location.href=this.urlService.getPeoplePage(a.externalId)};return a}();var storage=new spreaders.storage;
storage.connect().then(function(a){a=new spreaders.urlService;new spreaders.pageContext(a);var b=new spreaders.apiService;b=new spreaders.sync.synchroniser(storage,b);new spreaders.pages.groups(a,storage,b)});
