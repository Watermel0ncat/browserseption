// =========================
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
