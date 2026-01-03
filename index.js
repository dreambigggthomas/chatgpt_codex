const http = require('http');

const port = process.env.PORT || 3000;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Google Inspired Home</title>
  <style>
    :root {
      --bg: #f8f9fa;
      --text: #202124;
      --pill: #f1f3f4;
      --icon: #5f6368;
      --blue: #4285f4;
      --red: #ea4335;
      --yellow: #fbbc05;
      --green: #34a853;
      --shadow: rgba(0, 0, 0, 0.15);
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: "Helvetica Neue", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    header {
      margin-top: 64px;
      font-size: 72px;
      font-weight: 700;
      letter-spacing: -2px;
      display: flex;
      gap: 2px;
    }
    header span:nth-child(1) { color: var(--blue); }
    header span:nth-child(2) { color: var(--red); }
    header span:nth-child(3) { color: var(--yellow); }
    header span:nth-child(4) { color: var(--blue); }
    header span:nth-child(5) { color: var(--green); }
    header span:nth-child(6) { color: var(--red); }
    main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 48px;
      gap: 42px;
    }
    .search-bar {
      display: flex;
      align-items: center;
      width: min(920px, 90%);
      background: #fff;
      border-radius: 999px;
      padding: 14px 18px;
      box-shadow: 0 1px 6px var(--shadow);
      gap: 14px;
    }
    .search-icon,
    .mic-icon,
    .camera-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      color: var(--icon);
      font-size: 16px;
    }
    .pill {
      background: var(--pill);
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 16px;
      color: var(--text);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 22px;
      color: var(--text);
      background: transparent;
    }
    input::placeholder {
      color: #8a8a8a;
    }
    .shortcuts {
      width: min(1200px, 95%);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 18px 12px;
      align-items: start;
      justify-items: center;
      padding-bottom: 40px;
    }
    .shortcut {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
      color: var(--text);
      font-size: 16px;
    }
    .bubble {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #e8eaed;
      display: grid;
      place-items: center;
      color: var(--icon);
      font-weight: 700;
      font-size: 22px;
      position: relative;
    }
    .bubble .dot {
      position: absolute;
      bottom: 10px;
      right: 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--blue);
    }
    .add {
      font-size: 28px;
      font-weight: 600;
    }
    @media (max-width: 640px) {
      header { font-size: 56px; }
      .search-bar { width: 94%; }
      input { font-size: 18px; }
    }
  </style>
</head>
<body>
  <header aria-label="Google logo">
    <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
  </header>
  <main>
    <div class="search-bar" role="search">
      <div class="search-icon">🔍</div>
      <input type="text" placeholder="Search Google or type a URL" aria-label="Search" />
      <div class="mic-icon">🎤</div>
      <div class="camera-icon">📷</div>
      <div class="pill">⚙︎ AI Mode</div>
    </div>
    <section class="shortcuts" aria-label="Shortcuts">
      <div class="shortcut">
        <div class="bubble">b<div class="dot"></div></div>
        <div>Bubble</div>
      </div>
      <div class="shortcut">
        <div class="bubble">S</div>
        <div>simpsonmar...</div>
      </div>
      <div class="shortcut">
        <div class="bubble">M</div>
        <div>MIRO</div>
      </div>
      <div class="shortcut">
        <div class="bubble">◎</div>
        <div>ChatGPT</div>
      </div>
      <div class="shortcut">
        <div class="bubble">19</div>
        <div>WhatsApp</div>
      </div>
      <div class="shortcut">
        <div class="bubble">b<div class="dot"></div></div>
        <div>Bubble</div>
      </div>
      <div class="shortcut">
        <div class="bubble">b<div class="dot"></div></div>
        <div>Bubble</div>
      </div>
      <div class="shortcut">
        <div class="bubble">E</div>
        <div>ExpressVPN ...</div>
      </div>
      <div class="shortcut">
        <div class="bubble add">+</div>
        <div>Add shortcut</div>
      </div>
    </section>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



