(function(chrome) {
    
    chrome.devtools.panels.create(
        "Analytics",
        "assets/images/icon.png",
        "panel.html");

    chrome.devtools.panels.elements.createSidebarPane(
        "Analytics",
        function(sidebar) {
            sidebar.setPage("sidebar-analytics.html");
            sidebar.setHeight('200vh');
        });
        
    chrome.devtools.panels.elements.createSidebarPane(
        "Page View",
        function(sidebar) {
            sidebar.setPage("sidebar-pageview.html");
            sidebar.setHeight('200vh');
        });
        
})(chrome);

