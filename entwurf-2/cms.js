/* Mini-Redaktion (Demo). Liest, was im Mitarbeiter-Bereich (admin.html) gespeichert wurde.
   Demo-Version: gespeichert im Browser (localStorage), sichtbar nur auf diesem Gerät.
   Live-Version: dieselben Daten liegen als JSON auf dem Server, dann sehen es alle. */
(function () {
  var KEY = 'meyer-cms-v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function today() {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
    catch (e) { var d = new Date(), m = d.getMonth() + 1, t = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (t < 10 ? '0' : '') + t; }
  }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  var d = load(), heute = today();

  /* 1. Störer oben */
  var s = d.stoerer;
  if (s && s.text && (!s.von || s.von <= heute) && (!s.bis || s.bis >= heute)) {
    var css = document.createElement('style');
    css.textContent =
      '.stoerer{position:sticky;top:0;z-index:70;display:flex;align-items:center;gap:12px;padding:12px 16px;font:700 15px/1.35 "DM Sans",sans-serif;color:#16283A;background:#F3D35B;box-shadow:0 2px 10px rgba(0,0,0,.15)}' +
      '.stoerer.rot{background:#B5473A;color:#fff}' +
      '.stoerer .i{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(22,40,58,.12);font-weight:800}' +
      '.stoerer.rot .i{background:rgba(255,255,255,.2)}' +
      '.stoerer .t{flex:1;max-width:1120px;margin:0 auto}' +
      '.stoerer button{flex:none;border:0;background:transparent;color:inherit;font:700 22px "DM Sans",sans-serif;cursor:pointer;line-height:1;padding:2px 6px}' +
      'body.has-st .demo{top:64px}';
    document.head.appendChild(css);
    var bar = el('div', 'stoerer' + (s.farbe === 'rot' ? ' rot' : ''));
    bar.setAttribute('role', 'status');
    bar.appendChild(el('span', 'i', '!'));
    bar.appendChild(el('span', 't', s.text));
    var x = el('button', '', '×'); x.setAttribute('aria-label', 'Hinweis schließen');
    x.onclick = function () { bar.remove(); document.body.classList.remove('has-st'); };
    bar.appendChild(x);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('has-st');
  }

  /* 2. Eigene Beiträge vorne in "Aktuelles" */
  var grid = document.querySelector('#aktuelles .news');
  var posts = (d.posts || []).slice().sort(function (a, b) { return a.datum < b.datum ? 1 : -1; });
  if (grid && posts.length) {
    var first = grid.firstElementChild;
    posts.forEach(function (p) {
      var a = el('a', 'card rv in'); a.href = 'beitrag.html?id=' + encodeURIComponent(p.id);
      a.style.cssText = 'text-decoration:none;color:inherit';
      var pic = el('div', 'pic');
      if (p.bild) { var img = el('img'); img.src = p.bild; img.alt = p.titel || ''; pic.appendChild(img); }
      var b = el('div', 'b');
      b.appendChild(el('span', 'eyebrow', p.rubrik || 'Aktuelles')).style.margin = '0';
      b.appendChild(el('h3', '', p.titel || ''));
      if (p.kurz) b.appendChild(el('p', '', p.kurz));
      a.appendChild(pic); a.appendChild(b);
      grid.insertBefore(a, first);
    });
    /* Startseite zeigt die drei neuesten, ältere rutschen raus */
    var cards = grid.children;
    for (var i = cards.length - 1; i >= 3; i--) cards[i].style.display = 'none';
  }

  /* 3. Weinstube: Gerichte der Woche */
  var w = d.woche;
  if (w && w.length) {
    [].forEach.call(document.querySelectorAll('.cat'), function (cat) {
      if (cat.textContent.trim() !== 'Gerichte der Woche') return;
      var n = cat.nextElementSibling;
      while (n && !n.classList.contains('cat')) { var nx = n.nextElementSibling; n.remove(); n = nx; }
      var after = cat;
      w.forEach(function (r) {
        if (!r.g) return;
        var row = el('div', 'mr two');
        row.appendChild(el('div', 'g', r.g));
        row.appendChild(el('div', 'p', r.p ? r.p.replace(/\s*€\s*$/, '') + ' €' : ''));
        after.parentNode.insertBefore(row, after.nextSibling); after = row;
      });
    });
  }
  /* Direkt zur Weinstuben-Karte springen (Link aus dem Mitarbeiter-Bereich) */
  if (location.hash === '#karte-weinstube') setTimeout(function () {
    var m = document.getElementById('m-weinstube');
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }, 300);
})();
