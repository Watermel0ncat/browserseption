// =========================
// GLOBAL OS STATE (NO REDECLARATION BUGS)
// =========================

window.OS = {
    fs: JSON.parse(localStorage.getItem("fs") || "[]"),
    aiMemory: JSON.parse(localStorage.getItem("aiMemory") || "[]"),
    currentFile: null,
    z: 10
};

// =========================
// BOOT SYSTEM (SAFE)
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const boot = document.getElementById("boot");
    const text = document.getElementById("bootText");

    const steps = [
        "Loading kernel...",
        "Mounting filesystem...",
        "Starting UI...",
        "Launching desktop..."
    ];

    let i = 0;

    let t = setInterval(() => {

        text.innerText = steps[i++] || "Starting...";

        if (i >= steps.length) {
            clearInterval(t);

            setTimeout(() => {
                boot.style.display = "none";
            }, 400);
        }

    }, 400);

    // FAILSAFE
    setTimeout(() => {
        boot.style.display = "none";
    }, 5000);
});

// =========================
// WINDOW SYSTEM
// =========================

let dragTarget = null;
let ox = 0, oy = 0;

function openApp(id) {
    const w = document.getElementById(id + "Window");
    if (!w) return;

    w.classList.remove("hidden");
    bring(w);
    updateTaskbar();
}

function closeWindow(id) {
    const w = document.getElementById(id);
    if (!w) return;

    w.classList.add("hidden");
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
// DRAG
// =========================

function drag(e, id) {
    dragTarget = document.getElementById(id);
    ox = e.clientX - dragTarget.offsetLeft;
    oy = e.clientY - dragTarget.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!dragTarget) return;
    dragTarget.style.left = (e.clientX - ox) + "px";
    dragTarget.style.top = (e.clientY - oy) + "px";
});

document.addEventListener("mouseup", () => dragTarget = null);

// =========================
// TASKBAR
// =========================

function updateTaskbar() {
    const bar = document.getElementById("taskApps");
    bar.innerHTML = "";

    ["browser","files","notes","ai"].forEach(a => {
        const w = document.getElementById(a + "Window");
        if (!w || w.classList.contains("hidden")) return;

        let b = document.createElement("button");
        b.innerText = a;
        b.onclick = () => openApp(a);
        bar.appendChild(b);
    });
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
// AI (MEMORY)
// =========================

function askAI() {
    let q = document.getElementById("aiInput").value;

    OS.aiMemory.push(q);
    if (OS.aiMemory.length > 10) OS.aiMemory.shift();

    localStorage.setItem("aiMemory", JSON.stringify(OS.aiMemory));

    let r = "Memory: " + (OS.aiMemory.slice(-3).join(" | "));

    document.getElementById("aiOutput").innerText = r;
}

// =========================
// TASKBAR INIT
// =========================

window.onload = () => {
    renderFS();
    updateTaskbar();
};let fs = JSON.parse(localStorage.getItem("fs") || "[]");
let aiMemory = JSON.parse(localStorage.getItem("aiMemory") || "[]");

let currentFile = null;
let z = 10;

let dragTarget = null;
let ox = 0;
let oy = 0;

/* =========================
   BOOT (FIXED — GUARANTEED EXIT)
========================= */

document.addEventListener("DOMContentLoaded", () => {
    startBoot();
});

function startBoot() {

    const boot = document.getElementById("boot");
    const text = document.getElementById("bootText");

    const steps = [
        "Initializing kernel...",
        "Mounting filesystem...",
        "Starting window manager...",
        "Launching desktop..."
    ];

    let i = 0;

    const interval = setInterval(() => {

        text.innerText = steps[i];
        i++;

        if (i >= steps.length) {

            clearInterval(interval);

            setTimeout(() => {
                boot.style.display = "none";
                document.getElementById("desktop").style.display = "block";
            }, 400);
        }

    }, 500);
}

/* =========================
   WINDOW SYSTEM
========================= */

function openApp(id) {
    const w = document.getElementById(id + "Window");
    if (!w) return;

    w.classList.remove("hidden");
    bring(w);
    updateTaskbar();
}

function closeWindow(id) {
    const w = document.getElementById(id);
    if (!w) return;

    w.classList.add("hidden");
    updateTaskbar();
}

function minimize(id) {
    const w = document.getElementById(id);
    if (!w) return;

    w.classList.add("hidden");
    updateTaskbar();
}

function bring(el) {
    el.style.zIndex = ++z;
}

/* =========================
   DRAG
========================= */

function drag(e, id) {
    dragTarget = document.getElementById(id);
    if (!dragTarget) return;

    ox = e.clientX - dragTarget.offsetLeft;
    oy = e.clientY - dragTarget.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!dragTarget) return;

    dragTarget.style.left = (e.clientX - ox) + "px";
    dragTarget.style.top = (e.clientY - oy) + "px";
});

document.addEventListener("mouseup", () => dragTarget = null);

/* =========================
   TASKBAR
========================= */

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

/* =========================
   BROWSER
========================= */

function go() {
    let u = document.getElementById("url").value;
    if (!u) return;

    if (!u.startsWith("http")) u = "https://" + u;

    document.getElementById("frame").src = u;
}

/* =========================
   FILE SYSTEM
========================= */

function createFile() {
    let name = prompt("File name");
    if (!name) return;

    fs.push({ type: "file", name, content: "" });
    saveFS();
    renderFS();
}

function createFolder() {
    let name = prompt("Folder name");
    if (!name) return;

    fs.push({ type: "folder", name, children: [] });
    saveFS();
    renderFS();
}

function renderFS() {
    const list = document.getElementById("fileList");
    if (!list) return;

    list.innerHTML = "";

    fs.forEach((f,i) => {
        let d = document.createElement("div");

        d.innerText = f.type === "folder"
            ? "📁 " + f.name
            : "📄 " + f.name;

        d.onclick = () => {
            if (f.type === "file") {
                currentFile = i;
                document.getElementById("noteArea").value = f.content;
            }
        };

        list.appendChild(d);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(fs));
}

/* =========================
   NOTES
========================= */

function saveNote() {
    if (currentFile === null) return;

    fs[currentFile].content =
        document.getElementById("noteArea").value;

    saveFS();
    renderFS();
}

/* =========================
   AI MEMORY
========================= */

function askAI() {

    let q = document.getElementById("aiInput").value;

    aiMemory.push(q);
    if (aiMemory.length > 10) aiMemory.shift();

    localStorage.setItem("aiMemory", JSON.stringify(aiMemory));

    let r = "Processing...";

    if (q.includes("remember")) {
        r = aiMemory.slice(-5).join(" | ");
    } else {
        r = "Response: " + (aiMemory[aiMemory.length-2] || "none");
    }

    document.getElementById("aiOutput").innerText = r;
}

/* =========================
   WALLPAPER
========================= */

function setWallpaper() {

    let file = document.getElementById("wallpaperFile").files[0];
    let val = document.getElementById("wallpaperInput").value;

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

    const d = document.getElementById("desktop");

    if (val.startsWith("http") || val.startsWith("data:")) {
        d.style.background = `url(${val}) center/cover`;
    } else {
        d.style.background = val;
    }

    localStorage.setItem("wallpaper", val);
}

/* =========================
   RIGHT CLICK MENU
========================= */

document.addEventListener("contextmenu", e => {
    e.preventDefault();

    const m = document.getElementById("contextMenu");
    m.style.left = e.pageX + "px";
    m.style.top = e.pageY + "px";
    m.classList.remove("hidden");
});

document.addEventListener("click", () => {
    document.getElementById("contextMenu").classList.add("hidden");
});

/* =========================
   INIT
========================= */

window.onload = () => {

    renderFS();
    updateTaskbar();

    const w = localStorage.getItem("wallpaper");
    if (w) applyWallpaper(w);
};// =========================
// STATE
// =========================

let fs = JSON.parse(localStorage.getItem("fs") || "[]");
let aiMemory = JSON.parse(localStorage.getItem("aiMemory") || "[]");

let currentFile = null;
let z = 10;

let dragTarget = null;
let ox = 0;
let oy = 0;

// =========================
// BOOT (FIXED)
// =========================

function boot() {

    setTimeout(() => {
        document.getElementById("bootText").innerText = "Loading filesystem...";
    }, 600);

    setTimeout(() => {
        document.getElementById("bootText").innerText = "Starting desktop...";
    }, 1200);

    setTimeout(() => {
        document.getElementById("boot").style.display = "none";
    }, 2000);
}

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
    if (!w) return;

    w.classList.add("hidden");
    updateTaskbar();
}

function minimize(id) {
    const w = document.getElementById(id);
    if (!w) return;

    w.classList.add("hidden");
    updateTaskbar();
}

function bring(el) {
    el.style.zIndex = ++z;
}

// =========================
// DRAG
// =========================

function drag(e, id) {
    dragTarget = document.getElementById(id);
    if (!dragTarget) return;

    ox = e.clientX - dragTarget.offsetLeft;
    oy = e.clientY - dragTarget.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!dragTarget) return;
    dragTarget.style.left = (e.clientX - ox) + "px";
    dragTarget.style.top = (e.clientY - oy) + "px";
});

document.addEventListener("mouseup", () => dragTarget = null);

// =========================
// TASKBAR
// =========================

function updateTaskbar() {
    const bar = document.getElementById("taskApps");
    if (!bar) return;

    bar.innerHTML = "";

    ["browser","files","notes","ai"].forEach(app => {
        const w = document.getElementById(app + "Window");
        if (!w || w.classList.contains("hidden")) return;

        let b = document.createElement("button");
        b.innerText = app;
        b.onclick = () => openApp(app);

        bar.appendChild(b);
    });
}

// =========================
// BROWSER
// =========================

function go() {
    let u = document.getElementById("url").value;
    if (!u) return;

    if (!u.startsWith("http")) u = "https://" + u;

    document.getElementById("frame").src = u;
}

// =========================
// FILE SYSTEM (NESTED BASIC)
// =========================

function createFolder() {
    let name = prompt("Folder name");
    if (!name) return;

    fs.push({ type: "folder", name, children: [] });
    saveFS();
    renderFS();
}

function createFile() {
    let name = prompt("File name");
    if (!name) return;

    fs.push({ type: "file", name, content: "" });
    saveFS();
    renderFS();
}

function renderFS() {
    const list = document.getElementById("fileList");
    if (!list) return;

    list.innerHTML = "";

    fs.forEach((f,i) => {
        let d = document.createElement("div");
        d.innerText = f.type === "folder" ? "📁 " + f.name : "📄 " + f.name;

        d.onclick = () => {
            if (f.type === "file") {
                currentFile = i;
                document.getElementById("noteArea").value = f.content;
            }
        };

        list.appendChild(d);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(fs));
}

// =========================
// NOTES
// =========================

function saveNote() {
    if (currentFile === null) return;

    fs[currentFile].content =
        document.getElementById("noteArea").value;

    saveFS();
    renderFS();
}

// =========================
// AI (WITH MEMORY)
// =========================

function askAI() {

    let q = document.getElementById("aiInput").value;
    aiMemory.push(q);

    if (aiMemory.length > 10) aiMemory.shift();

    localStorage.setItem("aiMemory", JSON.stringify(aiMemory));

    let r;

    if (q.includes("remember")) {
        r = "Memory: " + aiMemory.slice(-5).join(" | ");
    }
    else if (q.includes("hello")) {
        r = "Hello user.";
    }
    else {
        r = "Processed: " + (aiMemory[aiMemory.length-2] || "none");
    }

    document.getElementById("aiOutput").innerText = r;
}

// =========================
// WALLPAPER
// =========================

function setWallpaper() {

    let file = document.getElementById("wallpaperFile").files[0];
    let val = document.getElementById("wallpaperInput").value;

    if (file) {
        let r = new FileReader();
        r.onload = e => applyWallpaper(e.target.result);
        r.readAsDataURL(file);
        return;
    }

    applyWallpaper(val);
}

function applyWallpaper(val) {
    if (!val) return;

    let d = document.getElementById("desktop");

    if (val.startsWith("http") || val.startsWith("data:")) {
        d.style.background = `url(${val}) center/cover`;
    } else {
        d.style.background = val;
    }

    localStorage.setItem("wallpaper", val);
}

// =========================
// RIGHT CLICK MENU
// =========================

document.addEventListener("contextmenu", e => {
    e.preventDefault();

    let m = document.getElementById("contextMenu");
    m.style.left = e.pageX + "px";
    m.style.top = e.pageY + "px";
    m.classList.remove("hidden");
});

document.addEventListener("click", () => {
    document.getElementById("contextMenu").classList.add("hidden");
});

// =========================
// INIT
// =========================

window.onload = () => {
    renderFS();
    boot();

    let w = localStorage.getItem("wallpaper");
    if (w) applyWallpaper(w);

    updateTaskbar();
};let fs = JSON.parse(localStorage.getItem("fs") || "[]");
let currentFile = null;
let dragTarget = null;
let offsetX = 0;
let offsetY = 0;

// ---------------- BOOT ----------------

setTimeout(() => {
    document.getElementById("bootText").innerText = "Starting UI...";
}, 1000);

setTimeout(() => {
    document.getElementById("boot").style.display = "none";
}, 2000);

// ---------------- WINDOWS ----------------

function openApp(id) {
    const el = document.getElementById(id + "Window");
    if (!el) return;
    el.classList.remove("hidden");
}

function closeWindow(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("hidden");
}

// ---------------- DRAG ----------------

function drag(e, id) {
    dragTarget = document.getElementById(id);
    if (!dragTarget) return;

    offsetX = e.clientX - dragTarget.offsetLeft;
    offsetY = e.clientY - dragTarget.offsetTop;
}

document.addEventListener("mousemove", e => {
    if (!dragTarget) return;
    dragTarget.style.left = (e.clientX - offsetX) + "px";
    dragTarget.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => dragTarget = null);

// ---------------- BROWSER ----------------

function go() {
    let u = document.getElementById("url").value;
    if (!u) return;

    if (!u.startsWith("http")) u = "https://" + u;

    document.getElementById("frame").src = u;
}

// ---------------- FILE SYSTEM ----------------

function createFile() {
    let name = prompt("File name:");
    if (!name) return;

    fs.push({ name, content: "" });
    saveFS();
    renderFS();
}

function renderFS() {
    const list = document.getElementById("fileList");
    if (!list) return;

    list.innerHTML = "";

    fs.forEach((f, i) => {
        let div = document.createElement("div");
        div.innerText = f.name;

        div.onclick = () => {
            currentFile = i;
            document.getElementById("noteArea").value = f.content;
        };

        list.appendChild(div);
    });
}

function saveFS() {
    localStorage.setItem("fs", JSON.stringify(fs));
}

// ---------------- NOTES ----------------

function saveNote() {
    if (currentFile === null) return;

    fs[currentFile].content =
        document.getElementById("noteArea").value;

    saveFS();
    renderFS();
}

// ---------------- AI ----------------

function askAI() {
    let q = document.getElementById("aiInput").value.toLowerCase();

    let r = "Processing...";

    if (q.includes("hello")) r = "Hello user.";
    else if (q.includes("time")) r = "Time is simulated.";
    else if (q.length < 3) r = "Input too short.";
    else r = "System response: " + Math.random().toString(36).substring(2,7);

    document.getElementById("aiOutput").innerText = r;
}

// ---------------- WALLPAPER ----------------

function setWallpaper() {
    const file = document.getElementById("wallpaperFile").files[0];
    const input = document.getElementById("wallpaperInput").value;

    if (file) {
        const reader = new FileReader();
        reader.onload = e => applyWallpaper(e.target.result);
        reader.readAsDataURL(file);
        return;
    }

    applyWallpaper(input);
}

function applyWallpaper(val) {
    if (!val) return;

    const d = document.getElementById("desktop");

    if (val.startsWith("http") || val.startsWith("data:")) {
        d.style.background = `url(${val}) center/cover`;
    } else {
        d.style.background = val;
    }

    localStorage.setItem("wallpaper", val);
}

// ---------------- INIT ----------------

window.onload = () => {
    renderFS();

    const w = localStorage.getItem("wallpaper");
    if (w) applyWallpaper(w);
};// =========================
// BOOT
// =========================

setTimeout(() => {
    document.getElementById("bootText").innerText = "Starting UI...";
}, 1000);

setTimeout(() => {
    document.getElementById("boot").classList.add("hidden");
}, 2500);

// =========================
// WINDOW SYSTEM
// =========================

let z = 10;

function openApp(id){
    document.getElementById(id+"Window").classList.remove("hidden");
    bring(id+"Window");
}

function closeWindow(id){
    document.getElementById(id).classList.add("hidden");
}

function bring(id){
    let w=document.getElementById(id);
    w.style.zIndex=++z;
}

// =========================
// DRAGGING
// =========================

let dragEl,ox,oy;

function drag(e,id){
    dragEl=document.getElementById(id);
    ox=e.clientX-dragEl.offsetLeft;
    oy=e.clientY-dragEl.offsetTop;
    bring(id);
}

document.addEventListener("mousemove",e=>{
    if(!dragEl) return;
    dragEl.style.left=(e.clientX-ox)+"px";
    dragEl.style.top=(e.clientY-oy)+"px";
});

document.addEventListener("mouseup",()=>dragEl=null);

// =========================
// START MENU
// =========================

function toggleStart(){
    document.getElementById("startMenu").classList.toggle("hidden");
}

// =========================
// BROWSER
// =========================

function go(){
    let u=document.getElementById("url").value;
    if(!u.startsWith("http")) u="https://"+u;
    document.getElementById("frame").src=u;
}

// =========================
// FILE SYSTEM
// =========================

let fs=JSON.parse(localStorage.getItem("fs")||"[]");

function createFile(){
    let name=prompt("File name:");
    fs.push({name,content:""});
    saveFS();
    renderFS();
}

function renderFS(){
    let d=document.getElementById("fileList");
    d.innerHTML="";
    fs.forEach((f,i)=>{
        let el=document.createElement("div");
        el.innerText=f.name;
        el.onclick=()=>{
            document.getElementById("noteArea").value=f.content;
            window.currentFile=i;
        };
        d.appendChild(el);
    });
}

function saveFS(){
    localStorage.setItem("fs",JSON.stringify(fs));
}

// =========================
// NOTES
// =========================

function saveNote(){
    let i=window.currentFile;
    if(i==null) return;
    fs[i].content=document.getElementById("noteArea").value;
    saveFS();
    renderFS();
}

// =========================
// AI (slightly smarter)
// =========================

function askAI(){
    let q=document.getElementById("aiInput").value.toLowerCase();

    let r;

    if(q.includes("hello")) r="Hello user.";
    else if(q.includes("time")) r="Time is simulated.";
    else if(q.includes("what")) r="Processing query...";
    else {
        let w=["kernel","quantum","sync","node","matrix"];
        r="Response: "+w[Math.random()*w.length|0];
    }

    document.getElementById("aiOutput").innerText=r;
}

// =========================
// WALLPAPER SYSTEM (NEW)
// =========================

function setWallpaper(){

    let file=document.getElementById("wallpaperFile").files[0];
    let url=document.getElementById("wallpaperInput").value;

    if(file){

        let reader=new FileReader();

        reader.onload=function(e){
            applyWallpaper(e.target.result);
        };

        reader.readAsDataURL(file);
        return;
    }

    applyWallpaper(url);
}

function applyWallpaper(val){

    localStorage.setItem("wallpaper",val);

    const d=document.getElementById("desktop");

    if(val.startsWith("http")||val.startsWith("data:")){
        d.style.background=`url(${val})`;
    } else {
        d.style.background=val;
    }
}

// load wallpaper
(function(){
    let w=localStorage.getItem("wallpaper");
    if(w) applyWallpaper(w);
})();

// =========================
// INIT
// =========================

renderFS();
