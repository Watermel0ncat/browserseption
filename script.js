// =========================
// STATE
// =========================

let tabs = [];
let currentTab = 0;

let defaultBackground =
    localStorage.getItem("defaultBackground")
    || "white";

// =========================
// ELEMENTS
// =========================

const frame =
    document.getElementById("browserFrame");

const tabsDiv =
    document.getElementById("tabs");

const urlInput =
    document.getElementById("urlInput");

// =========================
// TABS
// =========================

function newTab(url = "https://example.com") {

    tabs.push(url);
    currentTab = tabs.length - 1;

    applyBackground();
    renderTabs();
    loadTab();
}

function closeTab(index) {

    if (tabs.length === 1) {
        tabs[0] = "https://example.com";
    } else {
        tabs.splice(index, 1);
        currentTab = Math.max(0, currentTab - 1);
    }

    renderTabs();
    loadTab();
}

function renderTabs() {

    tabsDiv.innerHTML = "";

    tabs.forEach((tab, index) => {

        const div = document.createElement("div");
        div.className = index === currentTab ? "tab active" : "tab";

        const title = document.createElement("span");
        title.innerText = "Tab " + (index + 1);

        title.onclick = () => {
            currentTab = index;
            renderTabs();
            loadTab();
        };

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "x";
        closeBtn.className = "closeBtn";

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeTab(index);
        };

        div.appendChild(title);
        div.appendChild(closeBtn);
        tabsDiv.appendChild(div);
    });
}

function loadTab() {
    frame.src = tabs[currentTab];
    urlInput.value = tabs[currentTab];
}

function goToUrl() {

    let url = urlInput.value.trim();

    if (!url.includes(".") && !url.startsWith("http")) {
        url = "https://www.google.com/search?q=" + encodeURIComponent(url);
    } else if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    tabs[currentTab] = url;
    loadTab();
}

// =========================
// BOOKMARKS
// =========================

function addBookmark() {

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks.push(tabs[currentTab]);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    loadBookmarks();
}

function loadBookmarks() {

    const list = document.getElementById("bookmarkList");
    list.innerHTML = "";

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.forEach(url => {

        const li = document.createElement("li");
        li.innerText = url;

        li.onclick = () => {
            tabs[currentTab] = url;
            loadTab();
        };

        list.appendChild(li);
    });
}

// =========================
// DOWNLOAD MANAGER
// =========================

function fakeDownload() {

    const files = [
        "cat.png",
        "brain.ai",
        "game.exe",
        "notes.txt",
        "quantum.zip"
    ];

    const file =
        files[Math.floor(Math.random() * files.length)];

    const list =
        document.getElementById("downloadList");

    const li = document.createElement("li");
    li.innerText = file + " downloaded";

    list.appendChild(li);
}

// =========================
// FAKE AI
// =========================

const aiWords = [
    "quantum","banana","neural","pickle","hyperdrive",
    "galaxy","robot","cheese","entropy","waffle"
];

function randomAI() {

    let text = "";
    for (let i = 0; i < 15; i++) {
        text += aiWords[Math.floor(Math.random()*aiWords.length)] + " ";
    }

    document.getElementById("aiOutput").innerText = text;
}

// =========================
// THEMES
// =========================

function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}

// =========================
// BACKGROUND
// =========================

function setBackground() {

    defaultBackground =
        document.getElementById("bgInput").value;

    localStorage.setItem("defaultBackground", defaultBackground);

    applyBackground();
}

function applyBackground() {

    document.body.style.background =
        defaultBackground.startsWith("http")
        ? `url(${defaultBackground}) center/cover no-repeat`
        : defaultBackground;
}

// =========================
// DRAG WINDOW
// =========================

const win = document.getElementById("browserWindow");
const bar = document.getElementById("topbar");

let dragging = false;
let ox, oy;

bar.addEventListener("mousedown", e => {
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
});

document.addEventListener("mousemove", e => {
    if (!dragging) return;
    win.style.left = (e.clientX - ox) + "px";
    win.style.top = (e.clientY - oy) + "px";
});

document.addEventListener("mouseup", () => dragging = false);

// =========================
// STARTUP
// =========================

setTheme(localStorage.getItem("theme") || "theme-blue");
applyBackground();

newTab();
loadBookmarks();
