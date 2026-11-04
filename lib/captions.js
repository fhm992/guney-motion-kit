// captions.js (free kit): word-by-word subtitles timed to the voice (window.CAP).
//   CAP.words(tl, parent, words, opts)   one word on screen at a time, popping in on its own moment.
//     words: [{ w, s, e }] in seconds, e.g. window.VO.captions.words (written by tools/captions/transcribe.mjs)
//     opts:  { offset: 0 (seconds to shift all words), color: '#F4F1EA', accent: (none; colour of the current word, e.g. the video's accent),
//              y: 820 (px from the top), size: 150, maxWords: 1 (words shown together; 1 = strictly word by word),
//              hold: 0.25 (seconds a word may stay after it ends if nothing follows), upper: true }
//   Returns the caption element. Needs: stage.js timeline, fonts.css. Deterministic: only GSAP tweens on tl.
(function () {
  function words(tl, parent, list, o = {}) {
    const off = o.offset || 0, size = o.size || 150, per = Math.max(1, o.maxWords || 1), hold = o.hold ?? 0.25;
    const box = document.createElement('div');
    box.style.cssText = `position:absolute;left:60px;right:60px;top:${o.y ?? 820}px;text-align:center;z-index:50;pointer-events:none;` +
      `font:900 ${size}px/1.05 'Basement Grotesque',sans-serif;color:${o.color || '#F4F1EA'};` +
      `text-shadow:0 6px 30px rgba(0,0,0,.55);${o.upper === false ? '' : 'text-transform:uppercase;'}`;
    parent.appendChild(box);
    const spans = list.map((w) => { const s = document.createElement('span'); s.textContent = w.w;
      s.style.cssText = 'position:absolute;left:0;right:0;display:block;opacity:0;white-space:nowrap;'; box.appendChild(s); return s; });
    // groups of up to `per` words share the line; with per = 1 each word sits alone
    for (let g = 0; g < list.length; g += per) {
      const idx = list.slice(g, g + per).map((_, k) => g + k);
      const gStart = list[idx[0]].s + off, last = list[idx[idx.length - 1]];
      const next = list[g + per];
      const gEnd = Math.min(next ? next.s + off : Infinity, last.e + off + hold);
      if (per === 1) {
        const i = idx[0];
        tl.fromTo(spans[i], { opacity: 0, scale: 0.72, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.16, ease: 'back.out(2.2)', immediateRender: false }, gStart);
        tl.set(spans[i], { opacity: 0 }, Math.max(gStart + 0.17, gEnd));
        if (o.accent) spans[i].style.color = o.accent;
      } else {
        const row = document.createElement('div'); row.style.cssText = 'position:absolute;left:0;right:0;opacity:0;white-space:nowrap;'; box.appendChild(row);
        idx.forEach((i) => { spans[i].style.cssText = 'position:static;display:inline-block;margin:0 .18em;opacity:1;color:inherit;'; row.appendChild(spans[i]);
          tl.set(spans[i], { color: o.color || '#F4F1EA' }, 0); tl.set(spans[i], { color: o.accent || '#E8743C' }, list[i].s + off);
          tl.set(spans[i], { color: o.color || '#F4F1EA' }, Math.min(list[i].e + off, gEnd)); });
        tl.fromTo(row, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out', immediateRender: false }, gStart);
        tl.set(row, { opacity: 0 }, gEnd);
      }
    }
    return box;
  }
  window.CAP = { words };
})();
