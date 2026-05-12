// =========================
// CORE OS STATE
// =========================

window.OS = {
    z: 10,
    drag: { el:null, x:0, y:0 }
};

// =========================
// WINDOW SYSTEM (SAFE CORE)
// =========================

function createWindow(title, content) {

    const win = document.createElement("div");
    win.className = "window";

    win.style.left = "100px";
    win.style.top = "100px";
    win.style.zIndex = ++OS.z;

    win.innerHTML = `
        <div class="titlebar">
            <span>${title}</span>
            <button onclick="this.closest('.window').remove()">X</button>
        </div>
        <div class="content">${content}</div>
    `;

    // DRAGGING
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const bar = win.querySelector(".titlebar");

    bar.onmousedown = (e) => {
        dragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    };

    document.onmousemove = (e) => {
        if (!dragging) return;
        win.style.left = (e.clientX - offsetX) + "px";
        win.style.top = (e.clientY - offsetY) + "px";
    };

    document.onmouseup = () => dragging = false;

    document.getElementById("desktop").appendChild(win);
}

// =========================
// BROWSER (FIXED + WORKING)
// =========================

function openBrowser() {

    createWindow("Browser", `
        <input id="url" placeholder="https://example.com">
        <button onclick="
            let u = document.getElementById('url').value;
            if (!u.startsWith('http')) u = 'https://' + u;

            if (!window._frame) {
                window._frame = document.createElement('iframe');
                window._frame.style.width='100%';
                window._frame.style.height='80%';
                document.querySelector('.window:last-child .content').appendChild(window._frame);
            }

            window._frame.src = u;
        ">Go</button>
    `);
}

// =========================
// AI (SIMPLE BUT STABLE)
// =========================

function openAI() {

    createWindow("AI", `
        <input id="aiInput" placeholder="Ask something">
        <button onclick="
            let q = document.getElementById('aiInput').value;

            let response =
                q.includes('hello') ? 'Hello' :
                q.includes('reverse') ? q.split(' ').reverse().join(' ') :
                'AI: ' + q;

            document.getElementById('aiOut').innerText = response;
        ">Ask</button>

        <div id="aiOut"></div>
    `);
}
