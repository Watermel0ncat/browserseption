console.log("MiniOS script loaded");

// =========================
// CORE WINDOW SYSTEM
// =========================

let z = 1;

function createWindow(title, contentHTML) {

    const win = document.createElement("div");
    win.className = "window";

    win.style.left = "100px";
    win.style.top = "100px";
    win.style.zIndex = ++z;

    win.innerHTML = `
        <div style="display:flex;justify-content:space-between;cursor:move;">
            <span>${title}</span>
            <button onclick="this.parentElement.parentElement.remove()">X</button>
        </div>
        <div>${contentHTML}</div>
    `;

    // drag support
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    win.querySelector("div").onmousedown = (e) => {
        dragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    };

    document.onmousemove = (e) => {
        if (!dragging) return;
        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";
    };

    document.onmouseup = () => {
        dragging = false;
    };

    document.getElementById("windows").appendChild(win);
}

// =========================
// APPS
// =========================

function openBrowser() {

    createWindow("Browser", `
        <input id="url" placeholder="https://example.com">
        <button onclick="
            let u = document.getElementById('url').value;
            if (!u.startsWith('http')) u = 'https://' + u;
            window.open(u, '_blank');
        ">Go</button>
    `);
}

function openAI() {

    createWindow("AI", `
        <input id="aiInput" placeholder="Ask something">
        <button onclick="
            let q = document.getElementById('aiInput').value;
            document.getElementById('aiOut').innerText =
            'AI: ' + q.split(' ').reverse().join(' ');
        ">Ask</button>

        <div id="aiOut"></div>
    `);
}// =========================
// SAFE STATE
// =========================

window.OS = {
    z: 10,
    drag: { el:null, x:0, y:0 }
};

// =========================
// BOOT SAFE INIT (CRITICAL FIX)
// =========================

window.addEventListener("DOMContentLoaded", () => {
    console.log("MiniOS loaded");
});

// =========================
// WINDOW FACTORY (STABLE)
// =========================

function openApp(type) {

    const template = document.getElementById(type + "Template");
    if (!template) {
        console.error("Missing template:", type);
        return;
    }

    const win = template.cloneNode(true);
    win.classList.remove("hidden");

    const id = type + "_" + Date.now();
    win.id = id;

    win.style.left = "100px";
    win.style.top = "100px";

    document.getElementById("desktop").appendChild(win);

    bindWindow(win, type);

    bring(win);
    updateTaskbar();
}

// =========================
// BIND EVENTS (FIXED RELIABLY)
// =========================

function bindWindow(win, type) {

    const title = win.querySelector(".titlebar");
    title.onmousedown = (e) => dragStart(e, win.id);

    const close = win.querySelector(".close");
    const min = win.querySelector(".min");

    // CLOSE
    close.onclick = () => {
        win.remove();
        updateTaskbar();
    };

    // MINIMIZE
    min.onclick = () => {
        win.style.display = "none";
        updateTaskbar();
    };

    // ================= BROWSER =================
    if (type === "browser") {

        const go = win.querySelector(".go");
        const url = win.querySelector(".url");
        const frame = win.querySelector(".frame");

        go.onclick = () => {
            let u = url.value;
            if (!u.startsWith("http")) u = "https://" + u;
            frame.src = u;
        };
    }

    // ================= AI =================
    if (type === "ai") {

        const input = win.querySelector(".aiInput");
        const out = win.querySelector(".aiOutput");

        win.querySelector(".ask").onclick = () => {

            let q = input.value.toLowerCase();

            let response = "";

            if (q.includes("hello")) response = "Hello.";
            else if (q.includes("reverse")) response = q.split(" ").reverse().join(" ");
            else response = "AI: " + q;

            out.innerText = response;
        };
    }
}

// =========================
// DRAG SYSTEM (SAFE)
// =========================

function dragStart(e, id) {

    const el = document.getElementById(id);
    if (!el) return;

    OS.drag.el = el;
    OS.drag.x = e.clientX - el.offsetLeft;
    OS.drag.y = e.clientY - el.offsetTop;
}

document.addEventListener("mousemove", e => {

    if (!OS.drag.el) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag.el = null;
});

// =========================
// TASKBAR
// =========================

function updateTaskbar() {

    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    document.querySelectorAll(".window").forEach(w => {

        if (w.style.display === "none") return;

        const b = document.createElement("button");
        b.innerText = w.id;

        b.onclick = () => {
            w.style.display = "block";
            bring(w);
        };

        bar.appendChild(b);
    });
}

// =========================
// Z INDEX
// =========================

function bring(el) {
    el.style.zIndex = ++OS.z;
}// =========================
// GLOBAL STATE
// =========================

window.OS = {
    z: 10,
    drag: { el:null, x:0, y:0 },
    windows: {}
};

// =========================
// WINDOW FACTORY (FIXED PROPERLY)
// =========================

function openApp(type) {

    const template = document.getElementById(type + "Template");
    if (!template) return;

    const win = template.cloneNode(true);
    win.classList.remove("hidden");

    const id = type + "_" + Date.now();
    win.id = id;

    win.style.left = (100 + Math.random()*200) + "px";
    win.style.top = (100 + Math.random()*200) + "px";

    document.getElementById("desktop").appendChild(win);

    OS.windows[id] = {
        type,
        element: win
    };

    bindWindow(win, type, id);
    updateTaskbar();

    bring(win);
}

// =========================
// BIND EVENTS (CRITICAL FIX)
// =========================

function bindWindow(win, type, id) {

    const title = win.querySelector(".titlebar");
    title.onmousedown = (e) => dragStart(e, id);

    const close = win.querySelector(".close");
    const min = win.querySelector(".min");

    // CLOSE
    close.onclick = () => {
        win.remove();
        delete OS.windows[id];
        updateTaskbar();
    };

    // MINIMIZE
    min.onclick = () => {
        win.style.display = "none";
        updateTaskbar();
    };

    // ================= BROWSER =================
    if (type === "browser") {

        const go = win.querySelector(".go");
        const url = win.querySelector(".url");
        const frame = win.querySelector(".frame");

        go.onclick = () => {
            let u = url.value;
            if (!u.startsWith("http")) u = "https://" + u;
            frame.src = u;
        };
    }

    // ================= AI =================
    if (type === "ai") {

        const input = win.querySelector(".aiInput");
        const out = win.querySelector(".aiOutput");

        win.querySelector(".ask").onclick = () => {

            let q = input.value.toLowerCase();

            // Try reading browser context safely
            let pageText = "";

            for (let k in OS.windows) {
                let w = OS.windows[k].element;
                let frame = w.querySelector?.("iframe");

                try {
                    if (frame?.contentDocument) {
                        pageText = frame.contentDocument.body.innerText;
                        break;
                    }
                } catch {}
            }

            let response = "";

            if (q.includes("page")) {
                response = pageText
                    ? pageText.slice(0,300)
                    : "No readable page content.";
            }

            else if (q.includes("hello")) {
                response = "Hello, I am MiniOS AI.";
            }

            else if (q.includes("windows")) {
                response = "Open windows: " + Object.keys(OS.windows).length;
            }

            else {
                response = "AI: " + q.split(" ").reverse().join(" ");
            }

            out.innerText = response;
        };
    }
}

// =========================
// DRAG SYSTEM (FIXED)
// =========================

function dragStart(e, id) {
    const el = document.getElementById(id);
    if (!el) return;

    OS.drag.el = el;
    OS.drag.x = e.clientX - el.offsetLeft;
    OS.drag.y = e.clientY - el.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!OS.drag.el) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag.el = null;
});

// =========================
// TASKBAR (NOW WORKS)
// =========================

function updateTaskbar() {

    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    for (let id in OS.windows) {

        const w = OS.windows[id].element;

        const btn = document.createElement("button");
        btn.innerText = id;

        btn.onclick = () => {
            w.style.display = "block";
            bring(w);
        };

        bar.appendChild(btn);
    }
}

// =========================
// Z INDEX
// =========================

function bring(el) {
    el.style.zIndex = ++OS.z;
}
// =========================
// GLOBAL STATE (SAFE)
// =========================

window.OS = {
    fs: JSON.parse(localStorage.getItem("fs") || "[]"),
    aiMemory: JSON.parse(localStorage.getItem("aiMemory") || "[]"),
    z: 10,
    drag: { el: null, x:0, y:0 }
};

// =========================
// WINDOW FACTORY (MULTI-INSTANCE)
// =========================

function openApp(type) {

    const template = document.getElementById(type + "Template");
    if (!template) return;

    const win = template.cloneNode(true);
    win.id = type + "_" + Date.now();
    win.classList.remove("hidden");

    win.style.left = (100 + Math.random()*200) + "px";
    win.style.top = (100 + Math.random()*200) + "px";

    document.getElementById("desktop").appendChild(win);

    bring(win);
    attach(win, type);
    updateTaskbar();
}

// =========================
// ATTACH LOGIC PER WINDOW
// =========================

function attach(win, type) {

    const title = win.querySelector(".titlebar");
    title.onmousedown = (e) => dragStart(e, win.id);

    // CLOSE
    win.querySelector(".close").onclick = () => {
        win.remove();
        updateTaskbar();
    };

    // MINIMIZE (browser only visually hides)
    const min = win.querySelector(".min");
    if (min) {
        min.onclick = () => {
            win.style.display = "none";
            updateTaskbar();
        };
    }

    // ================= BROWSER =================
    if (type === "browser") {
        const go = win.querySelector(".go");
        const url = win.querySelector(".url");
        const frame = win.querySelector(".frame");

        go.onclick = () => {
            let u = url.value;
            if (!u.startsWith("http")) u = "https://" + u;
            frame.src = u;
        };
    }

    // ================= FILES =================
    if (type === "files") {
        const list = win.querySelector(".fileList");

        win.querySelector(".newFile").onclick = () => {
            let name = prompt("File name");
            OS.fs.push({ type:"file", name, content:"" });
            saveFS(); renderFS(list);
        };

        win.querySelector(".newFolder").onclick = () => {
            let name = prompt("Folder name");
            OS.fs.push({ type:"folder", name });
            saveFS(); renderFS(list);
        };

        renderFS(list);
    }

    // ================= NOTES =================
    if (type === "notes") {
        const area = win.querySelector(".note");

        win.querySelector(".save").onclick = () => {
            OS.fs.push({ type:"note", content: area.value });
            saveFS();
        };
    }

    // ================= AI =================
    if (type === "ai") {

        const input = win.querySelector(".aiInput");
        const out = win.querySelector(".aiOutput");

        win.querySelector(".ask").onclick = () => {

            const browserFrame = document.querySelector("iframe.frame");

            let pageText = "";

            try {
                pageText = browserFrame?.contentDocument?.body?.innerText || "";
            } catch {}

            let q = input.value.toLowerCase();

            let response = "";

            if (q.includes("page")) {
                response = pageText
                    ? pageText.slice(0,300)
                    : "Cannot access page (cross-origin).";
            }

            else if (q.includes("hello")) {
                response = "Hello.";
            }

            else {
                response = "AI: " + q.split(" ").reverse().join(" ");
            }

            out.innerText = response;
        };
    }
}

// =========================
// DRAG SYSTEM (NO LET BUGS)
// =========================

function dragStart(e, id) {
    const el = document.getElementById(id);
    if (!el) return;

    OS.drag.el = el;
    OS.drag.x = e.clientX - el.offsetLeft;
    OS.drag.y = e.clientY - el.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!OS.drag.el) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag.el = null;
});

// =========================
// TASKBAR
// =========================

function updateTaskbar() {
    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    document.querySelectorAll(".window").forEach(w => {

        const b = document.createElement("button");
        b.innerText = w.id;

        b.onclick = () => {
            w.style.display = "block";
            bring(w);
        };

        bar.appendChild(b);
    });
}

// =========================
// FILE SYSTEM
// =========================

function renderFS(list) {
    list.innerHTML = "";

    OS.fs.forEach((f,i) => {
        const d = document.createElement("div");
        d.innerText = f.type + ": " + (f.name || "untitled");
        list.appendChild(d);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(OS.fs));
}

// =========================
// WALLPAPER
// =========================

function setWallpaper() {
    const file = document.getElementById("wallpaperFile").files[0];
    const val = document.getElementById("wallpaperInput").value;

    if (file) {
        const r = new FileReader();
        r.onload = e => applyWallpaper(e.target.result);
        r.readAsDataURL(file);
        return;
    }

    applyWallpaper(val);
}

function applyWallpaper(val) {
    const d = document.getElementById("desktop");
    if (!val) return;

    if (val.startsWith("http") || val.startsWith("data:")) {
        d.style.background = `url(${val}) center/cover`;
    } else {
        d.style.background = val;
    }
}

// =========================
// Z-INDEX
// =========================

function bring(el) {
    el.style.zIndex = ++OS.z;
}// =========================
// GLOBAL OS STATE
// =========================

window.OS = {
    fs: JSON.parse(localStorage.getItem("fs") || "[]"),
    aiMemory: JSON.parse(localStorage.getItem("aiMemory") || "[]"),
    currentFile: null,
    drag: { el: null, x: 0, y: 0 },
    z: 10
};

// =========================
// WINDOW SYSTEM
// =========================

function openApp(id) {
    const w = document.getElementById(id + "Window");
    if (!w) return;
    w.classList.remove("hidden");
    bring(w);
}

function closeWindow(id) {
    const w = document.getElementById(id);
    if (w) w.classList.add("hidden");
}

function minimize(id) {
    const w = document.getElementById(id);
    if (w) w.classList.add("hidden");
}

function bring(el) {
    el.style.zIndex = ++OS.z;
}

// =========================
// DRAG SYSTEM (SAFE)
// =========================

function dragStart(e, id) {
    OS.drag.el = document.getElementById(id);
    if (!OS.drag.el) return;

    OS.drag.x = e.clientX - OS.drag.el.offsetLeft;
    OS.drag.y = e.clientY - OS.drag.el.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!OS.drag.el) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag.el = null;
});

// =========================
// BROWSER
// =========================

function go() {
    let url = document.getElementById("url").value;
    if (!url) return;

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const frame = document.getElementById("frame");

    try {
        frame.src = url;
    } catch (e) {
        window.open(url, "_blank");
    }
}

// =========================
// FILE SYSTEM
// =========================

function createFile() {
    let name = prompt("File name");
    if (!name) return;

    OS.fs.push({ type:"file", name, content:"" });
    saveFS();
    renderFS();
}

function createFolder() {
    let name = prompt("Folder name");
    if (!name) return;

    OS.fs.push({ type:"folder", name, children:[] });
    saveFS();
    renderFS();
}

function renderFS() {
    const list = document.getElementById("fileList");
    if (!list) return;

    list.innerHTML = "";

    OS.fs.forEach((f,i) => {
        let d = document.createElement("div");
        d.innerText = f.type === "folder" ? "📁 " + f.name : "📄 " + f.name;

        d.onclick = () => {
            if (f.type === "file") {
                OS.currentFile = i;
                document.getElementById("noteArea").value = f.content;
            }
        };

        list.appendChild(d);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(OS.fs));
}

// =========================
// NOTES
// =========================

function saveNote() {
    if (OS.currentFile === null) return;

    OS.fs[OS.currentFile].content =
        document.getElementById("noteArea").value;

    saveFS();
    renderFS();
}

// =========================
// AI
// =========================

function askAI() {
    const input = document.getElementById("aiInput");
    const out = document.getElementById("aiOutput");

    let q = input.value.toLowerCase();

    OS.aiMemory.push(q);
    if (OS.aiMemory.length > 15) OS.aiMemory.shift();

    localStorage.setItem("aiMemory", JSON.stringify(OS.aiMemory));

    let response;

    if (q.includes("hello")) response = "Hello.";
    else if (q.includes("memory")) response = OS.aiMemory.slice(-5).join(" | ");
    else response = "Processed: " + q.split(" ").reverse().join(" ");

    out.innerText = response;
}

// =========================
// WALLPAPER
// =========================

function setWallpaper() {
    const file = document.getElementById("wallpaperFile").files[0];
    const val = document.getElementById("wallpaperInput").value;

    if (file) {
        const reader = new FileReader();
        reader.onload = e => applyWallpaper(e.target.result);
        reader.readAsDataURL(file);
        return;
    }

    applyWallpaper(val);
}

function applyWallpaper(val) {
    const d = document.getElementById("desktop");
    if (!val || !d) return;

    if (val.startsWith("http") || val.startsWith("data:")) {
        d.style.background = `url(${val}) center/cover`;
    } else {
        d.style.background = val;
    }

    localStorage.setItem("wallpaper", val);
}

// =========================
// INIT
// =========================

window.onload = () => {
    renderFS();

    const saved = localStorage.getItem("wallpaper");
    if (saved) applyWallpaper(saved);
};// =========================
// SAFE GLOBAL OS STATE
// =========================

window.OS = {
    fs: JSON.parse(localStorage.getItem("fs") || "[]"),
    aiMemory: JSON.parse(localStorage.getItem("aiMemory") || "[]"),
    currentFile: null,
    drag: { el: null, x: 0, y: 0 },
    z: 10
};

// =========================
// WINDOW SYSTEM
// =========================

function openApp(id) {
    const w = document.getElementById(id + "Window");
    if (!w) return;

    w.classList.remove("hidden");
    bring(w);
    updateTaskbar();
}

function closeWindow(id) {
    const w = document.getElementById(id);
    if (w) w.classList.add("hidden");
    updateTaskbar();
}

function minimize(id) {
    const w = document.getElementById(id);
    if (w) w.classList.add("hidden");
    updateTaskbar();
}

function bring(el) {
    el.style.zIndex = ++OS.z;
}

// =========================
// DRAG SYSTEM (FIXED — NO let VARIABLES)
// =========================

function dragStart(e, id) {
    OS.drag.el = document.getElementById(id);
    if (!OS.drag.el) return;

    OS.drag.x = e.clientX - OS.drag.el.offsetLeft;
    OS.drag.y = e.clientY - OS.drag.el.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!OS.drag.el) return;

    OS.drag.el.style.left = (e.clientX - OS.drag.x) + "px";
    OS.drag.el.style.top = (e.clientY - OS.drag.y) + "px";
});

document.addEventListener("mouseup", () => {
    OS.drag.el = null;
});

// =========================
// TASKBAR SYSTEM
// =========================

function updateTaskbar() {
    const bar = document.getElementById("taskApps");
    if (!bar) return;

    bar.innerHTML = "";

    ["browser","files","notes","ai"].forEach(app => {
        const w = document.getElementById(app + "Window");
        if (!w || w.classList.contains("hidden")) return;

        const btn = document.createElement("button");
        btn.innerText = app;

        btn.onclick = () => openApp(app);

        bar.appendChild(btn);
    });
}

// =========================
// FILE SYSTEM
// =========================

function createFile() {
    let name = prompt("File name:");
    if (!name) return;

    OS.fs.push({
        type: "file",
        name,
        content: ""
    });

    saveFS();
    renderFS();
}

function createFolder() {
    let name = prompt("Folder name:");
    if (!name) return;

    OS.fs.push({
        type: "folder",
        name,
        children: []
    });

    saveFS();
    renderFS();
}

function renderFS() {
    const list = document.getElementById("fileList");
    if (!list) return;

    list.innerHTML = "";

    OS.fs.forEach((f, i) => {
        const d = document.createElement("div");

        d.innerText = f.type === "folder"
            ? "📁 " + f.name
            : "📄 " + f.name;

        d.onclick = () => {
            if (f.type === "file") {
                OS.currentFile = i;
                document.getElementById("noteArea").value = f.content;
            }
        };

        list.appendChild(d);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(OS.fs));
}

// =========================
// NOTES APP
// =========================

function saveNote() {
    if (OS.currentFile === null) return;

    OS.fs[OS.currentFile].content =
        document.getElementById("noteArea").value;

    saveFS();
    renderFS();
}

// =========================
// AI SYSTEM (MEMORY)
// =========================

function askAI() {
    const input = document.getElementById("aiInput");
    if (!input) return;

    let q = input.value;

    OS.aiMemory.push(q);

    if (OS.aiMemory.length > 10) {
        OS.aiMemory.shift();
    }

    localStorage.setItem("aiMemory", JSON.stringify(OS.aiMemory));

    const out = document.getElementById("aiOutput");

    if (!out) return;

    out.innerText =
        "Memory log: " + OS.aiMemory.slice(-5).join(" | ");
}

// =========================
// WALLPAPER SYSTEM
// =========================

function setWallpaper() {
    const file = document.getElementById("wallpaperFile").files[0];
    const val = document.getElementById("wallpaperInput").value;

    if (file) {
        const reader = new FileReader();
        reader.onload = e => applyWallpaper(e.target.result);
        reader.readAsDataURL(file);
        return;
    }

    applyWallpaper(val);
}

function applyWallpaper(val) {
    if (!val) return;

    const desktop = document.getElementById("desktop");
    if (!desktop) return;

    if (val.startsWith("http") || val.startsWith("data:")) {
        desktop.style.background = `url(${val}) center/cover`;
    } else {
        desktop.style.background = val;
    }

    localStorage.setItem("wallpaper", val);
}

// =========================
// INIT (NO BOOT SYSTEM)
// =========================

window.onload = () => {
    renderFS();
    updateTaskbar();

    const saved = localStorage.getItem("wallpaper");
    if (saved) applyWallpaper(saved);
};
