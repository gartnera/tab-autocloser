const browser = window.browser || window.chrome;

let rules = [];

function update_rules() {
    browser.storage.sync.get("rules", (res) => {
        if (!res.rules) {
            return;
        }
        const newRules = [];
        for (const rule of res.rules) {
            const r = {};
            if (rule.url) {
                r.url = new RegExp(rule.url);
            }
            if (rule.title) {
                r.title = new RegExp(rule.title);
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
        const urlMatch = (!rule.url || url.match(rule.url));
        const titleMatch = (!rule.title || url.match(rule.title))
        if (urlMatch && titleMatch) {
            browser.tabs.remove(tabId);
        }
    }
}

update_rules();
browser.storage.onChanged.addListener(update_rules)
browser.tabs.onUpdated.addListener(tab_update_handler)