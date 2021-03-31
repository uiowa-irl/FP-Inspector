
function urlCheckboxClicked() {
    localStorage.setItem('setting', '1');
    localStorage.setItem('specificScriptApiCheckboxValue', false);
    localStorage.setItem('apiCheckboxValue', false);

    let value;

    if (document.getElementById('toggle_url_blocking').checked == true) {
        value = true;
    } else {
        value = false;
    }
    localStorage.setItem('urlCheckboxValue', value);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}

document.getElementById('toggle_url_blocking').onclick = urlCheckboxClicked;

function apiCheckboxClicked() {
    localStorage.setItem('setting', '2');
    localStorage.setItem('specificScriptApiCheckboxValue', false);
    localStorage.setItem('urlCheckboxValue', false);

    let value;

    if (document.getElementById('toggle_api_blocking').checked == true) {
        value = true;
    } else {
        value = false;
    }
    localStorage.setItem('apiCheckboxValue', value);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}

document.getElementById('toggle_api_blocking').onclick = apiCheckboxClicked;

function specificScriptApiCheckboxClicked() {
    localStorage.setItem('setting', '3');
    localStorage.setItem('urlCheckboxValue', false);
    localStorage.setItem('apiCheckboxValue', false);

    let value;

    if (document.getElementById('toggle_script_specific_api_blocking').checked == true) {
        value = true;
    } else {
        value = false;
    }
    localStorage.setItem('specificScriptApiCheckboxValue', value);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}

document.getElementById('toggle_script_specific_api_blocking').onclick = specificScriptApiCheckboxClicked;

document.getElementById("toggle_api_blocking").checked = (localStorage.getItem('apiCheckboxValue') == "true");
document.getElementById("toggle_url_blocking").checked = (localStorage.getItem('urlCheckboxValue') == "true");
document.getElementById("toggle_script_specific_api_blocking").checked = (localStorage.getItem('specificScriptApiCheckboxValue') == "true");