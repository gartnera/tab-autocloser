const browser = window.browser || window.chrome;

const container = document.querySelector('#rule-container')
const saved = document.querySelector('#saved');

function delete_row(ev) {
    const { target } = ev;
    const { parentElement } = target;
    parentElement.parentElement.removeChild(parentElement);

    if (container.children.length == 0) {
        new_row();
    }
}

function new_row(url = '', title = '') {
    const tr = document.createElement('tr');

    const th = document.createElement('th')
    th.className = "delete";
    th.innerText = "Delete";
    th.onclick = delete_row;
    tr.appendChild(th);

    let td = document.createElement('td');
    td.contentEditable = true;
    td.innerText = url;
    td.spellcheck = false;
    tr.appendChild(td);

    td = document.createElement('td');
    td.contentEditable = true;
    td.innerText = title;
    td.spellcheck = false;
    tr.appendChild(td);

    container.appendChild(tr);
}

function parse_rows() {
    const res = [];
    for (const row of container.children) {
        const [, url, title] = row.children;
        if (!url && !title) {
            continue;
        }
        res.push({
            'url': url.innerText,
            'title': title.innerText,
        });
    }
    return res;
}

function save() {
    const res = parse_rows();
    browser.storage.sync.set({
        "rules": res,
    });
    saved.style.display = "block";
    document.body.addEventListener('keydown', () => {
        saved.style.display = "none";
    }, {once: true})
}

function reset() {
    container.innerHTML = "";
    new_row();
}

function load() {
    browser.storage.sync.get("rules", (res) => {
        const { rules } = res;
        if (rules) {
            for (const rule of rules) {
                new_row(rule.url, rule.title);
            }
        }
        if (container.children.length == 0) {
            new_row();
        }
    });
}

load();

document.querySelector('#save').addEventListener('click', save);
document.querySelector('#new').addEventListener('click', () => new_row());
document.querySelector('#reset').addEventListener('click', reset);