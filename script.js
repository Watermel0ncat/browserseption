
// =========================
// OS CORE
// =========================

let OS = {
    z: 10,
    windows: {},
    drag: null
};

// =========================
// WINDOW SYSTEM
// =========================

function createWindow(title, contentHTML) {

    const id = "win_" + Date.now();

    const win = document.createElement("div");
    win.className = "window";
    win.id = id;

    win.style.left = "120px";
    win.style.top = "80px";
    win.style.width = "600px";
    win.style.height = "420px";
    win.style.zIndex = ++OS.z;

    win.innerHTML = `
        <div class="titlebar">
            <span>${title}</span>
            <button class="closeBtn">X</button>
        </div>

        <div class="content">${contentHTML}</div>

        <div class="resizer"></div>
    `;

    document.getElementById("desktop").appendChild(win);

    OS.windows[id] = win;

    // CLOSE BUTTON FIX
    win.querySelector(".closeBtn").addEventListener("click", () => {
        closeWindow(id);
    });

    bringToFront(id);
    makeDraggable(win);
    makeResizable(win);
    updateTaskbar();

    return win;
}

function bringToFront(id) {
    const w = OS.windows[id];
    if (!w) return;
    w.style.zIndex = ++OS.z;
}

function closeWindow(id) {
    OS.windows[id]?.remove();
    delete OS.windows[id];
    updateTaskbar();
}

// =========================
// DRAG
// =========================

function makeDraggable(win) {

    const bar = win.querySelector(".titlebar");

    bar.addEventListener("mousedown", (e) => {

        OS.drag = {
            el: win,
            x: e.clientX - win.offsetLeft,
            y: e.clientY - win.offsetTop
        };

        bringToFront(win.id);
    });
}

document.addEventListener("mousemove", (e) => {

    if (!OS.drag) return;

    OS.drag.el.style.left =
        (e.clientX - OS.drag.x) + "px";

    OS.drag.el.style.top =
        (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag = null;
});

// =========================
// RESIZE
// =========================

function makeResizable(win) {

    const r = win.querySelector(".resizer");

    let sx, sy, sw, sh;

    r.addEventListener("mousedown", (e) => {

        sx = e.clientX;
        sy = e.clientY;

        sw = parseInt(getComputedStyle(win).width, 10);
        sh = parseInt(getComputedStyle(win).height, 10);

        document.onmousemove = resize;
        document.onmouseup = stop;
    });

    function resize(e) {

        win.style.width =
            Math.max(250, sw + (e.clientX - sx)) + "px";

        win.style.height =
            Math.max(150, sh + (e.clientY - sy)) + "px";
    }

    function stop() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// =========================
// TASKBAR
// =========================

function updateTaskbar() {

    const bar = document.getElementById("taskApps");

    if (!bar) return;

    bar.innerHTML = "";

    Object.keys(OS.windows).forEach(id => {

        const btn = document.createElement("button");

        btn.className = "taskBtn";
        btn.innerText = "App";

        btn.addEventListener("click", () => {
            bringToFront(id);
        });

        bar.appendChild(btn);
    });
}

// =========================
// BROWSER
// =========================

function openBrowser() {

    const win = createWindow("Browser", `
        <div class="tabbar"></div>

        <div class="navbar">
            <input class="url" placeholder="https://example.com">
            <button class="go">Go</button>
            <button class="newTab">+ Tab</button>
            <button class="split">Split</button>
        </div>

        <div class="viewport"></div>
    `);

    setupBrowser(win);
}

function setupBrowser(win) {

    const tabbar = win.querySelector(".tabbar");
    const viewport = win.querySelector(".viewport");
    const input = win.querySelector(".url");

    const goBtn = win.querySelector(".go");
    const newTabBtn = win.querySelector(".newTab");
    const splitBtn = win.querySelector(".split");

    let tabs = [];
    let active = 0;

    function render() {

        tabbar.innerHTML = "";
        viewport.innerHTML = "";

        tabs.forEach((t, i) => {

            const tab = document.createElement("div");

            tab.className =
                "tab" + (i === active ? " active" : "");

            tab.innerText = "Tab " + (i + 1);

            tab.addEventListener("click", () => {
                active = i;
                render();
            });

            tabbar.appendChild(tab);

            t.frame.style.display =
                (i === active) ? "block" : "none";

            viewport.appendChild(t.frame);
        });
    }

    function addTab(url = "https://example.com") {

        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        const frame = document.createElement("iframe");

        frame.src = url;

        tabs.push({ frame });

        active = tabs.length - 1;

        render();
    }

    goBtn.addEventListener("click", () => {

        let url = input.value;

        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        if (tabs[active]) {
            tabs[active].frame.src = url;
        }
    });

    newTabBtn.addEventListener("click", () => {
        addTab();
    });

    splitBtn.addEventListener("click", () => {

        if (tabs.length < 2) return;

        viewport.innerHTML = "";

        viewport.style.display = "flex";

        const a = tabs[active].frame;
        const b = tabs[(active + 1) % tabs.length].frame;

        a.style.width = "50%";
        b.style.width = "50%";

        viewport.appendChild(a);
        viewport.appendChild(b);
    });

    addTab();
}

// =========================
// AI
// =========================

function openAI() {

    const win = createWindow("AI", `
        <input class="aiInput" placeholder="Ask...">
        <button class="askBtn">Ask</button>
        <div class="aiOut"></div>
    `);

    const input = win.querySelector(".aiInput");
    const out = win.querySelector(".aiOut");
    const btn = win.querySelector(".askBtn");

    btn.addEventListener("click", () => {

        const q = input.value.toLowerCase();

        let response =
            q.includes("hello")
                ? "Hello"
                : "AI: " + q.split(" ").reverse().join(" ");

        out.innerText = response;
    });
}

// =========================
// START BUTTONS
// =========================

window.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll("#taskbar > button");

    buttons[0].addEventListener("click", openBrowser);
    buttons[1].addEventListener("click", openAI);
});
