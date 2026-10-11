const fs = require("fs");

function parsePath(d) {
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+/gi) || [];
  const subpaths = [];
  let cur = null,
    cx = 0,
    cy = 0,
    sx = 0,
    sy = 0,
    px = 0,
    py = 0;
  let i = 0,
    cmd = null;

  const startSub = (x, y) => {
    cur = [[x, y]];
    subpaths.push(cur);
    sx = x;
    sy = y;
    cx = x;
    cy = y;
  };

  const lineTo = (x, y) => {
    const n = Math.max(1, Math.ceil(Math.hypot(x - cx, y - cy)));
    for (let s = 1; s <= n; s++) {
      const t = s / n;
      cur.push([cx + (x - cx) * t, cy + (y - cy) * t]);
    }
    cx = x;
    cy = y;
  };

  const cubicTo = (c1x, c1y, c2x, c2y, x, y) => {
    for (let s = 1; s <= 64; s++) {
      const t = s / 64,
        mt = 1 - t;
      cur.push([
        mt * mt * mt * cx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * x,
        mt * mt * mt * cy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * y,
      ]);
    }
    px = c2x;
    py = c2y;
    cx = x;
    cy = y;
  };

  while (i < tokens.length) {
    const tok = tokens[i];
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(tok)) {
      cmd = tok;
      i++;
    }
    switch (cmd) {
      case "M": {
        const x = +tokens[i],
          y = +tokens[i + 1];
        i += 2;
        startSub(x, y);
        cmd = "L";
        break;
      }
      case "m": {
        const x = cx + +tokens[i],
          y = cy + +tokens[i + 1];
        i += 2;
        startSub(x, y);
        cmd = "l";
        break;
      }
      case "L": {
        const x = +tokens[i],
          y = +tokens[i + 1];
        i += 2;
        lineTo(x, y);
        break;
      }
      case "l": {
        const x = cx + +tokens[i],
          y = cy + +tokens[i + 1];
        i += 2;
        lineTo(x, y);
        break;
      }
      case "H": {
        lineTo(+tokens[i], cy);
        i += 1;
        break;
      }
      case "h": {
        lineTo(cx + +tokens[i], cy);
        i += 1;
        break;
      }
      case "V": {
        lineTo(cx, +tokens[i]);
        i += 1;
        break;
      }
      case "v": {
        lineTo(cx, cy + +tokens[i]);
        i += 1;
        break;
      }
      case "C": {
        cubicTo(+tokens[i], +tokens[i + 1], +tokens[i + 2], +tokens[i + 3], +tokens[i + 4], +tokens[i + 5]);
        i += 6;
        break;
      }
      case "c": {
        cubicTo(cx + +tokens[i], cy + +tokens[i + 1], cx + +tokens[i + 2], cy + +tokens[i + 3], cx + +tokens[i + 4], cy + +tokens[i + 5]);
        i += 6;
        break;
      }
      case "S": {
        const c2x = +tokens[i],
          c2y = +tokens[i + 1],
          x = +tokens[i + 2],
          y = +tokens[i + 3];
        i += 4;
        cubicTo(2 * cx - px, 2 * cy - py, c2x, c2y, x, y);
        break;
      }
      case "s": {
        const c2x = cx + +tokens[i],
          c2y = cy + +tokens[i + 1],
          x = cx + +tokens[i + 2],
          y = cy + +tokens[i + 3];
        i += 4;
        cubicTo(2 * cx - px, 2 * cy - py, c2x, c2y, x, y);
        break;
      }
      case "Z":
      case "z": {
        if (cur) lineTo(sx, sy);
        break;
      }
      default: {
        i++;
      }
    }
  }
  return subpaths;
}

function renderGrid(ds, box, cols, rows) {
  const [bx, by, bw, bh] = box;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  const kx = cols / bw,
    ky = rows / bh;

  const seg = (x0, y0, x1, y1) => {
    const c0 = (x0 - bx) * kx,
      r0 = (y0 - by) * ky,
      c1 = (x1 - bx) * kx,
      r1 = (y1 - by) * ky;
    const n = Math.max(1, Math.ceil(Math.hypot(c1 - c0, r1 - r0)));
    for (let s = 0; s <= n; s++) {
      const t = s / n;
      const c = Math.round(c0 + (c1 - c0) * t),
        r = Math.round(r0 + (r1 - r0) * t);
      if (c >= 0 && c < cols && r >= 0 && r < rows) grid[r][c] = true;
    }
  };

  for (const d of ds) {
    const subs = parsePath(d);
    for (const sub of subs)
      for (let j = 1; j < sub.length; j++) seg(sub[j - 1][0], sub[j - 1][1], sub[j][0], sub[j][1]);
  }
  return grid.map((row) => row.map((v) => (v ? "#" : " ")).join("")).join("\n");
}

const svg = fs.readFileSync("public/images/brand/wordmark-trace.svg", "utf8");
const ds = (svg.match(/d="([^"]*)"/g) || []).map((m) => m.slice(3, -1));

console.log("===== FIXED WORDMARK (full size, 100x74) =====");
console.log(renderGrid(ds, [0, 0, 700, 260], 100, 74));

const firstSub = ds[0].match(/^M[^M]*/)[0];
console.log("\n===== S AT NAVBAR SIZE (~34px tall) =====");
console.log(renderGrid([firstSub], [30, 58, 125, 122], 30, 9));
console.log("\n===== S AT MEDIUM SIZE =====");
console.log(renderGrid([firstSub], [30, 58, 125, 122], 44, 14));
