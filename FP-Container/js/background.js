WebExtensionBlocker.fromLists(fetch, fullLists, {
    enableCompression: true,
    enableHtmlFiltering: true
}).then(function (blocker) {
    blocker.enableBlockingInBrowser();
    blocker.on('request-blocked', function (request) {
        console.log('url: ', request.url);
    });
});

// used to load setting before any scripts on the site loads
// https://stackoverflow.com/questions/45102497/injecting-javascript-variable-before-content-script/45105934#45105934
function addSeedCookie(details) {
    let seed = localStorage.getItem('setting');
    details.responseHeaders.push({
        name: "Set-Cookie",
        value: `setting_value=${seed};`
    });
    return {
        responseHeaders: details.responseHeaders
    };
}

chrome.webRequest.onHeadersReceived.addListener(
    addSeedCookie, { urls: ["<all_urls>"] }, ["blocking", "responseHeaders"]
);