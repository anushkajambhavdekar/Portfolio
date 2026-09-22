/* Anushka Jambhavdekar | Developer workspace portfolio (no libraries) */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var editor = document.getElementById("editor");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var cssVar = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };

  var FILES = {
    readme: { label: "README.md", crumb: "README.md", icon: "md" },
    about: { label: "about.md", crumb: "about.md", icon: "md" },
    skills: { label: "skills.json", crumb: "skills.json", icon: "json" },
    projects: { label: "projects", crumb: "projects", icon: "dir" },
    bluevision: { label: "bluevision.md", crumb: "projects / bluevision.md", icon: "md" },
    sos: { label: "sos-system.md", crumb: "projects / sos-system.md", icon: "md" },
    academic: { label: "academic-mini-projects.md", crumb: "projects / academic-mini-projects.md", icon: "md" },
    gallery: { label: "gallery", crumb: "gallery", icon: "dir" },
    contact: { label: "contact.ts", crumb: "contact.ts", icon: "ts" }
  };
  var ORDER = ["readme", "about", "skills", "projects", "gallery", "contact"];

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-btn");
  var sbTheme = document.getElementById("sb-theme");
  var applyThemeLabel = function () {
    var day = root.getAttribute("data-theme") === "day";
    if (themeBtn) themeBtn.setAttribute("aria-label", day ? "Switch to night theme" : "Switch to day theme");
    if (sbTheme) sbTheme.textContent = "Theme: " + (day ? "Day" : "Night");
  };
  applyThemeLabel();
  var toggleTheme = function () {
    var next = root.getAttribute("data-theme") === "day" ? "night" : "day";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ap-theme", next); } catch (e) {}
    applyThemeLabel();
    window.dispatchEvent(new Event("themechange"));
  };
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  var sbThemeBtn = document.getElementById("sb-theme");
  if (sbThemeBtn) sbThemeBtn.addEventListener("click", toggleTheme);

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  var toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  };
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(function () { toast("Copied " + v); });
      else toast(v);
    });
  });

  /* ---------- View router + tabs ---------- */
  var openTabs = [];
  var current = null;
  var tabsEl = document.getElementById("tabs");
  var crumbsEl = document.getElementById("crumbs");

  var renderTabs = function () {
    tabsEl.innerHTML = "";
    openTabs.forEach(function (key) {
      var f = FILES[key];
      var tab = document.createElement("div");
      tab.className = "tab" + (key === current ? " on" : "");
      tab.innerHTML =
        '<button class="tab-btn" role="tab" aria-selected="' + (key === current) + '" data-open="' + key + '">' +
        '<span class="ic ' + f.icon + '">' + f.icon.toUpperCase() + "</span>" + f.label + "</button>" +
        (key === "readme" ? "" : '<button class="tab-x" aria-label="Close ' + f.label + '">' + xIcon() + "</button>");
      tabsEl.appendChild(tab);
    });
  };
  function xIcon() { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'; }

  var setActiveInSidebar = function (key) {
    document.querySelectorAll(".sidebar .node[data-open]").forEach(function (n) {
      n.classList.toggle("on", n.getAttribute("data-open") === key);
    });
  };

  var openView = function (key, opts) {
    if (!FILES[key]) key = "readme";
    opts = opts || {};
    if (openTabs.indexOf(key) === -1) openTabs.push(key);
    current = key;
    document.querySelectorAll(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== key; });
    renderTabs();
    crumbsEl.textContent = FILES[key].crumb;
    setActiveInSidebar(key === "bluevision" || key === "sos" || key === "academic" ? "projects" : key);
    if (!opts.silent) history.replaceState(null, "", "#" + key);
    if (!opts.noScroll) editor.scrollTop = 0;
    if (window.innerWidth <= 900 && !opts.keepSide) closeSide();
    window.dispatchEvent(new CustomEvent("viewopen", { detail: key }));
  };

  tabsEl.addEventListener("click", function (e) {
    var closeBtn = e.target.closest(".tab-x");
    if (closeBtn) {
      var tab = closeBtn.closest(".tab");
      var idx = [].slice.call(tabsEl.children).indexOf(tab);
      var key = openTabs[idx];
      openTabs.splice(idx, 1);
      if (current === key) openView(openTabs[Math.max(0, idx - 1)] || "readme");
      else renderTabs();
      return;
    }
    var openBtn = e.target.closest("[data-open]");
    if (openBtn) openView(openBtn.getAttribute("data-open"));
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (!t || t.closest("#tabs")) return;
    if (t.tagName === "A" && t.getAttribute("target") === "_blank") return;
    e.preventDefault();
    openView(t.getAttribute("data-open"));
  });

  /* Sidebar folder expand/collapse */
  document.querySelectorAll(".node[data-folder]").forEach(function (n) {
    n.addEventListener("click", function (e) {
      if (e.target.closest("[data-open]") === n && e.detail === 0) return;
      var g = document.getElementById("g-" + n.getAttribute("data-folder"));
      var open = n.getAttribute("aria-expanded") === "true";
      n.setAttribute("aria-expanded", String(!open));
      g.hidden = open;
    });
  });

  var startKey = (location.hash || "#readme").slice(1);
  openView(FILES[startKey] ? startKey : "readme", { silent: true, noScroll: true, keepSide: true });
  window.addEventListener("hashchange", function () {
    var k = location.hash.slice(1);
    if (FILES[k]) openView(k, { silent: true });
  });

  /* ---------- Responsive sidebar ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var explorerBtn = document.getElementById("act-explorer");
  var scrim = document.getElementById("scrim");
  var openSide = function () { app.classList.add("side-open"); };
  function closeSide() { app.classList.remove("side-open"); }
  var toggleSide = function () {
    if (window.innerWidth <= 900) app.classList.toggle("side-open");
    else app.classList.toggle("no-side");
  };
  if (menuBtn) menuBtn.addEventListener("click", toggleSide);
  if (explorerBtn) explorerBtn.addEventListener("click", toggleSide);
  if (scrim) scrim.addEventListener("click", closeSide);
  document.querySelectorAll(".act[data-open]").forEach(function (b) {
    b.addEventListener("click", function () { app.classList.add("act-marked"); });
  });
  var markActivity = function (key) {
    var map = { about: "about", skills: "skills", projects: "projects", bluevision: "projects", sos: "projects", academic: "projects", gallery: "gallery", contact: "contact" };
    document.querySelectorAll(".act[data-open]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-open") === map[key]);
    });
  };
  window.addEventListener("viewopen", function (e) { markActivity(e.detail); });
  markActivity(current);

  /* ---------- Command palette ---------- */
  var palette = document.getElementById("palette");
  var palIn = document.getElementById("pal-in");
  var palList = document.getElementById("pal-list");
  var ITEMS = ORDER.map(function (k) { return { type: "file", key: k, label: FILES[k].label, hint: "open file" }; })
    .concat([
      { type: "cmd", key: "theme", label: "Toggle theme", hint: "command" },
      { type: "cmd", key: "terminal", label: "Toggle terminal", hint: "command" },
      { type: "link", key: "github", label: "Open GitHub profile", hint: "external", url: FILES.contact ? null : null }
    ]);
  var palOpenPrev = null, sel = 0, filtered = ITEMS;

  var renderPal = function () {
    palList.innerHTML = "";
    if (!filtered.length) {
      palList.innerHTML = '<li class="pal-empty">No matches</li>';
      return;
    }
    filtered.forEach(function (it, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === sel));
      li.innerHTML = "<span>" + it.label + '</span><span class="h">' + it.hint + "</span>";
      li.addEventListener("mouseenter", function () { sel = i; renderPal(); });
      li.addEventListener("click", function () { runItem(it); });
      palList.appendChild(li);
    });
    var active = palList.children[sel];
    if (active) active.scrollIntoView({ block: "nearest" });
  };
  var runItem = function (it) {
    closePalette();
    if (it.type === "file") openView(it.key);
    else if (it.key === "theme") toggleTheme();
    else if (it.key === "terminal") toggleTerm();
  };
  var openPalette = function () {
    palOpenPrev = document.activeElement;
    palette.hidden = false;
    palIn.value = "";
    filtered = ITEMS; sel = 0;
    renderPal();
    palIn.focus();
  };
  function closePalette() {
    palette.hidden = true;
    if (palOpenPrev) palOpenPrev.focus();
  }
  document.getElementById("palette-open").addEventListener("click", openPalette);
  document.getElementById("sb-palette").addEventListener("click", openPalette);
  palette.addEventListener("click", function (e) { if (e.target === palette) closePalette(); });
  palIn.addEventListener("input", function () {
    var q = palIn.value.toLowerCase().trim();
    filtered = !q ? ITEMS : ITEMS.filter(function (it) { return it.label.toLowerCase().indexOf(q) > -1; });
    sel = 0;
    renderPal();
  });
  palIn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(filtered.length - 1, sel + 1); renderPal(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); renderPal(); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) runItem(filtered[sel]); }
    else if (e.key === "Escape") { closePalette(); }
  });
  window.addEventListener("keydown", function (e) {
    var mod = e.ctrlKey || e.metaKey;
    if (mod && (e.key === "k" || e.key === "K")) { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
    else if (mod && e.key === "`") { e.preventDefault(); toggleTerm(); }
    else if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); toggleSide(); }
    else if (e.key === "Escape" && !palette.hidden) { closePalette(); }
  });

  /* ---------- Terminal ---------- */
  var termPanel = document.getElementById("term");
  var termOut = document.getElementById("term-out");
  var termForm = document.getElementById("term-form");
  var termIn = document.getElementById("term-in");
  var sbTerm = document.getElementById("sb-term");
  var termOpened = false;
  var toggleTerm = function () {
    var hidden = termPanel.hidden;
    termPanel.hidden = !hidden;
    if (!hidden) return;
    if (!termOpened) { termOpened = true; bootTerm(); }
    termIn.focus();
  };
  document.getElementById("act-term").addEventListener("click", toggleTerm);
  document.getElementById("term-close").addEventListener("click", toggleTerm);
  sbTerm.addEventListener("click", toggleTerm);

  var line = function (text, cls) {
    var d = document.createElement("div");
    d.className = "tl" + (cls ? " " + cls : "");
    d.textContent = text;
    termOut.appendChild(d);
    termOut.scrollTop = termOut.scrollHeight;
  };
  var linkLine = function (label, text, href) {
    var d = document.createElement("div");
    d.className = "tl";
    d.appendChild(document.createTextNode(label));
    var a = document.createElement("a");
    a.href = href; a.textContent = text;
    if (href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
    d.appendChild(a);
    termOut.appendChild(d);
    termOut.scrollTop = termOut.scrollHeight;
  };
  var pad = function (a, b) { return a + new Array(Math.max(1, 20 - a.length)).join(" ") + b; };
  var cmdHistory = [], hIndex = 0;
  var commands = {
    help: function () {
      line("Commands", "h");
      [["ls", "list files"], ["cat about", "print about.md"], ["open <file>", "open a file (about, skills, projects, gallery, contact)"], ["theme", "toggle day / night"], ["whoami", "quick introduction"], ["clear", "clear the screen"]].forEach(function (c) { line(pad(c[0], c[1])); });
    },
    ls: function () { line(ORDER.map(function (k) { return FILES[k].label; }).join("   ")); },
    whoami: function () {
      line("Anushka Jambhavdekar", "h");
      line("Third Year Computer Science Engineering Student.");
      line("Interested in Web Development, Artificial Intelligence and Software Engineering.");
    },
    cat: function (args) {
      var k = (args[0] || "").toLowerCase();
      if (k === "about") { line("Pursuing B.Tech in Computer Science Engineering, KIT College of Engineering, Kolhapur (2024 - 2028)."); line("Seeking opportunities to apply my skills and contribute to impactful projects."); }
      else if (k === "skills") { line("fullStack, python, cyberSecurity, webDevelopment, programming, databaseAndTools"); }
      else if (k === "contact") { linkLine("email   ", FILES.contact ? "anushkajambhavdekar@gmail.com" : "", "mailto:anushkajambhavdekar@gmail.com"); }
      else line(k + ": no such file. Try ls.", "err");
    },
    open: function (args) {
      var k = (args[0] || "").toLowerCase();
      var alias = { work: "projects", proj: "projects", pics: "gallery", photos: "gallery" };
      k = alias[k] || k;
      if (!FILES[k]) { line("open: unknown file \"" + (args[0] || "") + "\". Try ls.", "err"); return; }
      line("Opening " + FILES[k].label + " ...");
      setTimeout(function () { openView(k); }, 300);
    },
    theme: function () { toggleTheme(); line("Theme toggled."); },
    clear: function () { termOut.textContent = ""; }
  };
  var runCmd = function (raw) {
    var text = raw.trim();
    if (!text) return;
    line("$ " + text, "cmd");
    cmdHistory.push(text); hIndex = cmdHistory.length;
    var parts = text.split(/\s+/);
    if (parts[0].toLowerCase() === "sudo") parts.shift();
    var name = (parts.shift() || "").toLowerCase();
    if (commands[name]) commands[name](parts);
    else line(name + ": command not found. Type \"help\".", "err");
  };
  termForm.addEventListener("submit", function (e) { e.preventDefault(); runCmd(termIn.value); termIn.value = ""; });
  termIn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") { e.preventDefault(); if (hIndex > 0) termIn.value = cmdHistory[--hIndex]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hIndex = Math.min(cmdHistory.length, hIndex + 1); termIn.value = cmdHistory[hIndex] || ""; }
  });
  var bootTerm = function () {
    line("Welcome. Type \"help\" to see what works.", "h");
    line('Try: whoami, cat about, open projects');
  };

  /* ---------- Home: typed code card ---------- */
  (function typedCode() {
    var el = document.getElementById("typed-code");
    if (!el) return;
    var LINES = [
      ['<span class="k">const</span> <span class="v">anushka</span> <span class="o">=</span> <span class="o">{</span>'],
      ['  <span class="p">role</span><span class="o">:</span> <span class="s">"CSE Student"</span><span class="o">,</span>'],
      ['  <span class="p">year</span><span class="o">:</span> <span class="s">"Third"</span><span class="o">,</span>'],
      ['  <span class="p">college</span><span class="o">:</span> <span class="s">"KIT College of Engineering"</span><span class="o">,</span>'],
      ['  <span class="p">interests</span><span class="o">:</span> <span class="o">[</span>'],
      ['    <span class="s">"Web Development"</span><span class="o">,</span>'],
      ['    <span class="s">"Artificial Intelligence"</span><span class="o">,</span>'],
      ['    <span class="s">"Software Engineering"</span><span class="o">,</span>'],
      ['  <span class="o">]</span><span class="o">,</span>'],
      ['  <span class="n">isOpenToWork</span><span class="o">:</span> <span class="k">true</span><span class="o">,</span>'],
      ['<span class="o">};</span>'],
      ['', '<span class="c">// thanks for stopping by</span>']
    ];
    if (reduce) {
      el.innerHTML = LINES.map(function (l) { return l.join(""); }).join("\n");
      return;
    }
    var li = 0, ci = 0, out = "";
    var tick = function () {
      if (li >= LINES.length) { el.innerHTML = out + '<span class="caret"></span>'; return; }
      var full = LINES[li].join("");
      var plain = full.replace(/<[^>]+>/g, "");
      if (ci === 0 && li > 0) out += "\n";
      if (ci <= plain.length) {
        var frac = plain.length ? ci / plain.length : 1;
        var approx = full.length ? full.slice(0, Math.round(full.length * frac)) : "";
        el.innerHTML = out + approx + '<span class="caret"></span>';
        ci++;
        setTimeout(tick, 10 + Math.random() * 16);
      } else {
        out += full;
        li++; ci = 0;
        setTimeout(tick, 90);
      }
    };
    tick();
  })();

  /* ---------- Home: neural network canvas ---------- */
  (function net() {
    var canvas = document.getElementById("net");
    var hero = canvas ? canvas.closest(".hero") : null;
    if (!canvas || !hero) return;
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = 1;
    var mouse = { x: -999, y: -999 };
    var visible = true;
    var col = { node: "124, 196, 255", edge: "77, 141, 255" };
    var readColors = function () {
      col.node = cssVar("--net-node") || col.node;
      col.edge = cssVar("--net-edge") || col.edge;
    };
    readColors();
    window.addEventListener("themechange", readColors);

    var LAYER_X_FRAC = [0.1, 0.36, 0.62, 0.88];
    var LAYER_N = [5, 8, 8, 4];
    var nodes = [], links = [];

    var resize = function () {
      var r = hero.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    var build = function () {
      nodes = []; links = [];
      var layers = [];
      LAYER_X_FRAC.forEach(function (fx, li) {
        var col2 = [];
        var n = LAYER_N[li];
        for (var i = 0; i < n; i++) {
          var fy = (i + 1) / (n + 1);
          col2.push({
            x: W * fx, y: H * fy,
            bx: W * fx, by: H * fy,
            vx: 0, vy: 0,
            r: li === 0 || li === LAYER_X_FRAC.length - 1 ? 4.5 : 3.4,
            pulse: Math.random() * Math.PI * 2
          });
        }
        layers.push(col2);
        nodes = nodes.concat(col2);
      });
      for (var l = 0; l < layers.length - 1; l++) {
        layers[l].forEach(function (a) {
          layers[l + 1].forEach(function (b) {
            if (Math.random() < 0.55) links.push({ a: a, b: b, w: Math.random(), t: Math.random(), speed: 0.002 + Math.random() * 0.004 });
          });
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      hero.style.setProperty("--sx", mouse.x + "px");
      hero.style.setProperty("--sy", mouse.y + "px");
    });
    window.addEventListener("pointerleave", function () { mouse.x = -999; mouse.y = -999; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    }

    var frame = function () {
      requestAnimationFrame(frame);
      if (!visible || document.hidden || W === 0) return;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(function (n) {
        var dx = n.x - mouse.x, dy = n.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          var d = Math.sqrt(d2) || 1;
          var push = (126 - d) / 126;
          n.vx += (dx / d) * push * 0.6;
          n.vy += (dy / d) * push * 0.6;
        }
        n.vx += (n.bx - n.x) * 0.02;
        n.vy += (n.by - n.y) * 0.02;
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx; n.y += n.vy;
        n.pulse += 0.02;
      });

      links.forEach(function (l) {
        if (!reduce) { l.t += l.speed; if (l.t > 1) l.t -= 1; }
        ctx.strokeStyle = "rgba(" + col.edge + "," + (0.08 + l.w * 0.1) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
        if (!reduce) {
          var px = l.a.x + (l.b.x - l.a.x) * l.t;
          var py = l.a.y + (l.b.y - l.a.y) * l.t;
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + col.edge + ",0.85)";
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      nodes.forEach(function (n) {
        var glow = 0.55 + Math.sin(n.pulse) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + col.node + "," + glow + ")";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(" + col.node + ",0.35)";
        ctx.lineWidth = 1;
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.stroke();
      });
    };
    requestAnimationFrame(frame);
  })();

  /* ---------- Skills: cards <-> JSON linking ---------- */
  (function skills() {
    var cards = [].slice.call(document.querySelectorAll(".skill"));
    var jsonEl = document.getElementById("json");
    if (!cards.length || !jsonEl) return;
    var data = cards.map(function (c) {
      return { key: c.getAttribute("data-key"), title: c.querySelector("h3").textContent, desc: c.querySelector("p").textContent, items: c.getAttribute("data-items").split("|") };
    });

    var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;"); };
    var lnCounter = 0;
    var addLine = function (text, group) {
      var span = document.createElement("span");
      span.className = "ln";
      span.innerHTML = text;
      if (group != null) span.setAttribute("data-g", group);
      jsonEl.appendChild(span);
      lnCounter++;
    };
    jsonEl.textContent = "";
    lnCounter = 0;
    addLine('<span class="k">{</span>');
    var groupLines = data.map(function () { return []; });
    data.forEach(function (d, i) {
      var rows = [
        '&nbsp;&nbsp;<span class="p">"' + d.key + '"</span><span class="o">:</span> <span class="k">{</span>',
        '&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">"title"</span><span class="o">:</span> <span class="s">"' + esc(d.title) + '"</span><span class="o">,</span>',
        '&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">"summary"</span><span class="o">:</span> <span class="s">"' + esc(d.desc) + '"</span><span class="o">,</span>',
        '&nbsp;&nbsp;&nbsp;&nbsp;<span class="p">"stack"</span><span class="o">:</span> <span class="o">[</span>'
      ];
      d.items.forEach(function (it, j) {
        rows.push('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="s">"' + esc(it) + '"</span>' + (j < d.items.length - 1 ? '<span class="o">,</span>' : ""));
      });
      rows.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="o">]</span>');
      rows.push('&nbsp;&nbsp;<span class="k">}</span>' + (i < data.length - 1 ? '<span class="o">,</span>' : ""));
      rows.forEach(function (r) { addLine(r, i); groupLines[i].push(lnCounter - 1); });
    });
    addLine('<span class="k">}</span>');

    var setHL = function (i) {
      jsonEl.querySelectorAll(".ln").forEach(function (l) { l.classList.remove("hl"); });
      cards.forEach(function (c) { c.classList.remove("hl"); });
      if (i == null) return;
      cards[i].classList.add("hl");
      groupLines[i].forEach(function (ln) { jsonEl.children[ln].classList.add("hl"); });
    };
    cards.forEach(function (c, i) {
      c.addEventListener("mouseenter", function () { setHL(i); });
      c.addEventListener("focus", function () { setHL(i); });
      c.addEventListener("mouseleave", function () { setHL(null); });
      c.addEventListener("blur", function () { setHL(null); });
      c.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  })();

  /* ---------- Card glow follows the mouse ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".glow").forEach(function (el) {
      if (el.classList.contains("skill")) return;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  (function gallery() {
    var thumbs = document.getElementById("thumbs");
    var lb = document.getElementById("lightbox");
    if (!thumbs || !lb) return;
    var img = document.getElementById("lb-img");
    var count = document.getElementById("lb-count");
    var closeB = lb.querySelector(".lb-close");
    var prevB = lb.querySelector(".lb-prev");
    var nextB = lb.querySelector(".lb-next");
    var cur = 0, opener = null;
    var list = function () { return [].slice.call(thumbs.querySelectorAll(".thumb img")); };
    var show = function (i) {
      var l = list();
      if (!l.length) return close();
      cur = (i + l.length) % l.length;
      img.src = l[cur].currentSrc || l[cur].src;
      img.alt = l[cur].alt;
      count.textContent = cur + 1 + " of " + l.length;
    };
    var open = function (i, from) {
      opener = from; lb.hidden = false; document.body.style.overflow = "hidden"; show(i); closeB.focus();
    };
    var close = function () { lb.hidden = true; document.body.style.overflow = ""; if (opener) opener.focus(); };
    thumbs.addEventListener("click", function (e) {
      var btn = e.target.closest(".thumb");
      if (!btn) return;
      open(Math.max(0, list().indexOf(btn.querySelector("img"))), btn);
    });
    closeB.addEventListener("click", close);
    prevB.addEventListener("click", function () { show(cur - 1); });
    nextB.addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
      else if (e.key === "Tab") {
        var order = [closeB, prevB, nextB];
        var at = order.indexOf(document.activeElement);
        e.preventDefault();
        order[(at + (e.shiftKey ? -1 : 1) + order.length) % order.length].focus();
      }
    });
    /* Sidebar image entries open the lightbox directly */
    document.querySelectorAll(".node[data-img]").forEach(function (n) {
      n.addEventListener("click", function () {
        openView("gallery");
        setTimeout(function () {
          var fn = n.getAttribute("data-img");
          var l = list();
          var idx = l.findIndex(function (im) { return im.getAttribute("alt") === fn; });
          open(Math.max(0, idx), document.getElementById("thumbs"));
        }, 60);
      });
    });
  })();

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var subject = "Portfolio message from " + name;
      var body = message + "\n\nFrom: " + name + " (" + email + ")";
      window.location.href = "mailto:anushkajambhavdekar@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
