var url = new UrlParser(document.location.href).parseUrl();
chrome.storage.local.get('domains', function(result) {
    if (result['domains'].indexOf(url.hostname) !== -1) {
        loadCss('assets/stylesheets/tagging.css');
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.analyticsTagging) {
          loadCss('assets/stylesheets/tagging.css');
      } else {
          unloadCss('assets/stylesheets/tagging.css');
      }
  });
  
function loadCss(file) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(file);
  link.id = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function unloadCss(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}