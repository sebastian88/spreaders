﻿spreaders.sync.backgroundSynchroniser = (function(){


  var backgroundSynchroniser = function () {
    this.myWorker = new Worker('/js/scripts/sync/syncWorker.js');


    //this.myWorker.addEventListener("message", function (e) {
    //  alert(e.data);
    //}, false);

    this.myWorker.onmessage = function (e) {
      console.log(e.data)
    }

    this.myWorker.onerror = function (e) {
      alert("there have been an error")
    }

    //this.myWorker.start();


    this.myWorker.postMessage("script-1");
  }



  return backgroundSynchroniser
})()