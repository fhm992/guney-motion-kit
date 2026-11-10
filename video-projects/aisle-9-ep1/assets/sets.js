// sets.js: every AISLE 9 location, built from WORLD parts. Each returns a WORLD.World. Store layout (metres):
//   front of store z < 2 (checkout lanes along x at z = 1.2, entrance/storefront at z = -3), aisles run along z from 6 to 26,
//   gondolas at x = -7.5, -4.5, -1.5, 1.5, 4.5, 7.5 (aisle centres at x = -6, -3, 0, 3, 6). Aisle 9 = canned goods.
(function () {
  const PAL = WORLD.PAL;
  const W = WORLD.World.prototype;
  // end cap: a short display facing -z (toward the front of the store) full of products, with a banner
  W.endcap = function (x0, x1, z, o = {}) {
    const r = STAGE.mulberry32(o.seed || 5), pal = PAL[o.kind || 'mixed'], top = 1.9;
    this.box(x0, 0, z, x1, top, z + 0.6, '#3A3F4A', { colors: { front: '#2b2f39' } });
    [0.1, 0.55, 1.0, 1.45].forEach((ly) => {
      this.quad([[x0, ly - 0.05, z - 0.01], [x1, ly - 0.05, z - 0.01], [x1, ly, z - 0.01], [x0, ly, z - 0.01]], o.lip || '#F2B134', { tags: true, dir: 1 });
      let x = x0 + 0.04; while (x < x1 - 0.12) { const w = 0.12 + r() * 0.12, hh = 0.22 + r() * 0.16, col = pal[Math.floor(r() * pal.length)], type = o.kind === 'cans' ? 'can' : ['box', 'bottle', 'bag', 'can', 'jar'][Math.floor(r() * 5)];
        this.quad([[x, ly, z - 0.02], [x + w, ly, z - 0.02], [x + w, ly + hh, z - 0.02], [x, ly + hh, z - 0.02]], col, { product: type, dir: 1, seed: r(), label: r() < 0.5 ? '#FFFFFF' : '#F7F4EA' }); x += w + 0.015; }
    });
    if (o.banner) this.quad([[x0, top, z - 0.02], [x1, top, z - 0.02], [x1, top + 0.55, z - 0.02], [x0, top + 0.55, z - 0.02]], o.bannerColor || '#E8382F', { poster: o.banner, dir: 1 });
    return this;
  };
  W.wallPoster = function (x0, x1, y0, y1, z, color, text) { return this.quad([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], color, { poster: text, dir: 1 }); };

  const S = {};
  const AISLES = [[-6, 'drinks', 'DRINKS', 'AISLE 5'], [-3, 'snacks', 'SNACKS', 'AISLE 4'], [0, 'cans', 'CANNED GOODS', 'AISLE 9'], [3, 'cereal', 'BREAKFAST', 'AISLE 7'], [6, 'mixed', 'HOUSEHOLD', 'AISLE 8']];
  // the whole store interior (aisles + end caps), used behind the checkout and for wide shots
  S.store = (mood = 'day', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 1 });
    w.room(-11, 11, -3, 30, 4.4, { lightRows: [-6, -3, 0, 3, 6], lightGap: 3.0, flicker: o.flicker, backWall: true });
    const gond = [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5];
    gond.forEach((gx, i) => { const kind = AISLES[Math.min(4, i)][1];
      if (i > 0) w.shelves(gx, -1, 6.6, 26, { kind: AISLES[i - 1][1], seed: 10 + i, headerText: AISLES[i - 1][2], lip: i === 3 ? '#E8382F' : '#F2B134' });
      if (i < 5) w.shelves(gx, 1, 6.6, 26, { kind: AISLES[i][1], seed: 20 + i, headerText: AISLES[i][2], lip: i === 2 ? '#E8382F' : '#F2B134' }); });
    // end caps between gondola pairs (the backs of two gondolas form one end cap)
    gond.forEach((gx, i) => w.endcap(gx - 0.6, gx + 0.6, 6.0, { kind: ['drinks', 'snacks', 'cans', 'cereal', 'mixed', 'snacks'][i], seed: 40 + i, banner: ['2 FOR $5', 'SALE!', 'NEW!', 'BIG DEALS', 'SAVE 30%', 'FRESH!'][i], bannerColor: ['#E8382F', '#F2B134', '#2F7BE8', '#E8382F', '#8A4FE0', '#2FA36B'][i] }));
    AISLES.forEach(([x, , , label], i) => w.sign(x, 3.5, 7.5, label, AISLES[i][2], i === 2 ? '#C9302C' : '#1F8A55'));
    w.wallPoster(-10.9, -8.2, 2.4, 3.6, 29.9, '#2F7BE8', 'FRESHMART'); w.wallPoster(7.5, 10.8, 2.4, 3.6, 29.9, '#E8382F', 'LOW PRICES');
    if (o.front !== false) { w.storefront(-11, 11, -2.9); }
    if (o.checkout !== false) { [-5.5, -2.0, 1.5, 5.0].forEach((x, i) => w.checkout(x, x + 2.3, 1.2, { lane: String(i + 2), candy: true, screen: i === 1 ? '$4.79' : '$0.00' })); }
    return w;
  };
  // a single aisle seen down its length (camera inside), with a hanging sign and a back wall
  S.aisle = (kind = 'mixed', mood = 'day', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 3 });
    w.room(-4.5, 4.5, -4, o.len || 24, 4.2, { lightRows: [0], lightGap: 2.4, flicker: o.flicker });
    w.shelves(-1.5, 1, 0, (o.len || 24) - 2, { kind: o.leftKind || kind, seed: (o.seed || 3) + 1, headerText: o.leftHeader || o.header, lip: o.lip, gap: o.gapL });
    w.shelves(1.5, -1, 0, (o.len || 24) - 2, { kind: o.rightKind || kind, seed: (o.seed || 3) + 2, headerText: o.rightHeader || o.header, lip: o.lip, gap: o.gapR });
    if (o.sign) w.sign(0, 3.3, o.signZ || 6, o.sign, o.sub, o.signColor);
    w.wallPoster(-1.4, 1.4, 1.2, 2.6, (o.len || 24) - 0.01, o.posterColor || '#2F7BE8', o.poster || 'FRESHMART');
    return w;
  };
  S.freezer = (mood = 'ice', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 4 });
    w.room(-4, 4, -4, 14, 4.0, { lightRows: [0], lightGap: 2.2 });
    w.freezers(-1.6, 1, 0, 12, { seed: 5, headerText: 'FROZEN FOODS' }); w.freezers(1.6, -1, 0, 12, { seed: 6, headerText: 'ICE CREAM' });
    w.wallPoster(-1.5, 1.5, 0.3, 2.4, 13.99, '#DDF2FB', ''); w.sign(0, 3.1, 5, 'FROZEN', 'DEAD END', '#2F7BE8');
    return w;
  };
  S.stockroom = (mood = 'warm', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 9 });
    w.room(-6, 6, -3, 14, 4.6, { lightRows: [0], lightGap: 4.0, tile: 1.5, flicker: o.flicker, frontWall: true });
    w.doorStrip = w.door(0, -2.98, { label: 'STAFF ONLY', crack: true, color: '#5d636e' });
    w.racks(-3.5, 1, 1, 13, { seed: 2 }); w.racks(3.5, -1, 1, 13, { seed: 3 });
    w.pallet(-1.6, 3.0, 1.2, 1.0, 0.7); w.pallet(0.6, 6.0, 1.1, 1.0, 0.9, '#B98A5A'); w.pallet(-0.6, 9.5, 1.3, 1.1, 1.2, '#C99A66');
    w.wallPoster(-0.8, 0.8, 1.6, 2.2, 13.99, '#C9302C', 'STAFF ONLY');
    return w;
  };
  // customer service corner: the desk (a DOM prop) sits at x ~ 0, z ~ 3; behind it a wall with posters
  S.service = (mood = 'day', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 6 });
    w.room(-7, 7, -3, 9, 4.2, { lightRows: [-2.5, 2.5], lightGap: 2.6, flicker: o.flicker });
    w.box(-2.4, 0, 3.0, 2.4, 0.8, 3.8, '#2F7BE8', { colors: { top: '#5FA8FF', front: '#2F7BE8' } });
    w.quad([[-2.4, 0.22, 2.99], [2.4, 0.22, 2.99], [2.4, 0.66, 2.99], [-2.4, 0.66, 2.99]], '#2F7BE8', { poster: 'CUSTOMER SERVICE', dir: 1 });
    w.wallPoster(-6.9, -3.2, 1.8, 3.4, 8.99, '#F2B134', 'WEEKLY DEALS'); w.wallPoster(3.2, 6.9, 1.8, 3.4, 8.99, '#2FA36B', 'THANK YOU!');
    w.wallPoster(-1.2, 1.2, 2.4, 3.2, 8.99, '#E8382F', 'LOST & FOUND');
    w.endcap(-6.5, -5.0, 5.5, { kind: 'snacks', seed: 8 }); w.endcap(5.0, 6.5, 5.5, { kind: 'drinks', seed: 9 });
    return w;
  };
  // entrance: looking at the storefront glass from inside (outside drawn on a canvas behind)
  S.entrance = (mood = 'day', o = {}) => {
    const w = new WORLD.World({ mood, seed: o.seed || 7 });
    w.room(-8, 8, -6, 6, 4.2, { lightRows: [-3, 3], lightGap: 3, backWall: false, flicker: o.flicker });
    w.storefront(-8, 8, 6);
    return w;
  };
  window.SETS = S;
})();
