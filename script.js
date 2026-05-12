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
    OS.windows[id]?.remove();
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
    if (!bar) return;

    bar.innerHTML = "";

    Object.keys(OS.windows).forEach(id => {

        const btn = document.createElement("button");
        btn.className = "taskBtn";
        btn.innerText = "Window";

        btn.onclick = () => {
            OS.windows[id].style.display = "block";
            bringToFront(id);
        };

        bar.appendChild(btn);
    });
}

// =========================
// BROWSER (CLEAN CHROME ENGINE)
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

// =========================
// FIXED TAB ENGINE (STATE-DRIVEN)
// =========================

function setupBrowser(win) {

    const tabbar = win.querySelector(".tabbar");
    const viewport = win.querySelector(".viewport");
    const input = win.querySelector(".url");

    let tabs = [];
    let active = 0;

    function render() {

        tabbar.innerHTML = "";
        viewport.innerHTML = "";

        tabs.forEach((t, i) => {

            const tab = document.createElement("div");
            tab.className = "tab" + (i === active ? " active" : "");
            tab.innerText = "Tab " + (i + 1);

            tab.onclick = () => {
                active = i;
                render();
            };

            tabbar.appendChild(tab);

            t.frame.style.display = (i === active) ? "block" : "none";
            viewport.appendChild(t.frame);
        });
    }

    function addTab(url = "https://example.com") {

        if (!url.startsWith("http")) url = "https://" + url;

        const frame = document.createElement("iframe");
        frame.src = url;

        tabs.push({ frame });

        active = tabs.length - 1;
        render();
    }

    // NAVIGATE
    win.querySelector(".go").onclick = () => {
        let url = input.value;
        if (!url.startsWith("http")) url = "https://" + url;

        if (tabs[active]) {
            tabs[active].frame.src = url;
        }
    };

    // NEW TAB
    win.querySelector(".newTab").onclick = () => {
        addTab();
    };

    // SPLIT VIEW
    win.querySelector(".split").onclick = () => {

        if (tabs.length < 2) return;

        viewport.style.display = "flex";
        viewport.innerHTML = "";

        const a = tabs[active].frame;
        const b = tabs[(active + 1) % tabs.length].frame;

        a.style.width = "50%";
        b.style.width = "50%";

        viewport.appendChild(a);
        viewport.appendChild(b);
    };

    // INIT
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
}
