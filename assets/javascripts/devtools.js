chrome.devtools.panels.create(
    "Analytics",
    "assets/images/icon.png",
    "panel.html",
    function(panel) {}
);

chrome.devtools.panels.elements.createSidebarPane(
    "Analytics",
    function(sidebar) {
        sidebar.setPage("sidebar.html");
        sidebar.setHeight('100vh');
    });