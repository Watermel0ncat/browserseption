// =========================
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
