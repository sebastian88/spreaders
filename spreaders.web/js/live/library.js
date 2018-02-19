var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(b,a,c){b!=Array.prototype&&b!=Object.prototype&&(b[a]=c.value)};$jscomp.getGlobal=function(b){return"undefined"!=typeof window&&window===b?b:"undefined"!=typeof global&&null!=global?global:b};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var b=0;return function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+b++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var b=$jscomp.global.Symbol.iterator;b||(b=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[b]&&$jscomp.defineProperty(Array.prototype,b,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(b){var a=0;return $jscomp.iteratorPrototype(function(){return a<b.length?{done:!1,value:b[a++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(b){$jscomp.initSymbolIterator();b={next:b};b[$jscomp.global.Symbol.iterator]=function(){return this};return b};$jscomp.makeIterator=function(b){$jscomp.initSymbolIterator();var a=b[Symbol.iterator];return a?a.call(b):$jscomp.arrayIterator(b)};
$jscomp.polyfill=function(b,a,c,d){if(a){c=$jscomp.global;b=b.split(".");for(d=0;d<b.length-1;d++){var e=b[d];e in c||(c[e]={});c=c[e]}b=b[b.length-1];d=c[b];a=a(d);a!=d&&null!=a&&$jscomp.defineProperty(c,b,{configurable:!0,writable:!0,value:a})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(b){function a(){this.batch_=null}function c(a){return a instanceof e?a:new e(function(c,b){c(a)})}if(b&&!$jscomp.FORCE_POLYFILL_PROMISE)return b;a.prototype.asyncExecute=function(a){null==this.batch_&&(this.batch_=[],this.asyncExecuteBatch_());this.batch_.push(a);return this};a.prototype.asyncExecuteBatch_=function(){var a=this;this.asyncExecuteFunction(function(){a.executeBatch_()})};var d=$jscomp.global.setTimeout;a.prototype.asyncExecuteFunction=function(a){d(a,
0)};a.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var a=this.batch_;this.batch_=[];for(var c=0;c<a.length;++c){var b=a[c];delete a[c];try{b()}catch(l){this.asyncThrow_(l)}}}this.batch_=null};a.prototype.asyncThrow_=function(a){this.asyncExecuteFunction(function(){throw a;})};var e=function(a){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var c=this.createResolveAndReject_();try{a(c.resolve,c.reject)}catch(h){c.reject(h)}};e.prototype.createResolveAndReject_=
function(){function a(a){return function(d){b||(b=!0,a.call(c,d))}}var c=this,b=!1;return{resolve:a(this.resolveTo_),reject:a(this.reject_)}};e.prototype.resolveTo_=function(a){if(a===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof e)this.settleSameAsPromise_(a);else{a:switch(typeof a){case "object":var c=null!=a;break a;case "function":c=!0;break a;default:c=!1}c?this.resolveToNonPromiseObj_(a):this.fulfill_(a)}};e.prototype.resolveToNonPromiseObj_=function(a){var c=
void 0;try{c=a.then}catch(h){this.reject_(h);return}"function"==typeof c?this.settleSameAsThenable_(c,a):this.fulfill_(a)};e.prototype.reject_=function(a){this.settle_(2,a)};e.prototype.fulfill_=function(a){this.settle_(1,a)};e.prototype.settle_=function(a,c){if(0!=this.state_)throw Error("Cannot settle("+a+", "+c|"): Promise already settled in state"+this.state_);this.state_=a;this.result_=c;this.executeOnSettledCallbacks_()};e.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var a=
this.onSettledCallbacks_,c=0;c<a.length;++c)a[c].call(),a[c]=null;this.onSettledCallbacks_=null}};var g=new a;e.prototype.settleSameAsPromise_=function(a){var c=this.createResolveAndReject_();a.callWhenSettled_(c.resolve,c.reject)};e.prototype.settleSameAsThenable_=function(a,c){var b=this.createResolveAndReject_();try{a.call(c,b.resolve,b.reject)}catch(l){b.reject(l)}};e.prototype.then=function(a,c){function b(a,c){return"function"==typeof a?function(c){try{d(a(c))}catch(p){g(p)}}:c}var d,g,f=new e(function(a,
c){d=a;g=c});this.callWhenSettled_(b(a,d),b(c,g));return f};e.prototype.catch=function(a){return this.then(void 0,a)};e.prototype.callWhenSettled_=function(a,c){function b(){switch(d.state_){case 1:a(d.result_);break;case 2:c(d.result_);break;default:throw Error("Unexpected state: "+d.state_);}}var d=this;null==this.onSettledCallbacks_?g.asyncExecute(b):this.onSettledCallbacks_.push(function(){g.asyncExecute(b)})};e.resolve=c;e.reject=function(a){return new e(function(c,b){b(a)})};e.race=function(a){return new e(function(b,
d){for(var e=$jscomp.makeIterator(a),g=e.next();!g.done;g=e.next())c(g.value).callWhenSettled_(b,d)})};e.all=function(a){var b=$jscomp.makeIterator(a),d=b.next();return d.done?c([]):new e(function(a,e){function g(c){return function(b){f[c]=b;k--;0==k&&a(f)}}var f=[],k=0;do f.push(void 0),k++,c(d.value).callWhenSettled_(g(f.length-1),e),d=b.next();while(!d.done)})};return e},"es6","es3");
$jscomp.executeAsyncGenerator=function(b){function a(a){return b.next(a)}function c(a){return b.throw(a)}return new Promise(function(d,e){function g(b){b.done?d(b.value):Promise.resolve(b.value).then(a,c).then(g,e)}g(b.next())})};$jscomp.polyfill("Object.is",function(b){return b?b:function(a,c){return a===c?0!==a||1/a===1/c:a!==a&&c!==c}},"es6","es3");
$jscomp.polyfill("Array.prototype.includes",function(b){return b?b:function(a,c){var b=this;b instanceof String&&(b=String(b));var e=b.length;for(c=c||0;c<e;c++)if(b[c]==a||Object.is(b[c],a))return!0;return!1}},"es7","es3");
$jscomp.checkStringArgs=function(b,a,c){if(null==b)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(a instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return b+""};$jscomp.polyfill("String.prototype.includes",function(b){return b?b:function(a,c){return-1!==$jscomp.checkStringArgs(this,a,"includes").indexOf(a,c||0)}},"es6","es3");
spreaders={pages:{},storage:{},observer:{},model:{},view:{},sync:{}};spreaders.maths={roundAndFormatForCurrency:function(b){b=Number(b);var a=!1;0>b&&(a=!0,b*=-1);var c=Math.pow(10,2);b=parseFloat((b*c).toFixed(11));b=(Math.round(b)/c).toFixed(2);a&&(b=(-1*b).toFixed(2));return b.replace(/\.(\d+)/,"<span>.$1</span>")}};spreaders.model.group=function(){return function(b){this.id;this.externalId="";this.name=b;this.isSyncNeeded=this.isDeleted=0}}();spreaders.model.person=function(){return function(b,a,c){this.id;this.externalId;b?this.groupId=b.externalId:this.groupId;this.name=a;this.colour=c;this.isSyncNeeded=this.isDeleted=0}}();spreaders.model.personTotal=function(){return function(b){this.person=b;this.total=0}}();spreaders.model.transaction=function(){return function(b,a,c,d,e){this.id;this.externalId;b?this.groupId=b.externalId:this.groupId;this.payees=c?c:[];this.payer=a;this.amount=d;this.description=e;this.isSyncNeeded=this.isDeleted=0}}();spreaders.view.personFormList=function(){var b=function(a,c,b,e,g,f){this.currentGroup=a;this.radioContainer=c;this.storage=b;this.inputs=[];this.inputType=e;this.inputName=g;this.callback=f;this.addPersonInput={};this.addButton={}};b.prototype.createRadios=function(){var a=this;this.storage.getPeopleForGroup(this.currentGroup.externalId).then(function(c){a.createRadiosCallback(c)});this.createErrorElement()};b.prototype.createRadiosCallback=function(a){for(var c=0;c<a.length;c++)this.createRadio(a[c]);
this.callback()};b.prototype.createRadio=function(a){label=document.createElement("label");this.radioContainer.appendChild(label);var c=document.createElement("input");c.setAttribute("type",this.inputType);c.setAttribute("name",this.inputName);c.setAttribute("value",this.getPersonId(a));label.appendChild(c);div=document.createElement("div");div.className="box";label.appendChild(div);span=document.createElement("span");span.innerHTML=a.name;div.appendChild(span);this.inputs[this.inputs.length]=c};
b.prototype.getPersonId=function(a){return a.externalId?a.externalId:a.id};b.prototype.createErrorElement=function(){this.errorElement=document.createElement("div");this.errorElement.className="error error_"+this.inputName;this.errorElement.innerHTML="This field is required";this.errorElement.style.display="none";this.radioContainer.appendChild(this.errorElement)};b.prototype.displayError=function(){this.isValid()||(this.errorElement.style.display="block")};b.prototype.isValid=function(){return 0===
this.getValues().length?!1:!0};b.prototype.getValues=function(){for(var a=[],c=0;c<this.inputs.length;c++)this.inputs[c].checked&&a.push(this.getId(this.inputs[c].value));return a};b.prototype.getId=function(a){return String(a).match(/[a-z]/i)?a:parseInt(a)};return b}();spreaders.view.addPerson=function(){var b=function(a,c,b,e){this.currentGroup=a;this.addPersonContainer=c;this.storage=b;this.observer=e;this.colours="#f3a683 #f7d794 #778beb #e77f67 #cf6a87 #e66767 #63cdda #f8a5c2 #786fa6 #596275".split(" ");this.createAddPersonInput()};b.prototype.createAddPersonInput=function(){this.addPersonInput=document.createElement("input");this.addPersonInput.setAttribute("type","text");this.addPersonInput.setAttribute("name","addPerson");this.addPersonInput.setAttribute("placeholder",
"Name");this.addPersonInput.className="addPersonName";var a=document.createElement("div");a.className="addPersonNameWrapper";a.appendChild(this.addPersonInput);this.addPersonContainer.appendChild(a);this.addButton=document.createElement("button");this.addButton.innerHTML="Add";this.addButton.setAttribute("type","button");this.addButton.className="addPersonButton";this.addPersonContainer.appendChild(this.addButton);this.addPersonInput.addEventListener("keydown",this.processAddPersonClickEventKeyDown.bind(this));
this.addButton.addEventListener("click",this.processAddPersonClickEvent.bind(this))};b.prototype.processAddPersonClickEventKeyDown=function(){13==event.keyCode&&(event.preventDefault(),this.processAddPersonClickEvent())};b.prototype.processAddPersonClickEvent=function(){var a=this;if(this.addPersonInput.value){var c=new spreaders.model.person(this.currentGroup,this.addPersonInput.value,this.getColour());c.createdOn=this.storage.getUtcUnixTimeStamp();c.updatedOn=this.storage.getUtcUnixTimeStamp();
this.storage.addPerson(c).then(function(c){a.processAddPersonClickEventCallback(c)});this.addPersonInput.value=""}};b.prototype.processAddPersonClickEventCallback=function(a){this.observer.fire("personCreated",a)};b.prototype.getColour=function(){return this.colours[Math.floor(Math.random()*this.colours.length)]};return b}();spreaders.view.editablePerson=function(){var b=function(a,c,b,e,g,f){this.person=a;this.container=c;this.storage=b;this.observer=e;this.urlService=g;this.pageContext=f;this.createDiv();this.populateDiv();this.addButtons();this.addAccordianEvent()};b.prototype.createDiv=function(){this.div=document.createElement("div");this.div.className="person";this.container.appendChild(this.div)};b.prototype.populateDiv=function(){this.ul=document.createElement("ul");this.ul.className="personDetails";this.div.appendChild(this.ul);
this.createLi(this.person.name,"name");this.createLi(this.person.name.charAt(0),"firstLetter").style.backgroundColor=this.person.colour};b.prototype.createLi=function(a,c){li=document.createElement("li");li.innerHTML=a;li.className=c;this.ul.appendChild(li);return li};b.prototype.addButtons=function(){this.buttonDiv=document.createElement("div");this.buttonDiv.className="personButtons";this.div.appendChild(this.buttonDiv);this.deleteButton=this.addButton("Delete","delete");this.editButton=this.addButton("Edit",
"edit")};b.prototype.addButton=function(a,c){var b=document.createElement("button");b.innerHTML=a;b.className=c;b.setAttribute("type","button");this.buttonDiv.appendChild(b);return b};b.prototype.addAccordianEvent=function(){this.div.addEventListener("click",this.addAccordianClass.bind(this))};b.prototype.addAccordianClass=function(){"person"==this.div.className?(this.addButtonEventListeners(),this.div.className="person active"):(this.removeButtonEventListeners(),this.div.className="person")};b.prototype.addButtonEventListeners=
function(){this.deleteButton.addEventListener("click",this.deletePerson.bind(this));this.editButton.addEventListener("click",this.editPerson.bind(this))};b.prototype.removeButtonEventListeners=function(){this.deleteButton.removeEventListener("click",this.deletePerson.bind(this));this.editButton.removeEventListener("click",this.editPerson.bind(this))};b.prototype.deletePerson=function(a){var c=this;this.person.isDeleted=1;this.storage.updatePerson(this.person,1).then(function(){c.observer.fire("personDeleted")})};
b.prototype.editPerson=function(a){a.stopPropagation();a=this.urlService.getPersonEditPage(this.pageContext.getCurrentGroupId(),this.person.externalId);window.location.href=a};return b}();spreaders.view.payeeCheckboxes=function(){var b=function(a,c,b,e){spreaders.view.personFormList.call(this,a,c,b,"checkbox","payee",this.PayeeCheckboxesRenderedCallback.bind(this));this.observer=e;this.observer.subscribe("personCreated",this.createRadio,this);this.createRadios()};b.prototype=new spreaders.view.personFormList;b.prototype.PayeeCheckboxesRenderedCallback=function(){this.observer.fire("payeeCheckboxesRendered")};b.prototype.addSelectedValues=function(a){for(var c=0;c<this.inputs.length;c++)(-1<
a.indexOf(parseInt(this.inputs[c].value))||-1<a.indexOf(this.inputs[c].value))&&this.inputs[c].setAttribute("checked","checked")};return b}();spreaders.view.payerRadio=function(){var b=function(a,c,b,e){spreaders.view.personFormList.call(this,a,c,b,"radio","payer",this.payerRadiosRenderedCallback.bind(this));this.observer=e;this.observer.subscribe("personCreated",this.createRadio,this);this.createRadios()};b.prototype=new spreaders.view.personFormList;b.prototype.payerRadiosRenderedCallback=function(){this.observer.fire("payerRadiosRendered")};b.prototype.addSelectedValue=function(a){for(var c=0;c<this.inputs.length;c++)this.inputs[c].value==
a&&this.inputs[c].setAttribute("checked","checked")};return b}();spreaders.view.transaction=function(){var b=function(a,c,b,e,g,f,k){this.transaction=a;this.people=c;this.container=b;this.storage=e;this.pageContext=g;this.urlService=f;this.observer=k;this.createDiv();this.populateDiv();this.addButtons();this.addAccordianEvent()};b.prototype.createDiv=function(){this.div=document.createElement("div");this.div.className="transaction";this.container.appendChild(this.div)};b.prototype.populateDiv=function(){this.ul=document.createElement("ul");this.ul.className="transactionDetails";
this.div.appendChild(this.ul);this.createLi(this.getPerson(this.transaction.payer).name,"payer");this.createLi(this.transaction.description,"description");this.createLi("\u00a3"+spreaders.maths.roundAndFormatForCurrency(this.transaction.amount),"amount");this.createLi(this.getPayeeNamesCsv(),"payees")};b.prototype.createLi=function(a,c,b){li=document.createElement("li");li.innerHTML=a;li.className=c;this.ul.appendChild(li)};b.prototype.getPayeeNamesCsv=function(){for(var a=[],c=0;c<this.transaction.payees.length;c++)a.push(this.getPerson(this.transaction.payees[c]));
return a.map(function(a){firstLetter=document.createElement("span");firstLetter.className="firstLetter";firstLetter.style.backgroundColor=a.colour;firstLetter.innerHTML=a.name.charAt(0);remainingLetters=document.createElement("span");remainingLetters.className="remainingLetters";remainingLetters.innerHTML=a.name.substring(1);firstLetter.appendChild(remainingLetters);return firstLetter.outerHTML}).join("")};b.prototype.getPerson=function(a){for(var c=0;c<this.people.length;c++)if(this.people[c].id===
a||this.people[c].externalId===a)return this.people[c]};b.prototype.addButtons=function(){this.deleteButton=this.addButton("Delete","delete");this.editButton=this.addButton("Edit","edit");this.deleteButtonHander=this.deleteTransaction.bind(this);this.editButtonHandler=this.editTransaction.bind(this)};b.prototype.addButton=function(a,c){var b=document.createElement("button");b.innerHTML=a;b.className=c;b.setAttribute("type","button");this.div.appendChild(b);return b};b.prototype.addButtonEventListeners=
function(){this.deleteButton.addEventListener("click",this.deleteButtonHander);this.editButton.addEventListener("click",this.editButtonHandler)};b.prototype.removeButtonEventListeners=function(){this.deleteButton.removeEventListener("click",this.deleteButtonHander);this.editButton.removeEventListener("click",this.editButtonHandler)};b.prototype.addAccordianEvent=function(){this.div.addEventListener("click",this.addAccordianClass.bind(this))};b.prototype.addAccordianClass=function(){"transaction"==
this.div.className?(this.addButtonEventListeners(),this.div.className="transaction active"):(this.removeButtonEventListeners(),this.div.className="transaction")};b.prototype.deleteTransaction=function(a){var c=this;a.stopPropagation();this.transaction.isDeleted=1;this.storage.updateTransaction(this.transaction,1).then(function(){c.deleteTransactionCallback()})};b.prototype.deleteTransactionCallback=function(){this.container.removeChild(this.div);this.observer.fire("deleteTransaction",this.transaction)};
b.prototype.editTransaction=function(a){a.stopPropagation();window.location.href=this.urlService.getTransactionPage(this.pageContext.getCurrentGroupId(),this.transaction.externalId)};return b}();spreaders.pageContext=function(){var b=function(a){this.urlService=a},a=function(a){var c=window.location.pathname.split("/");if(-1!==c.indexOf(a))return index=c.indexOf(a),c[index+1]};b.prototype.getCurrentGroupId=function(){return a(this.urlService.GroupsPathSection).toLowerCase()};b.prototype.getCurrentTransaction=function(){return a(this.urlService.TransactionsPathSection).toLowerCase()};b.prototype.getCurrentPerson=function(){return a(this.urlService.PeoplePathSection).toLowerCase()};return b}();spreaders.urlService=function(){var b=function(){this.forwardSlash="/";this.GroupsPathSection="groups";this.TransactionsPathSection="transactions";this.PeoplePathSection="people"};b.prototype.getGroupPage=function(){return this.forwardSlash+this.GroupsPathSection+this.forwardSlash};b.prototype.getTransactionsPage=function(a){return this.getGroupPage()+a+this.forwardSlash+this.TransactionsPathSection+this.forwardSlash};b.prototype.getTransactionPage=function(a,c){a=this.getTransactionsPage(a);return a=
c?a+(c+this.forwardSlash):a+("add"+this.forwardSlash)};b.prototype.getPeoplePage=function(a){return this.getGroupPage()+a+this.forwardSlash+this.PeoplePathSection+this.forwardSlash};b.prototype.getPersonEditPage=function(a,c){return this.getPeoplePage(a)+c+this.forwardSlash};return b}();spreaders.apiService=function(){var b=function(){this.baseUrl="http://localhost:54321";this.apiPath="api";this.syncEndPoint="sync";this.getGroupEndPoint="getgroup";this.forwardSlash="/";this.syncUrl=this.baseUrl+this.forwardSlash+this.apiPath+this.forwardSlash+this.syncEndPoint;this.getGroupUrl=this.baseUrl+this.forwardSlash+this.apiPath+this.forwardSlash+this.getGroupEndPoint+this.forwardSlash};b.prototype.sync=function(a){var c=this;return new Promise(function(b,e){var d=new XMLHttpRequest;d.onreadystatechange=
function(){d.readyState===XMLHttpRequest.DONE&&(200===d.status?b():e())}.bind(c);d.open("POST",c.syncUrl,!0);d.setRequestHeader("Content-type","application/json");d.send(JSON.stringify(a))})};b.prototype.syncWithFetch=function(a){return fetch(this.syncUrl,{method:"POST",body:JSON.stringify(a),headers:new Headers({"content-type":"application/json"})})};b.prototype.getGroup=function(a,c,b){var d=new XMLHttpRequest;d.onreadystatechange=function(){d.readyState===XMLHttpRequest.DONE&&200===d.status&&c(JSON.parse(d.response),
b)}.bind(this);d.open("GET",this.getGroupUrl+a,!0);d.setRequestHeader("Content-type","application/json");d.send()};b.prototype.getGroupPromise=function(a){var c=this;return new Promise(function(b,e){fetch(c.getGroupUrl+a,{headers:new Headers({"content-type":"application/json"})}).then(function(a){a.json().then(function(a){return b(a)})}).catch(function(a){return e(a)})})};return b}();spreaders.storageIndexedDb=function(){var b=function(){this.db;this.callbacks=[];this.dbSchema={name:"SpreadersDb",version:3,groupsTable:{tableName:"groups",keyPath:"id",autoIncrement:!0,index:["externalId","isDeleted","isSyncNeeded","createdOn","updatedOn"],unique:[!0,!1,!1]},peopleTable:{tableName:"people",keyPath:"id",autoIncrement:!0,index:"externalId groupId isDeleted isSyncNeeded createdOn updatedOn".split(" "),unique:[!0,!1,!1,!1]},transactionsTable:{tableName:"transactions",keyPath:"id",autoIncrement:!0,
index:"externalId groupId isDeleted isSyncNeeded createdOn updatedOn".split(" "),unique:[!0,!1,!1,!1]}};this.localIndexedDb=indexedDB?indexedDB:window.indexedDB};b.prototype.handleError=function(a){reject("Error")};b.prototype.handleSuccess=function(a){this.db=a.target.result;resolve()};b.prototype.connect=function(){var a=this;return new Promise(function(c,b){var d=a.localIndexedDb.open(a.dbSchema.name,a.dbSchema.version);d.onupgradeneeded=function(a){this.createDatabase(a);a.target.transaction.oncomplete=
function(a){c()}}.bind(a);d.onsuccess=function(a){this.db=a.target.result;c()}.bind(a);d.onerror=function(a){this.handleError(a);b("Error")}.bind(a)})};b.prototype.createDatabase=function(a){this.db=this.db=a.target.result;this.createTable(this.db,this.dbSchema.groupsTable);this.createTable(this.db,this.dbSchema.peopleTable);this.createTable(this.db,this.dbSchema.transactionsTable)};b.prototype.createTable=function(a,c){if(!a.objectStoreNames.contains(c.tableName)){a=a.createObjectStore(c.tableName,
{keyPath:c.keyPath,autoIncrement:c.autoIncrement});for(var b in c.index)a.createIndex(c.index[b],c.index[b],{unique:c.unique[b]})}};b.prototype.isSupported=function(){var a=!0;this.localIndexedDb||(a=!1);return a};b.prototype.createReadWriteTransaction=function(a){var c=this.db.transaction(a,"readwrite");return this.getObjectStore(c,a)};b.prototype.createReadTransaction=function(a){var c=this.db.transaction(a,"readonly");return this.getObjectStore(c,a)};b.prototype.getObjectStore=function(a,c){return a.objectStore(c)};
b.prototype.generateUUID=function(){var a=(new Date).getTime();"undefined"!==typeof performance&&"function"===typeof performance.now&&(a+=performance.now());return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var b=(a+16*Math.random())%16|0;a=Math.floor(a/16);return("x"===c?b:b&3|8).toString(16)})};return b}();spreaders.storage=function(){var b=function(){};b.prototype=new spreaders.storageIndexedDb;b.prototype.handleError=function(a){console.log(a)};b.prototype.getUtcUnixTimeStamp=function(){return Math.floor((new Date).getTime()/1E3)};b.prototype.addEntity=function(a,c){var b=this;return new Promise(function(d,g){a.externalId=b.generateUUID();a.isSyncNeeded=1;var e=b.createReadWriteTransaction(c).add(a);e.onerror=function(a){g(a)};e.onsuccess=function(c){a.id=c.target.result;d(a)}})};b.prototype.getAllOfEntity=
function(a){var c=this;return new Promise(function(b,e){var d=[],f=c.createReadTransaction(a).openCursor();f.onerror=function(a){e(a)};f.onsuccess=function(a){(a=a.target.result)?(a.value.isDeleted||d.push(a.value),a.continue()):b(d)}})};b.prototype.getFromIndexStore=function(a,c,b){var d=this;return new Promise(function(e,f){var g=[],h=d.createReadTransaction(a).index(c).openCursor(b);h.onerror=function(a){f(a)};h.onsuccess=function(a){(a=a.target.result)?(a.value.isDeleted||g.push(a.value),a.continue()):
e(g)}})};b.prototype.getAllFromIndexStore=function(a,c,b){var d=this;return new Promise(function(e,f){var g=[],h=d.createReadTransaction(a).index(c).openCursor(b);h.onerror=function(a){f(a)};h.onsuccess=function(a){(a=a.target.result)?(g.push(a.value),a.continue()):e(g)}})};b.prototype.getOneFromIndexStore=function(a,c,b){var d=this;return new Promise(function(e,f){var g=d.createReadTransaction(a).index(c).openCursor(b);g.onerror=function(a){f(a)};g.onsuccess=function(a){(a=a.target.result)?e(a.value):
e(null)}})};b.prototype.updateEntity=function(a,c,b){var d=this;return new Promise(function(e,f){c.isSyncNeeded=b&&0!==b?1:0;d.createReadWriteTransaction(a).put(c).onsuccess=function(a){e(a.target.result)}})};b.prototype.addOrUpdateEntity=function(a,c,b,e){var d=this;return new Promise(function(g,k){var f=d.createReadTransaction(a).index("externalId").openCursor(c.id);f.onerror=function(a){k(a)};f.onsuccess=function(d){d=d.target.result;var f=null;d&&(f=d.value);e(f,c)?g(!1):(d=b(f,c),this.createReadWriteTransaction(a).put(d).onsuccess=
function(a){g(!0)})}.bind(d)})};b.prototype.addGroup=function(a){return this.addEntity(a,this.dbSchema.groupsTable.tableName)};b.prototype.updateGroup=function(a,c){return this.updateEntity(this.dbSchema.groupsTable.tableName,a,c)};b.prototype.addOrUpdateGroup=function(a,c,b){return this.addOrUpdateEntity(this.dbSchema.groupsTable.tableName,a,c,b)};b.prototype.getAllGroups=function(){return this.getAllOfEntity(this.dbSchema.groupsTable.tableName)};b.prototype.getGroup=function(a){return this.getOneFromIndexStore(this.dbSchema.groupsTable.tableName,
"externalId",a)};b.prototype.getGroupsForSync=function(){return this.getAllFromIndexStore(this.dbSchema.groupsTable.tableName,"isSyncNeeded",1)};b.prototype.addPerson=function(a){return this.addEntity(a,this.dbSchema.peopleTable.tableName)};b.prototype.updatePerson=function(a,c){return this.updateEntity(this.dbSchema.peopleTable.tableName,a,c)};b.prototype.addOrUpdatePerson=function(a,c,b){return this.addOrUpdateEntity(this.dbSchema.peopleTable.tableName,a,c,b)};b.prototype.getPeopleForSync=function(){return this.getAllFromIndexStore(this.dbSchema.peopleTable.tableName,
"isSyncNeeded",1)};b.prototype.getPeopleForGroup=function(a){return this.getAllFromIndexStore(this.dbSchema.peopleTable.tableName,"groupId",a)};b.prototype.getPerson=function(a){return this.getOneFromIndexStore(this.dbSchema.peopleTable.tableName,"externalId",a)};b.prototype.addTransaction=function(a){return this.addEntity(a,this.dbSchema.transactionsTable.tableName)};b.prototype.updateTransaction=function(a,c){return this.updateEntity(this.dbSchema.transactionsTable.tableName,a,c)};b.prototype.addOrUpdateTransaction=
function(a,c,b){return this.addOrUpdateEntity(this.dbSchema.transactionsTable.tableName,a,c,b)};b.prototype.getTransaction=function(a){return this.getOneFromIndexStore(this.dbSchema.transactionsTable.tableName,"externalId",a)};b.prototype.getTransactions=function(a){return this.getFromIndexStore(this.dbSchema.transactionsTable.tableName,"groupId",a)};b.prototype.getTransactionsForSync=function(){return this.getAllFromIndexStore(this.dbSchema.transactionsTable.tableName,"isSyncNeeded",1)};return b}();spreaders.sync.synchroniser=function(){var b=function(a,c){this.storage=a;this.apiService=c;this.transactionsAddedToJson=this.peopleAddedToJson=this.groupsAddedToJson=!1;this.syncedGroups=[];this.syncedPeople=[];this.syncedTransactions=[]};b.prototype.syncEntities=function(){var a=this;return $jscomp.executeAsyncGenerator(function(){function c(c,d,m){for(;;)switch(b){case 0:return a.apiUpdateJsonModel={groups:[],people:[],transactions:[]},b=1,{value:a.storage.getGroupsForSync(),done:!1};case 1:if(1!=
c){b=2;break}b=-1;throw m;case 2:return h=l=d,b=3,{value:a.storage.getPeopleForSync(),done:!1};case 3:if(1!=c){b=4;break}b=-1;throw m;case 4:return f=k=d,b=5,{value:a.storage.getTransactionsForSync(),done:!1};case 5:if(1!=c){b=6;break}b=-1;throw m;case 6:return e=g=d,a.apiUpdateJsonModel.groups=a.createGroupsJson(h),a.apiUpdateJsonModel.people=a.createPeopleJson(f),a.apiUpdateJsonModel.transactions=a.createTransactionsJson(e),b=-1,{value:a.makeRequest(),done:!0};default:return{value:void 0,done:!0}}}
var b=0,e,g,f,k,h,l,n={next:function(a){return c(0,a,void 0)},throw:function(a){return c(1,void 0,a)},return:function(a){throw Error("Not yet implemented");}};$jscomp.initSymbolIterator();n[Symbol.iterator]=function(){return this};return n}())};b.prototype.createGroupsJson=function(a){groupsJson=[];for(var c=0;c<a.length;c++)groupsJson.push({id:a[c].externalId,name:a[c].name,isDeleted:a[c].isDeleted,createdOn:a[c].createdOn,updatedOn:a[c].updatedOn}),this.syncedGroups.push(a[c]);return groupsJson};
b.prototype.createPeopleJson=function(a){peopleJson=[];for(var c=0;c<a.length;c++)peopleJson.push({id:a[c].externalId,name:a[c].name,colour:a[c].colour,isDeleted:a[c].isDeleted,groupId:a[c].groupId,createdOn:a[c].createdOn,updatedOn:a[c].updatedOn}),this.syncedPeople.push(a[c]);return peopleJson};b.prototype.createTransactionsJson=function(a){transactionJson=[];for(var c=0;c<a.length;c++)transactionJson.push({id:a[c].externalId,amount:a[c].amount,description:a[c].description,createdOn:a[c].createdOn,
updatedOn:a[c].updatedOn,payerId:a[c].payer,payees:a[c].payees,isDeleted:a[c].isDeleted,groupId:a[c].groupId}),this.syncedTransactions.push(a[c]);return transactionJson};b.prototype.makeRequest=function(){var a=this;return $jscomp.executeAsyncGenerator(function(){function c(c,d,e){for(;;)switch(b){case 0:return b=-1,{value:new Promise(function(c,b){a.isSyncNeeded()?a.apiService.syncWithFetch(a.apiUpdateJsonModel).then(function(){Promise.all(a.setEntitiesToSynced()).then(function(){c()})}):c()}),done:!0};
default:return{value:void 0,done:!0}}}var b=0,e={next:function(a){return c(0,a,void 0)},throw:function(a){return c(1,void 0,a)},return:function(a){throw Error("Not yet implemented");}};$jscomp.initSymbolIterator();e[Symbol.iterator]=function(){return this};return e}())};b.prototype.isSyncNeeded=function(){return 0<this.apiUpdateJsonModel.groups.length||0<this.apiUpdateJsonModel.people.length||0<this.apiUpdateJsonModel.transactions.length?!0:!1};b.prototype.setEntitiesToSynced=function(){var a=[];
a.push(this.processResponseEntities(this.syncedGroups,this.storage.getGroup.bind(this.storage),this.storage.updateGroup.bind(this.storage),this.mapEntity));a.push(this.processResponseEntities(this.syncedPeople,this.storage.getPerson.bind(this.storage),this.storage.updatePerson.bind(this.storage),this.mapEntity));a.push(this.processResponseEntities(this.syncedTransactions,this.storage.getTransaction.bind(this.storage),this.storage.updateTransaction.bind(this.storage),this.mapEntity));return a};b.prototype.mapEntity=
function(a,c){a.isSyncNeeded=0;return a};b.prototype.processResponseEntities=function(a,c,b,e){for(var d=[],f=0;f<a.length;f++)d.push(this.processResponseEntity(a[f],c,b,e));return d};b.prototype.processResponseEntity=function(a,c,b,e){return new Promise(function(d,f){c(a.externalId).then(function(c){c=e(c,a);b(c,0).then(function(){d()}).catch(function(a){})}).catch(function(a){})})};b.prototype.mapGroup=function(a,c){a||(a=new spreaders.model.group);a.externalId=c.id;a.name=c.name;a.createdOn=c.createdOn;
a.updatedOn=c.updatedOn;a.isDeleted=0;c.isDeleted&&(a.isDeleted=1);a.isSyncNeeded=0;return a};b.prototype.mapPerson=function(a,c){a||(a=new spreaders.model.person);a.externalId=c.id;a.groupId=c.groupId;a.name=c.name;a.colour=c.colour;a.createdOn=c.createdOn;a.updatedOn=c.updatedOn;a.isDeleted=0;c.isDeleted&&(a.isDeleted=1);a.isSyncNeeded=0;return a};b.prototype.mapTransaction=function(a,c){a||(a=new spreaders.model.transaction);a.externalId=c.id;a.groupId=c.groupId;a.payees=c.payees;a.payer=c.payerId;
a.amount=Number(c.amount);a.description=c.description;a.createdOn=c.createdOn;a.updatedOn=c.updatedOn;a.isDeleted=0;c.isDeleted&&(a.isDeleted=1);a.createdOn=c.createdOn;a.updatedOn=c.updatedOn;a.isSyncNeeded=0;return a};b.prototype.checkForGroupUpdates=function(a,c){this.apiService.getGroup(a,this.UpdateGroup.bind(this),c)};b.prototype.UpdateGroup=function(a){var c=this;return new Promise(function(b,e){a||e("no group infomation passed in");e=[];var d=c.storage.addOrUpdateGroup(a.group,c.mapGroup,
c.isGroupIdentical);e.push(d);for(d=0;d<a.people.length;d++){var f=c.storage.addOrUpdatePerson(a.people[d],c.mapPerson,c.isPersonIdentical);e.push(f)}for(d=0;d<a.transactions.length;d++)f=c.storage.addOrUpdateTransaction(a.transactions[d],c.mapTransaction,c.isTransactionIdentical.bind(c)),e.push(f);Promise.all(e).then(function(a){a=a.includes(!0);b(a)},function(){}.bind(c))})};b.prototype.isGroupIdentical=function(a,c){return a&&a.name==c.name&&a.isDeleted==c.isDeleted?!0:!1};b.prototype.isPersonIdentical=
function(a,c){return a&&a.name==c.name&&a.colour==c.colour&&a.isDeleted==c.isDeleted?!0:!1};b.prototype.isTransactionIdentical=function(a,c){return a&&this.areArraysEqual(a.payees,c.payees)&&a.payer==c.payerId&&this.numbersAreEqual(a.amount,c.amount)&&a.description==c.description&&a.isDeleted==c.isDeleted?!0:!1};b.prototype.numbersAreEqual=function(a,c){return 0==Number(a)-Number(c)};b.prototype.areArraysEqual=function(a,c){if(!a&&!c)return!0;if(!a||!c||a.length!=c.length)return!1;for(var b=0;b<a.length;b++)if(!c[b].includes(a[b]))return!1;
return!0};b.prototype.isServiceWorkerAvailable=function(){return"serviceWorker"in navigator};b.prototype.startServiceWorker=function(){this.isServiceWorkerAvailable()&&navigator.serviceWorker.register("/serviceWorker.js").then(function(a){}).catch(function(a){})};b.prototype.syncWithServer=function(){this.isServiceWorkerAvailable()&&navigator.serviceWorker.ready.then(function(a){a.sync.register("sync-updated-entities")})};b.prototype.getUpdatesForGroup=function(a){this.isServiceWorkerAvailable()&&
navigator.serviceWorker.ready.then(function(b){b.sync.register("sync-group-"+a)})};return b}();spreaders.observer=function(){var b=function(){this.handlers=[]};b.prototype={subscribe:function(a,b,d){this.handlers.push({type:a,fn:b,context:d})},fire:function(a,b){this.handlers.forEach(function(c){c.type==a&&c.fn.call(c.context,b)})}};return b}();
