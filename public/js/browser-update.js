(function setUpBrowserUpdate() {
  var $buoop = {notify:{i:-6,f:-6,o:-6,s:-6,c:-6},unsecure:true,style:"bottom",api:5};
  function $buo_f(){
    var e = document.createElement("script");
    e.src = "//browser-update.org/update.min.js";
    document.body.appendChild(e);
  };
  try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
  catch(e){window.attachEvent("onload", $buo_f)}
})();
