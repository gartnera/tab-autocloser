const browser = window.browser || window.chrome;

let rules = [];

function update_rules() {
    browser.storage.sync.get("rules", (res) => {
        if (!res.rules) {
            return;
        }
        const newRules = [];
        for (const rule of res.rules) {
            const r = {
                url: new RegExp(rule.url),
                title: new RegExp(rule.url),
            }
            newRules.push(r);
        }
        rules = newRules;
    });
}

function tab_update_handler(tabId, changeInfo, tab) {
    if (tab.status !== 'complete') {
        return;
    }
    const { url, title } = tab;
    for (const rule of rules) {
        if (url.match(rule.url) && title.match(rule.title)) {
            browser.tabs.remove(tabId);
        }
    }
}

update_rules();
browser.storage.onChanged.addListener(update_rules)
browser.tabs.onUpdated.addListener(tab_update_handler)