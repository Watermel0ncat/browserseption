let fs = JSON.parse(localStorage.getItem("fs") || "[]");
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
