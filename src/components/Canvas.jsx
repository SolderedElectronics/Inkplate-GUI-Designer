import { useRef, useEffect, useLayoutEffect, useCallback, useState } from "react";
import { useApp, ENTITY_TYPES, COLOR_MODES, placeAtParams } from "../context/AppContext";

const HANDLE_SIZE = 8; // canvas px

function colorToCSS(color, colorMode) {
  const palette = COLOR_MODES[colorMode] ?? COLOR_MODES["3bit"];
  return palette[Math.max(0, Math.min(color ?? 0, palette.length - 1))].css;
}

// ─── Resize handles ────────────────────────────────────────────────────────
function getHandles(entity) {
  const p = entity.params;
  switch (entity.type) {
    case ENTITY_TYPES.CIRCLE:
      return [
        { id: "r", x: p.cx + p.radius, y: p.cy },
        { id: "l", x: p.cx - p.radius, y: p.cy },
        { id: "t", x: p.cx, y: p.cy - p.radius },
        { id: "b", x: p.cx, y: p.cy + p.radius },
      ];
    case ENTITY_TYPES.RECTANGLE:
    case ENTITY_TYPES.ROUND_RECT:
    case ENTITY_TYPES.BITMAP:
    case ENTITY_TYPES.GRAPH:
    case ENTITY_TYPES.TEXT:
      return [
        { id: "tl", x: p.x, y: p.y },
        { id: "tr", x: p.x + p.width, y: p.y },
        { id: "bl", x: p.x, y: p.y + p.height },
        { id: "br", x: p.x + p.width, y: p.y + p.height },
        { id: "tm", x: p.x + p.width / 2, y: p.y },
        { id: "bm", x: p.x + p.width / 2, y: p.y + p.height },
        { id: "ml", x: p.x, y: p.y + p.height / 2 },
        { id: "mr", x: p.x + p.width, y: p.y + p.height / 2 },
      ];
    case ENTITY_TYPES.LINE:
      return [
        { id: "p0", x: p.x0, y: p.y0 },
        { id: "p1", x: p.x1, y: p.y1 },
      ];
    case ENTITY_TYPES.TRIANGLE:
      return [
        { id: "v0", x: p.x0, y: p.y0 },
        { id: "v1", x: p.x1, y: p.y1 },
        { id: "v2", x: p.x2, y: p.y2 },
      ];
    case ENTITY_TYPES.CLOCK:
      return [{ id: "r", x: p.x + p.radius, y: p.y }];
    default:
      return [];
  }
}

function applyHandleDrag(entity, handleId, dx, dy) {
  const p = { ...entity.params };
  const ri = (v) => Math.round(v);

  switch (entity.type) {
    case ENTITY_TYPES.CIRCLE:
      if (handleId === "r") p.radius = Math.max(1, ri(p.radius + dx));
      if (handleId === "l") p.radius = Math.max(1, ri(p.radius - dx));
      if (handleId === "b") p.radius = Math.max(1, ri(p.radius + dy));
      if (handleId === "t") p.radius = Math.max(1, ri(p.radius - dy));
      return p;

    case ENTITY_TYPES.RECTANGLE:
    case ENTITY_TYPES.ROUND_RECT:
    case ENTITY_TYPES.BITMAP:
    case ENTITY_TYPES.GRAPH:
    case ENTITY_TYPES.TEXT:
      if (handleId.includes("l")) {
        p.width = Math.max(1, ri(p.width - dx));
        p.x = ri(p.x + dx);
      }
      if (handleId.includes("r")) {
        p.width = Math.max(1, ri(p.width + dx));
      }
      if (handleId.includes("t")) {
        p.height = Math.max(1, ri(p.height - dy));
        p.y = ri(p.y + dy);
      }
      if (handleId.includes("b")) {
        p.height = Math.max(1, ri(p.height + dy));
      }
      return p;

    case ENTITY_TYPES.LINE:
      if (handleId === "p0") {
        p.x0 = ri(p.x0 + dx);
        p.y0 = ri(p.y0 + dy);
      }
      if (handleId === "p1") {
        p.x1 = ri(p.x1 + dx);
        p.y1 = ri(p.y1 + dy);
      }
      return p;

    case ENTITY_TYPES.TRIANGLE: {
      const n = handleId[1]; // "0" | "1" | "2"
      p[`x${n}`] = ri(p[`x${n}`] + dx);
      p[`y${n}`] = ri(p[`y${n}`] + dy);
      return p;
    }

    case ENTITY_TYPES.CLOCK:
      if (handleId === "r") p.radius = Math.max(1, ri(p.radius + dx));
      return p;

    default:
      return p;
  }
}

// ─── Shift-constrained resize ─────────────────────────────────────────────
const RATIO_TYPES = new Set([
  ENTITY_TYPES.RECTANGLE,
  ENTITY_TYPES.ROUND_RECT,
  ENTITY_TYPES.BITMAP,
  ENTITY_TYPES.GRAPH,
  ENTITY_TYPES.TEXT,
]);

function constrainedResize(startParams, handleId, totalDx, totalDy) {
  const sp = startParams;
  const ri = Math.round;
  const ratio = sp.width / sp.height;
  let newW = sp.width, newH = sp.height, newX = sp.x, newY = sp.y;

  if (handleId.includes("l")) { newW = Math.max(1, sp.width - totalDx); newX = sp.x + totalDx; }
  if (handleId.includes("r")) { newW = Math.max(1, sp.width + totalDx); }
  if (handleId.includes("t")) { newH = Math.max(1, sp.height - totalDy); newY = sp.y + totalDy; }
  if (handleId.includes("b")) { newH = Math.max(1, sp.height + totalDy); }

  const isCorner =
    (handleId.includes("l") || handleId.includes("r")) &&
    (handleId.includes("t") || handleId.includes("b"));

  if (isCorner) {
    if (Math.abs(newW - sp.width) >= Math.abs(newH - sp.height)) {
      const ch = Math.max(1, ri(newW / ratio));
      if (handleId.includes("t")) newY = sp.y + (sp.height - ch);
      newH = ch;
    } else {
      const cw = Math.max(1, ri(newH * ratio));
      if (handleId.includes("l")) newX = sp.x + (sp.width - cw);
      newW = cw;
    }
  } else if (handleId === "tm" || handleId === "bm") {
    newW = Math.max(1, ri(newH * ratio));
  } else {
    newH = Math.max(1, ri(newW / ratio));
  }

  return { ...sp, width: ri(newW), height: ri(newH), x: ri(newX), y: ri(newY) };
}

// ─── Bitmap quantization ───────────────────────────────────────────────────
const quantizeCache = new Map(); // key: `${src}:${colorMode}` → HTMLCanvasElement

function cssToRGB(css) {
  if (css.startsWith("#")) {
    const h = css.slice(1);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const m = css.match(/(\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
}

function quantizeImage(src, colorMode, onReady) {
  const key = `${src}:${colorMode}`;
  if (quantizeCache.has(key)) { onReady(quantizeCache.get(key)); return; }
  const palette = (COLOR_MODES[colorMode] ?? COLOR_MODES["3bit"]).map((c) => cssToRGB(c.css));
  const img = new Image();
  img.onload = () => {
    const off = document.createElement("canvas");
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const octx = off.getContext("2d");
    octx.drawImage(img, 0, 0);
    const imageData = octx.getImageData(0, 0, off.width, off.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      let best = 0, bestDist = Infinity;
      for (let j = 0; j < palette.length; j++) {
        const dr = d[i] - palette[j][0], dg = d[i + 1] - palette[j][1], db = d[i + 2] - palette[j][2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) { bestDist = dist; best = j; }
      }
      d[i] = palette[best][0]; d[i + 1] = palette[best][1]; d[i + 2] = palette[best][2];
    }
    octx.putImageData(imageData, 0, 0);
    quantizeCache.set(key, off);
    onReady(off);
  };
  img.src = src;
}

// ─── Canvas rendering ──────────────────────────────────────────────────────
function renderEntity(ctx, entity, colorMode, onImageReady = () => {}) {
  const p = entity.params;
  const c = colorToCSS(p.color, colorMode);
  ctx.strokeStyle = c;
  ctx.fillStyle = c;
  ctx.lineWidth = p.thickness ?? 1;

  switch (entity.type) {
    case ENTITY_TYPES.LINE:
      if (p.gradient) {
        const grad = ctx.createLinearGradient(p.x0, p.y0, p.x1, p.y1);
        grad.addColorStop(0, c);
        grad.addColorStop(1, colorToCSS(p.colorEnd ?? p.color, colorMode));
        ctx.strokeStyle = grad;
      }
      ctx.beginPath();
      ctx.moveTo(p.x0, p.y0);
      ctx.lineTo(p.x1, p.y1);
      ctx.stroke();
      break;
    case ENTITY_TYPES.RECTANGLE:
      if (p.fill) ctx.fillRect(p.x, p.y, p.width, p.height);
      else ctx.strokeRect(p.x, p.y, p.width, p.height);
      break;
    case ENTITY_TYPES.ROUND_RECT: {
      const r = Math.min(p.borderRadius ?? 0, p.width / 2, p.height / 2);
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, r);
      if (p.fill) ctx.fill();
      else ctx.stroke();
      break;
    }
    case ENTITY_TYPES.CIRCLE:
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, p.radius, 0, Math.PI * 2);
      if (p.fill) ctx.fill();
      else ctx.stroke();
      break;
    case ENTITY_TYPES.TRIANGLE:
      ctx.beginPath();
      ctx.moveTo(p.x0, p.y0);
      ctx.lineTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.closePath();
      if (p.fill) ctx.fill();
      else ctx.stroke();
      break;
    case ENTITY_TYPES.TEXT: {
      const size = (p.fontSize ?? 2) * 8;
      const boxW = p.width ?? 200;
      const boxH = p.height ?? 60;
      ctx.font = `${size}px "Courier New", monospace`;
      const words = (p.text ?? "").split(" ");
      const lines = [];
      let cur = words[0] ?? "";
      for (let i = 1; i < words.length; i++) {
        const test = cur + " " + words[i];
        if (ctx.measureText(test).width <= boxW) cur = test;
        else { lines.push(cur); cur = words[i]; }
      }
      if (cur) lines.push(cur);
      ctx.save();
      ctx.beginPath();
      ctx.rect(p.x, p.y, boxW, boxH);
      ctx.clip();
      lines.forEach((line, i) => ctx.fillText(line, p.x, p.y + size + i * size));
      ctx.restore();
      break;
    }
    case ENTITY_TYPES.BITMAP: {
      const key = `${p.src}:${colorMode}`;
      if (p.src && quantizeCache.has(key)) {
        ctx.drawImage(quantizeCache.get(key), p.x, p.y, p.width, p.height);
      } else {
        ctx.strokeStyle = "#aaa";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(p.x, p.y, p.width, p.height);
        ctx.setLineDash([]);
        ctx.font = "10px monospace";
        ctx.fillStyle = "#aaa";
        ctx.fillText(p.src ? "Loading…" : "Bitmap", p.x + 4, p.y + 14);
        if (p.src) quantizeImage(p.src, colorMode, onImageReady);
      }
      break;
    }
    case ENTITY_TYPES.GRAPH: {
      const n = p.n ?? 32;
      let data = p.data && p.data.length > 0 ? p.data : null;
      if (!data) {
        data = Array.from({ length: n }, (_, i) => Math.sin(Math.PI * 3 * i / n));
      }
      const textMargin = 68;
      const x1 = p.x, y1 = p.y;
      const x2 = p.x + p.width, y2 = p.y + p.height;
      const minData = Math.min(...data);
      const maxData = Math.max(...data);
      const span = Math.max(0.3, Math.abs(maxData - minData));
      const pts = data.map((v, i) => ({
        x: x1 + i * (x2 - x1 - textMargin) / n,
        y: y2 - (v - minData) * Math.abs(y2 - y1) / span,
      }));
      // Gradient fill under line
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, y2);
      for (const pt of pts) ctx.lineTo(pt.x, pt.y);
      ctx.lineTo(pts[pts.length - 1].x, y2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = c;
      ctx.fillStyle = c;
      // Grid: 4 horizontal lines + axis labels
      ctx.lineWidth = 0.5;
      ctx.font = "9px monospace";
      for (let i = 0; i < 4; i++) {
        const gy = y1 + i * (y2 - y1) / 4;
        ctx.beginPath();
        ctx.moveTo(x1, gy);
        ctx.lineTo(x2, gy);
        ctx.stroke();
        const val = (minData + (maxData - minData) * (4 - i) / 4).toFixed(2);
        ctx.fillText(val, x2 - textMargin + 4, gy + 10);
      }
      // 5 vertical lines
      for (let i = 0; i < 5; i++) {
        const gx = x1 + i * (x2 - x1) / 5;
        ctx.beginPath();
        ctx.moveTo(gx, y1);
        ctx.lineTo(gx, y2);
        ctx.stroke();
      }
      // Separator before label area
      ctx.beginPath();
      ctx.moveTo(x2 - textMargin + 2, y1);
      ctx.lineTo(x2 - textMargin + 2, y2);
      ctx.stroke();
      // Data line
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      // Bottom border
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y2);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      break;
    }
    case ENTITY_TYPES.CLOCK: {
      const cx = p.x, cy = p.y, r = p.radius;
      const h = p.h ?? 10;
      const m = p.m ?? 10;
      const r0 = r * 0.55;
      const r1 = r * 0.65;
      const r2 = r * 0.9;
      const r3 = r * 1.0;
      // Outer circle
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      // Tick marks
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const cos = Math.cos(angle), sin = Math.sin(angle);
        if (i % 5 === 0) {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx + r1 * cos, cy + r1 * sin);
          ctx.lineTo(cx + r3 * cos, cy + r3 * sin);
          ctx.stroke();
        } else if (r > 75) {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + r1 * cos, cy + r1 * sin);
          ctx.lineTo(cx + r2 * cos, cy + r2 * sin);
          ctx.stroke();
        }
      }
      // Hour hand: angle = (h - 3 + m/60) / 12 * 2π
      const hAngle = (h - 3 + m / 60) / 12 * Math.PI * 2;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r0 * Math.cos(hAngle), cy + r0 * Math.sin(hAngle));
      ctx.stroke();
      // Minute hand: angle = (m - 15) / 60 * 2π
      const mAngle = (m - 15) / 60 * Math.PI * 2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r2 * Math.cos(mAngle), cy + r2 * Math.sin(mAngle));
      ctx.stroke();
      break;
    }
    case ENTITY_TYPES.DIGITAL_CLOCK: {
      const h = p.h ?? 10;
      const m = p.m ?? 10;
      const size = (p.fontSize ?? 8) * 8;
      const bitmask = [119, 48, 93, 121, 58, 107, 111, 49, 127, 59];
      const triangleX = [83, 101, 108, 101, 108, 277, 101, 108, 277, 257, 277, 108, 257, 277, 286, 76, 60, 98, 60, 98, 80, 80, 39, 60, 80, 39, 55, 31, 55, 73, 31, 73, 52, 31, 9, 52, 9, 52, 20, 61, 86, 80, 86, 80, 233, 233, 227, 80, 233, 227, 252, 260, 292, 305, 305, 260, 240, 305, 281, 240, 240, 281, 260, 259, 234, 276, 234, 276, 256, 256, 214, 234, 214, 256, 237, 38, 27, 60, 38, 60, 207, 207, 38, 212, 212, 207, 230];
      const triangleY = [30, 13, 60, 13, 60, 14, 13, 60, 14, 57, 14, 60, 57, 14, 29, 36, 47, 61, 47, 61, 198, 198, 201, 47, 198, 201, 219, 252, 232, 253, 252, 253, 390, 252, 406, 390, 406, 390, 416, 227, 202, 249, 202, 249, 203, 203, 247, 249, 203, 247, 224, 60, 35, 49, 49, 60, 200, 50, 201, 200, 200, 201, 220, 231, 252, 252, 252, 252, 403, 403, 390, 252, 390, 403, 415, 439, 424, 392, 439, 392, 394, 394, 439, 439, 439, 394, 424];
      const maxX = 310, maxY = 440;
      const digits = [Math.floor(h / 10) % 10, h % 10, Math.floor(m / 10) % 10, m % 10];
      ctx.fillStyle = c;
      for (let i = 0; i < 4; i++) {
        const b = bitmask[digits[i]];
        for (let j = 0; j < triangleX.length; j += 3) {
          if (b & (1 << Math.trunc((j - 1) / 12))) {
            ctx.beginPath();
            ctx.moveTo(i * maxX / maxY * size * 1.1 + p.x + maxX / maxY * size * triangleX[j] / maxX, p.y + size * triangleY[j] / maxY);
            ctx.lineTo(i * maxX / maxY * size * 1.1 + p.x + maxX / maxY * size * triangleX[j + 1] / maxX, p.y + size * triangleY[j + 1] / maxY);
            ctx.lineTo(i * maxX / maxY * size * 1.1 + p.x + maxX / maxY * size * triangleX[j + 2] / maxX, p.y + size * triangleY[j + 2] / maxY);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
      // Colon dots
      const dotR = 0.05 * size;
      const colonX = p.x + 4 * maxX / maxY * size * 1.075 / 2;
      ctx.beginPath();
      ctx.arc(colonX, p.y + size * 0.4, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(colonX, p.y + size * 0.6, dotR, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default:
      break;
  }
}

function renderSelectionAndHandles(ctx, entity) {
  const p = entity.params;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = "#6d28d9";

  // Bounding box
  let bx, by, bw, bh;
  switch (entity.type) {
    case ENTITY_TYPES.CIRCLE:
      bx = p.cx - p.radius - 6;
      by = p.cy - p.radius - 6;
      bw = p.radius * 2 + 12;
      bh = p.radius * 2 + 12;
      break;
    case ENTITY_TYPES.LINE:
      bx = Math.min(p.x0, p.x1) - 4;
      by = Math.min(p.y0, p.y1) - 4;
      bw = Math.abs(p.x1 - p.x0) + 8;
      bh = Math.abs(p.y1 - p.y0) + 8;
      break;
    case ENTITY_TYPES.TRIANGLE:
      bx = Math.min(p.x0, p.x1, p.x2) - 6;
      by = Math.min(p.y0, p.y1, p.y2) - 6;
      bw = Math.max(p.x0, p.x1, p.x2) - bx + 6;
      bh = Math.max(p.y0, p.y1, p.y2) - by + 6;
      break;
    case ENTITY_TYPES.CLOCK:
      bx = p.x - p.radius - 6;
      by = p.y - p.radius - 6;
      bw = p.radius * 2 + 12;
      bh = p.radius * 2 + 12;
      break;
    case ENTITY_TYPES.DIGITAL_CLOCK: {
      const dcSize = (p.fontSize ?? 8) * 8;
      bx = p.x - 6;
      by = p.y - 6;
      bw = Math.round(4 * (310 / 440) * dcSize * 1.1) + 12;
      bh = dcSize + 12;
      break;
    }
    default:
      bx = (p.x ?? p.cx ?? 0) - 6;
      by = (p.y ?? p.cy ?? 0) - 6;
      bw = (p.width ?? (p.radius ? p.radius * 2 : 80)) + 12;
      bh = (p.height ?? (p.radius ? p.radius * 2 : 40)) + 12;
  }
  ctx.strokeRect(bx, by, bw, bh);
  ctx.setLineDash([]);

  // Handles
  const half = HANDLE_SIZE / 2;
  getHandles(entity).forEach((h) => {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#6d28d9";
    ctx.lineWidth = 1.5;
    ctx.fillRect(h.x - half, h.y - half, HANDLE_SIZE, HANDLE_SIZE);
    ctx.strokeRect(h.x - half, h.y - half, HANDLE_SIZE, HANDLE_SIZE);
  });
}

function getEntityBBox(entity) {
  const p = entity.params;
  let bx, by, bw, bh;
  switch (entity.type) {
    case ENTITY_TYPES.CIRCLE:
      bx = p.cx - p.radius - 6; by = p.cy - p.radius - 6;
      bw = p.radius * 2 + 12; bh = p.radius * 2 + 12;
      break;
    case ENTITY_TYPES.LINE:
      bx = Math.min(p.x0, p.x1) - 4; by = Math.min(p.y0, p.y1) - 4;
      bw = Math.abs(p.x1 - p.x0) + 8; bh = Math.abs(p.y1 - p.y0) + 8;
      break;
    case ENTITY_TYPES.TRIANGLE:
      bx = Math.min(p.x0, p.x1, p.x2) - 6; by = Math.min(p.y0, p.y1, p.y2) - 6;
      bw = Math.max(p.x0, p.x1, p.x2) - bx + 6; bh = Math.max(p.y0, p.y1, p.y2) - by + 6;
      break;
    case ENTITY_TYPES.CLOCK:
      bx = p.x - p.radius - 6; by = p.y - p.radius - 6;
      bw = p.radius * 2 + 12; bh = p.radius * 2 + 12;
      break;
    case ENTITY_TYPES.DIGITAL_CLOCK: {
      const dcSize = (p.fontSize ?? 8) * 8;
      bx = p.x - 6; by = p.y - 6;
      bw = Math.round(4 * (310 / 440) * dcSize * 1.1) + 12;
      bh = dcSize + 12;
      break;
    }
    default:
      bx = (p.x ?? p.cx ?? 0) - 6; by = (p.y ?? p.cy ?? 0) - 6;
      bw = (p.width ?? (p.radius ? p.radius * 2 : 80)) + 12;
      bh = (p.height ?? (p.radius ? p.radius * 2 : 40)) + 12;
  }
  return { bx, by, bw, bh };
}

// ─── Hit testing ──────────────────────────────────────────────────────────
function triSign(ax, ay, bx, by, cx, cy) {
  return (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
}
function pointInTriangle(px, py, x0, y0, x1, y1, x2, y2) {
  const d1 = triSign(px, py, x0, y0, x1, y1);
  const d2 = triSign(px, py, x1, y1, x2, y2);
  const d3 = triSign(px, py, x2, y2, x0, y0);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

function hitTest(entity, mx, my) {
  const p = entity.params;
  const pad = 6;
  switch (entity.type) {
    case ENTITY_TYPES.CIRCLE:
      return Math.hypot(mx - p.cx, my - p.cy) <= p.radius + pad;
    case ENTITY_TYPES.LINE: {
      const dx = p.x1 - p.x0,
        dy = p.y1 - p.y0;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) return Math.hypot(mx - p.x0, my - p.y0) <= pad;
      const t = Math.max(
        0,
        Math.min(1, ((mx - p.x0) * dx + (my - p.y0) * dy) / len2),
      );
      return Math.hypot(mx - (p.x0 + t * dx), my - (p.y0 + t * dy)) <= pad;
    }
    case ENTITY_TYPES.TRIANGLE:
      return (
        pointInTriangle(mx, my, p.x0, p.y0, p.x1, p.y1, p.x2, p.y2) ||
        (mx >= Math.min(p.x0, p.x1, p.x2) - pad &&
          mx <= Math.max(p.x0, p.x1, p.x2) + pad &&
          my >= Math.min(p.y0, p.y1, p.y2) - pad &&
          my <= Math.max(p.y0, p.y1, p.y2) + pad)
      );
    case ENTITY_TYPES.CLOCK:
      return Math.hypot(mx - p.x, my - p.y) <= p.radius + pad;
    case ENTITY_TYPES.DIGITAL_CLOCK: {
      const dcSize = (p.fontSize ?? 8) * 8;
      const dcW = Math.round(4 * (310 / 440) * dcSize * 1.1);
      return mx >= p.x - pad && mx <= p.x + dcW + pad && my >= p.y - pad && my <= p.y + dcSize + pad;
    }
    default: {
      const ex = p.x ?? p.cx ?? 0;
      const ey = p.y ?? p.cy ?? 0;
      const ew = p.width ?? (p.radius ? p.radius * 2 : 60);
      const eh = p.height ?? (p.radius ? p.radius * 2 : 30);
      return (
        mx >= ex - pad &&
        mx <= ex + ew + pad &&
        my >= ey - pad &&
        my <= ey + eh + pad
      );
    }
  }
}

function hitHandle(handle, mx, my) {
  const half = HANDLE_SIZE / 2 + 3;
  return Math.abs(mx - handle.x) <= half && Math.abs(my - handle.y) <= half;
}

// ─── Component ─────────────────────────────────────────────────────────────
const HANDLE_CURSORS = {
  tl: "nwse-resize",
  br: "nwse-resize",
  tr: "nesw-resize",
  bl: "nesw-resize",
  tm: "ns-resize",
  bm: "ns-resize",
  ml: "ew-resize",
  mr: "ew-resize",
  r: "ew-resize",
  l: "ew-resize",
  t: "ns-resize",
  b: "ns-resize",
  p0: "move",
  p1: "move",
  v0: "move",
  v1: "move",
  v2: "move",
};

export default function Canvas() {
  const canvasRef = useRef(null);
  // { mode:"move"|"resize", id, handleId?, lastX, lastY, accumX, accumY }
  const dragRef = useRef(null);
  const {
    display,
    canvasWidth,
    canvasHeight,
    entities,
    selectedEntityId,
    selectEntity,
    moveEntity,
    updateEntity,
    deleteEntity,
    pushHistory,
    rotation,
    setRotation,
    grid,
    setGrid,
    padding,
    setPadding,
    activeTool,
    toolParams,
    createEntityAt,
    zoom,
    setZoom,
  } = useApp();

  const [hoverPos, setHoverPos] = useState(null);

  const FRAME_PAD = 48; // 24px padding each side of device frame
  const PANEL_W = 400;
  const NAVBAR_H = 46;
  const V_MARGIN = 48; // breathing room top/bottom

  const [bitmapTick, setBitmapTick] = useState(0);

  const [viewport, setViewport] = useState({
    w: window.innerWidth - PANEL_W - FRAME_PAD,
    h: window.innerHeight - NAVBAR_H - FRAME_PAD - V_MARGIN,
  });

  useEffect(() => {
    const onResize = () => setViewport({
      w: window.innerWidth - PANEL_W - FRAME_PAD,
      h: window.innerHeight - NAVBAR_H - FRAME_PAD - V_MARGIN,
    });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      setZoom((prev) => Math.min(8, Math.max(0.1, prev * factor)));
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [setZoom]);

  const cw = canvasWidth;
  const ch = canvasHeight;
  const fitScale = Math.min(viewport.w / cw, viewport.h / ch);
  const scale = fitScale * zoom;

  // ── Draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    void bitmapTick; // version counter — forces redraw when bitmap images finish loading
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f0efeb";
    ctx.fillRect(0, 0, cw, ch);
    if (grid.enabled) {
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let gx = 0; gx <= cw; gx += grid.size) { ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); }
      for (let gy = 0; gy <= ch; gy += grid.size) { ctx.moveTo(0, gy); ctx.lineTo(cw, gy); }
      ctx.stroke();
    }
    if (padding.enabled) {
      const p = padding.size;
      ctx.save();
      ctx.strokeStyle = "rgba(59,130,246,0.6)";
      ctx.lineWidth = 0.75;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(p, p, cw - p * 2, ch - p * 2);
      ctx.restore();
    }
    const colorMode = display.colorMode ?? "3bit";
    const onImageReady = () => setBitmapTick((t) => t + 1);
    entities.forEach((entity) => {
      renderEntity(ctx, entity, colorMode, onImageReady);
      if (entity.id === selectedEntityId)
        renderSelectionAndHandles(ctx, entity);
    });
    if (activeTool && activeTool !== ENTITY_TYPES.SELECT && hoverPos) {
      const ghostParams = placeAtParams(activeTool, toolParams, hoverPos.x, hoverPos.y);
      const ghostEntity = { id: "__ghost__", type: activeTool, params: ghostParams };
      ctx.save();
      ctx.globalAlpha = 0.4;
      renderEntity(ctx, ghostEntity, colorMode, () => {});
      ctx.restore();
    }
  }, [entities, selectedEntityId, cw, ch, grid, padding, display, bitmapTick, activeTool, toolParams, hoverPos]);

  useLayoutEffect(() => {
    draw();
  }, [draw]);

  // ── Pointer helpers ────────────────────────────────────────────────────────
  const toCanvas = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handlePointerDown = (e) => {
    const { x, y } = toCanvas(e);
    const isSelectMode = activeTool === ENTITY_TYPES.SELECT;

    if (isSelectMode) {
      // 1. Handles of selected entity take priority
      if (selectedEntityId) {
        const sel = entities.find((en) => en.id === selectedEntityId);
        if (sel) {
          for (const h of getHandles(sel)) {
            if (hitHandle(h, x, y)) {
              pushHistory();
              dragRef.current = {
                mode: "resize",
                id: sel.id,
                handleId: h.id,
                lastX: x,
                lastY: y,
                startX: x,
                startY: y,
                startHandleX: h.x,
                startHandleY: h.y,
                startParams: { ...sel.params },
                appliedDx: 0,
                appliedDy: 0,
                accumX: 0,
                accumY: 0,
              };
              canvasRef.current.setPointerCapture(e.pointerId);
              return;
            }
          }
        }
      }

      // 2. Entity body
      for (let i = entities.length - 1; i >= 0; i--) {
        if (hitTest(entities[i], x, y)) {
          selectEntity(entities[i].id);
          pushHistory();
          const ep = entities[i].params;
          dragRef.current = {
            mode: "move",
            id: entities[i].id,
            lastX: x,
            lastY: y,
            startX: x,
            startY: y,
            accumX: 0,
            accumY: 0,
            anchorX: ep.x ?? ep.cx ?? ep.x0 ?? ep.pixels?.[0]?.x ?? 0,
            anchorY: ep.y ?? ep.cy ?? ep.y0 ?? ep.pixels?.[0]?.y ?? 0,
          };
          canvasRef.current.setPointerCapture(e.pointerId);
          return;
        }
      }

      // Click on empty space → deselect
      selectEntity(null);
      return;
    }

    // Drawing mode: always create, never select existing entities
    createEntityAt(x, y);
  };

  const handlePointerMove = (e) => {
    const { x, y } = toCanvas(e);

    const dr = dragRef.current;

    // Update cursor and ghost even when not dragging
    if (!dr) {
      const isSelectMode = activeTool === ENTITY_TYPES.SELECT;
      if (!isSelectMode) setHoverPos({ x, y });
      else setHoverPos(null);

      if (isSelectMode) {
        if (selectedEntityId) {
          const sel = entities.find((en) => en.id === selectedEntityId);
          if (sel) {
            for (const h of getHandles(sel)) {
              if (hitHandle(h, x, y)) {
                canvasRef.current.style.cursor = HANDLE_CURSORS[h.id] ?? "default";
                return;
              }
            }
          }
        }
        for (let i = entities.length - 1; i >= 0; i--) {
          if (hitTest(entities[i], x, y)) {
            canvasRef.current.style.cursor = "move";
            return;
          }
        }
        canvasRef.current.style.cursor = "default";
        return;
      }

      canvasRef.current.style.cursor = "crosshair";
      return;
    }
    setHoverPos(null);

    // Shift-constrained resize — absolute from startParams, no accumulator
    if (dr.mode === "resize" && e.shiftKey) {
      const entity = entities.find((en) => en.id === dr.id);
      if (entity && RATIO_TYPES.has(entity.type) && dr.startParams) {
        if (grid.enabled) {
          const snap = grid.size;
          const snappedDx = Math.round((dr.startHandleX + x - dr.startX) / snap) * snap - dr.startHandleX;
          const snappedDy = Math.round((dr.startHandleY + y - dr.startY) / snap) * snap - dr.startHandleY;
          updateEntity(dr.id, constrainedResize(dr.startParams, dr.handleId, snappedDx, snappedDy));
        } else {
          updateEntity(dr.id, constrainedResize(dr.startParams, dr.handleId, x - dr.startX, y - dr.startY));
        }
        dr.lastX = x; dr.lastY = y; dr.accumX = 0; dr.accumY = 0;
        return;
      }
    }

    // Sub-pixel accumulator → integer deltas
    dr.accumX += x - dr.lastX;
    dr.accumY += y - dr.lastY;
    dr.lastX = x;
    dr.lastY = y;

    const dx = Math.round(dr.accumX);
    const dy = Math.round(dr.accumY);
    if (dx === 0 && dy === 0) return;
    dr.accumX -= dx;
    dr.accumY -= dy;

    if (dr.mode === "move") {
      const totalDx = x - dr.startX;
      const totalDy = y - dr.startY;
      let targetX = dr.anchorX + totalDx;
      let targetY = dr.anchorY + totalDy;

      if (grid.enabled) {
        const snap = grid.size;
        targetX = Math.round(targetX / snap) * snap;
        targetY = Math.round(targetY / snap) * snap;
      } else {
        targetX = Math.round(targetX);
        targetY = Math.round(targetY);
      }

      if (padding.enabled) {
        const ps = padding.size;
        const THRESH = 8;
        for (const bx of [ps, cw - ps]) {
          if (Math.abs(targetX - bx) <= THRESH) { targetX = bx; break; }
        }
        for (const by of [ps, ch - ps]) {
          if (Math.abs(targetY - by) <= THRESH) { targetY = by; break; }
        }
      }

      const entity = entities.find((en) => en.id === dr.id);
      if (!entity) return;
      const ep = entity.params;
      const curX = ep.x ?? ep.cx ?? ep.x0 ?? 0;
      const curY = ep.y ?? ep.cy ?? ep.y0 ?? 0;
      const sdx = targetX - curX;
      const sdy = targetY - curY;
      if (sdx !== 0 || sdy !== 0) moveEntity(dr.id, sdx, sdy);
    } else {
      const entity = entities.find((en) => en.id === dr.id);
      if (!entity) return;
      if (grid.enabled) {
        const snap = grid.size;
        const snappedDx = Math.round((dr.startHandleX + x - dr.startX) / snap) * snap - dr.startHandleX;
        const snappedDy = Math.round((dr.startHandleY + y - dr.startY) / snap) * snap - dr.startHandleY;
        const ddx = snappedDx - dr.appliedDx;
        const ddy = snappedDy - dr.appliedDy;
        if (ddx !== 0 || ddy !== 0) {
          dr.appliedDx = snappedDx;
          dr.appliedDy = snappedDy;
          updateEntity(dr.id, applyHandleDrag(entity, dr.handleId, ddx, ddy));
        }
      } else {
        updateEntity(dr.id, applyHandleDrag(entity, dr.handleId, dx, dy));
      }
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handlePointerLeave = () => {
    setHoverPos(null);
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-400 overflow-auto">
        <div className="min-h-full min-w-full flex items-center justify-center p-6">
          <div
            className="relative shadow-2xl"
            style={{
              padding: "24px",
              background: "linear-gradient(145deg, #888, #666)",
              borderRadius: "8px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
            }}
          >
            <canvas
              ref={canvasRef}
              width={cw}
              height={ch}
              style={{
                display: "block",
                width: cw * scale,
                height: ch * scale,
                imageRendering: "pixelated",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            />
            {selectedEntityId && (() => {
              const sel = entities.find((e) => e.id === selectedEntityId);
              if (!sel) return null;
              const { bx, by, bw } = getEntityBBox(sel);
              const CANVAS_PAD = 24;
              const btnX = CANVAS_PAD + (bx + bw) * scale + 10;
              const btnY = CANVAS_PAD + by * scale - 10;
              return (
                <button
                  key={selectedEntityId}
                  onPointerDown={(e) => { e.stopPropagation(); deleteEntity(selectedEntityId); }}
                  style={{
                    position: "absolute",
                    left: btnX,
                    top: btnY,
                    transform: "translate(-50%, -50%)",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    zIndex: 10,
                  }}
                >
                  ×
                </button>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Canvas controls bottom bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-1.5 bg-gray-900/85 backdrop-blur-sm rounded-full text-white text-xs font-mono shadow-lg select-none whitespace-nowrap">
        {/* Rotation */}
        {[0, 1, 2, 3].map((r) => (
          <button
            key={r}
            onClick={() => setRotation(r)}
            title={`${r * 90}°`}
            className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
              rotation === r ? "bg-violet-500 text-white" : "text-gray-400 hover:bg-white/15 hover:text-white"
            }`}
          >
            {r * 90}°
          </button>
        ))}

        <span className="text-gray-600 mx-1">|</span>

        {/* Grid */}
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={grid.enabled}
            onChange={(e) => setGrid((g) => ({ ...g, enabled: e.target.checked }))}
            className="w-3 h-3 accent-yellow-400"
          />
          <span className="text-gray-300">Grid</span>
        </label>
        <input
          type="number"
          min={10}
          max={50}
          value={grid.size}
          onChange={(e) => setGrid((g) => ({ ...g, size: Math.max(10, parseInt(e.target.value) || 10) }))}
          className="w-10 text-center bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white"
        />

        <span className="text-gray-600 mx-1">|</span>

        {/* Padding */}
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={padding.enabled}
            onChange={(e) => setPadding((p) => ({ ...p, enabled: e.target.checked }))}
            className="w-3 h-3 accent-blue-400"
          />
          <span className="text-gray-300">Padding</span>
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={padding.size}
          onChange={(e) => setPadding((p) => ({ ...p, size: Math.max(1, parseInt(e.target.value) || 1) }))}
          className="w-10 text-center bg-white/10 border border-white/20 rounded px-1 py-0.5 text-white"
        />

        <span className="text-gray-600 mx-1">|</span>

        {/* Zoom */}
        <button
          onClick={() => setZoom((z) => Math.max(0.1, z / 1.25))}
          className="px-1.5 py-0.5 rounded cursor-pointer hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-gray-200">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(8, z * 1.25))}
          className="px-1.5 py-0.5 rounded cursor-pointer hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-0.5 rounded cursor-pointer hover:bg-white/15 text-gray-400 hover:text-white transition-colors ml-0.5"
        >
          1:1
        </button>

        <span className="text-gray-600 mx-1">|</span>
        <span className="text-gray-500">{canvasWidth} × {canvasHeight}</span>
      </div>
    </div>
  );
}
