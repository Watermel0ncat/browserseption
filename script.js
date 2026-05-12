// =========================
// GLOBAL OS STATE
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
    win.style.zIndex = ++OS.z;

    win.innerHTML = `
        <div class="titlebar">
            <span>${title}</span>
            <button onclick="closeWindow('${id}')">X</button>
        </div>
        <div class="content">${contentHTML}</div>
    `;

    document.getElementById("desktop").appendChild(win);

    OS.windows[id] = win;

    bringToFront(id);
    makeDraggable(win);
    updateTaskbar();

    return win;
}

function bringToFront(id) {
    const w = OS.windows[id];
    if (!w) return;
    w.style.zIndex = ++OS.z;
}

function closeWindow(id) {
    OS.windows[id].remove();
    delete OS.windows[id];
    updateTaskbar();
}

// =========================
// DRAG SYSTEM
// =========================

function makeDraggable(win) {

    const bar = win.querySelector(".titlebar");

    bar.onmousedown = (e) => {
        OS.drag = {
            el: win,
            x: e.clientX - win.offsetLeft,
            y: e.clientY - win.offsetTop
        };
        bringToFront(win.id);
    };
}

document.addEventListener("mousemove", (e) => {
    if (!OS.drag) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag = null;
});

// =========================
// TASKBAR
// =========================

function updateTaskbar() {

    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    Object.keys(OS.windows).forEach(id => {

        const btn = document.createElement("button");
        btn.className = "taskBtn";
        btn.innerText = id;

        btn.onclick = () => {
            OS.windows[id].style.display = "block";
            bringToFront(id);
        };

        bar.appendChild(btn);
    });
}

// =========================
// BROWSER (CHROME-LEVEL)
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

    let tabs = [];
    let active = 0;

    function addTab(url = "https://example.com") {

        const i = tabs.length;

        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerText = "Tab " + (i + 1);

        const frame = document.createElement("iframe");
        frame.src = url;

        tabs.push({ tab, frame });

        tabbar.appendChild(tab);
        viewport.appendChild(frame);

        switchTab(i);

        tab.onclick = () => switchTab(i);
    }

    function switchTab(i) {

        active = i;

        tabs.forEach((t, idx) => {
            t.frame.style.display = idx === i ? "block" : "none";
            t.tab.classList.toggle("active", idx === i);
        });
    }

    win.querySelector(".go").onclick = () => {
        let url = input.value;
        if (!url.startsWith("http")) url = "https://" + url;
        tabs[active].frame.src = url;
    };

    win.querySelector(".newTab").onclick = () => addTab();

    win.querySelector(".split").onclick = () => {

        if (tabs.length < 2) return;

        viewport.classList.add("split");
        viewport.innerHTML = "";

        viewport.appendChild(tabs[active].frame);
        viewport.appendChild(tabs[(active + 1) % tabs.length].frame);

        tabs[active].frame.style.display = "block";
        tabs[(active + 1) % tabs.length].frame.style.display = "block";
    };

    addTab();
}

// =========================
// AI APP
// =========================

function openAI() {

    createWindow("AI", `
        <input id="aiInput" placeholder="Ask...">
        <button onclick="
            let q = document.getElementById('aiInput').value;

            document.getElementById('aiOut').innerText =
            q.includes('hello') ? 'Hello' :
            'AI: ' + q.split(' ').reverse().join(' ');
        ">Ask</button>

        <div id="aiOut"></div>
    `);
}// =========================
// CORE OS STATE
// =========================

let OS = {
    z: 10,
    windows: {},
    activeWindow: null,
    drag: null
};

// =========================
// WINDOW SYSTEM
// =========================

function createWindow(title, innerHTML) {

    const id = "win_" + Date.now();

    const win = document.createElement("div");
    win.className = "window";
    win.id = id;

    win.style.left = "100px";
    win.style.top = "100px";
    win.style.zIndex = ++OS.z;

    win.innerHTML = `
        <div class="titlebar">
            <span>${title}</span>
            <button onclick="closeWindow('${id}')">X</button>
        </div>
        <div class="content">${innerHTML}</div>
    `;

    document.getElementById("desktop").appendChild(win);

    OS.windows[id] = win;

    bringToFront(id);
    makeDraggable(win);

    updateTaskbar();

    return win;
}

// =========================
// DRAG SYSTEM
// =========================

function makeDraggable(win) {

    const bar = win.querySelector(".titlebar");

    bar.onmousedown = (e) => {
        OS.drag = {
            el: win,
            x: e.clientX - win.offsetLeft,
            y: e.clientY - win.offsetTop
        };
        bringToFront(win.id);
    };
}

document.addEventListener("mousemove", (e) => {
    if (!OS.drag) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag = null;
});

// =========================
// TASKBAR
// =========================

function updateTaskbar() {

    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    Object.keys(OS.windows).forEach(id => {

        const btn = document.createElement("button");
        btn.className = "taskBtn";
        btn.innerText = id;

        btn.onclick = () => {
            const w = OS.windows[id];
            w.style.display = "block";
            bringToFront(id);
        };

        bar.appendChild(btn);
    });
}

function bringToFront(id) {
    const win = OS.windows[id];
    if (!win) return;
    win.style.zIndex = ++OS.z;
    OS.activeWindow = id;
}

// =========================
// CLOSE
// =========================

function closeWindow(id) {
    OS.windows[id].remove();
    delete OS.windows[id];
    updateTaskbar();
}

// =========================
// BROWSER (FULL TAB SYSTEM)
// =========================

function openBrowser() {

    const win = createWindow("Browser", `
        <div class="tabbar"></div>
        <input class="url" placeholder="https://example.com">
        <button class="go">Go</button>
        <button class="newTab">+ Tab</button>
        <div class="content"></div>
    `);

    setupBrowser(win);
}

function setupBrowser(win) {

    const tabbar = win.querySelector(".tabbar");
    const content = win.querySelector(".content");
    const input = win.querySelector(".url");

    let tabs = [];
    let active = 0;

    function addTab(url = "https://example.com") {

        const tabIndex = tabs.length;

        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerText = "Tab " + (tabIndex + 1);

        const frame = document.createElement("iframe");
        frame.src = url;

        tabs.push({ tab, frame });

        tabbar.appendChild(tab);
        content.appendChild(frame);

        switchTab(tabIndex);

        tab.onclick = () => switchTab(tabIndex);
    }

    function switchTab(i) {

        tabs.forEach((t, idx) => {
            t.frame.style.display = idx === i ? "block" : "none";
            t.tab.classList.toggle("active", idx === i);
        });

        active = i;
    }

    win.querySelector(".go").onclick = () => {
        let url = input.value;
        if (!url.startsWith("http")) url = "https://" + url;
        tabs[active].frame.src = url;
    };

    win.querySelector(".newTab").onclick = () => addTab();

    addTab();
}

// =========================
// AI APP
// =========================

function openAI() {

    const win = createWindow("AI", `
        <input class="aiInput" placeholder="Ask...">
        <button class="ask">Ask</button>
        <div class="out"></div>
    `);

    const input = win.querySelector(".aiInput");
    const out = win.querySelector(".out");

    win.querySelector(".ask").onclick = () => {

        let q = input.value.toLowerCase();

        let response =
            q.includes("hello") ? "Hello" :
            q.includes("windows") ? "MiniOS running" :
            "AI: " + q.split(" ").reverse().join(" ");

        out.innerText = response;
    };
}
