import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

// ─── Color modes ───────────────────────────────────────────────────────────
export const COLOR_MODES: Record<string, { label: string; css: string }[]> = {
  "1bit": [
    { label: "Black", css: "#000000" },
    { label: "White", css: "#ffffff" },
  ],
  "3bit": Array.from({ length: 8 }, (_, i) => ({
    label: i === 0 ? "Black" : i === 7 ? "White" : `Gray ${i}`,
    css: `rgb(${Math.round((i / 7) * 255)},${Math.round((i / 7) * 255)},${Math.round((i / 7) * 255)})`,
  })),
  "bwr": [
    { label: "Black", css: "#000000" },
    { label: "White", css: "#ffffff" },
    { label: "Red",   css: "#cc0000" },
  ],
  "7color": [
    { label: "Black",  css: "#000000" },
    { label: "White",  css: "#ffffff" },
    { label: "Green",  css: "#007800" },
    { label: "Blue",   css: "#0000c8" },
    { label: "Red",    css: "#c80000" },
    { label: "Yellow", css: "#f0e000" },
    { label: "Orange", css: "#c87800" },
  ],
  "6color": [
    { label: "Black",  css: "#000000" },
    { label: "White",  css: "#ffffff" },
    { label: "Yellow", css: "#f0e000" },
    { label: "Red",    css: "#c80000" },
    { label: "Blue",   css: "#0000c8" },
    { label: "Green",  css: "#007800" },
  ],
};

// ─── Display configurations ────────────────────────────────────────────────
export const DISPLAYS = {
  inkplate2:         { label: "Inkplate 2",        width: 212,  height: 104,  colorMode: "bwr"    },
  inkplate4:         { label: "Inkplate 4",        width: 400,  height: 300,  colorMode: "bwr"    },
  inkplate4tempera:  { label: "Inkplate 4TEMPERA", width: 600,  height: 600,  colorMode: "3bit"   },
  inkplate5:         { label: "Inkplate 5",        width: 960,  height: 540,  colorMode: "3bit"   },
  inkplate5v2:       { label: "Inkplate 5V2",      width: 1280, height: 720,  colorMode: "3bit"   },
  inkplate6:         { label: "Inkplate 6",        width: 800,  height: 600,  colorMode: "3bit"   },
  inkplate6color:    { label: "Inkplate 6COLOR",   width: 600,  height: 448,  colorMode: "7color" },
  inkplate6flick:    { label: "Inkplate 6FLICK",   width: 1024, height: 758,  colorMode: "3bit"   },
  inkplate6motion:   { label: "Inkplate 6MOTION",  width: 1024, height: 758,  colorMode: "3bit"   },
  inkplate6plus:     { label: "Inkplate 6PLUS",    width: 1024, height: 758,  colorMode: "3bit"   },
  inkplate7:         { label: "Inkplate 7",        width: 640,  height: 384,  colorMode: "bwr"    },
  inkplate10:        { label: "Inkplate 10",       width: 1200, height: 825,  colorMode: "3bit"   },
  inkplate13spectra: { label: "Inkplate 13SPECTRA",width: 1600, height: 1200, colorMode: "6color" },
};

// ─── Entity type definitions ───────────────────────────────────────────────
export const ENTITY_TYPES = {
  SELECT: "Select",
  // Shapes
  LINE: "Line",
  RECTANGLE: "Rectangle",
  ROUND_RECT: "Round rect",
  CIRCLE: "Circle",
  TRIANGLE: "Triangle",
  TEXT: "Text",
  BITMAP: "Bitmap",
  // Widgets
  GRAPH: "Graph",
  CLOCK: "Clock",
  DIGITAL_CLOCK: "Digital clock",
};

// Default params per entity type
export const DEFAULT_PARAMS = {
  [ENTITY_TYPES.LINE]: {
    x0: 50,
    y0: 50,
    x1: 200,
    y1: 200,
    color: 0,
    thickness: 1,
    gradient: false,
    colorEnd: 0,
  },
  [ENTITY_TYPES.RECTANGLE]: {
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    color: 0,
    fill: false,
  },
  [ENTITY_TYPES.ROUND_RECT]: {
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    borderRadius: 16,
    color: 0,
    fill: false,
  },
  [ENTITY_TYPES.CIRCLE]: {
    cx: 400,
    cy: 300,
    radius: 100,
    color: 0,
    fill: false,
  },
  [ENTITY_TYPES.TRIANGLE]: {
    x0: 100,
    y0: 300,
    x1: 200,
    y1: 100,
    x2: 300,
    y2: 300,
    color: 0,
    fill: false,
  },
  [ENTITY_TYPES.TEXT]: {
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    text: "Hello!",
    fontSize: 2,
    color: 0,
  },
  [ENTITY_TYPES.BITMAP]: { x: 0, y: 0, width: 100, height: 100, data: "" },
  [ENTITY_TYPES.GRAPH]: { x: 50, y: 50, width: 300, height: 200, color: 0, n: 32, data: [] },
  [ENTITY_TYPES.CLOCK]: { x: 100, y: 100, radius: 80, color: 0, h: 10, m: 10 },
  [ENTITY_TYPES.DIGITAL_CLOCK]: { x: 100, y: 100, fontSize: 8, color: 0, h: 10, m: 10 },
};

// ─── Placement helpers ─────────────────────────────────────────────────────
export function placeAtParams(type: string, params: Record<string, any>, x: number, y: number): Record<string, any> {
  const p = { ...params };
  const rx = Math.round(x);
  const ry = Math.round(y);
  switch (type) {
    case ENTITY_TYPES.LINE: {
      const hdx = Math.round((p.x1 - p.x0) / 2);
      const hdy = Math.round((p.y1 - p.y0) / 2);
      return { ...p, x0: rx - hdx, y0: ry - hdy, x1: rx + hdx, y1: ry + hdy };
    }
    case ENTITY_TYPES.RECTANGLE:
    case ENTITY_TYPES.ROUND_RECT:
    case ENTITY_TYPES.BITMAP:
    case ENTITY_TYPES.GRAPH:
    case ENTITY_TYPES.TEXT:
      return { ...p, x: Math.round(rx - p.width / 2), y: Math.round(ry - p.height / 2) };
    case ENTITY_TYPES.CIRCLE:
      return { ...p, cx: rx, cy: ry };
    case ENTITY_TYPES.CLOCK:
      return { ...p, x: rx, y: ry };
    case ENTITY_TYPES.TRIANGLE: {
      const tcx = Math.round((p.x0 + p.x1 + p.x2) / 3);
      const tcy = Math.round((p.y0 + p.y1 + p.y2) / 3);
      return { ...p, x0: Math.round(p.x0 + rx - tcx), y0: Math.round(p.y0 + ry - tcy), x1: Math.round(p.x1 + rx - tcx), y1: Math.round(p.y1 + ry - tcy), x2: Math.round(p.x2 + rx - tcx), y2: Math.round(p.y2 + ry - tcy) };
    }
    case ENTITY_TYPES.DIGITAL_CLOCK:
      return { ...p, x: rx, y: ry };
    default:
      return p;
  }
}

// ─── Centering helper ──────────────────────────────────────────────────────
function centerParams(type: string, params: Record<string, any>, display: { width: number; height: number }): Record<string, any> {
  return placeAtParams(type, params, Math.round(display.width / 2), Math.round(display.height / 2));
}

// ─── Types ─────────────────────────────────────────────────────────────────
export interface Entity {
  id: string;
  name: string;
  type: string;
  params: Record<string, any>;
}

// ─── Context ───────────────────────────────────────────────────────────────
const AppContext = createContext<any>(null);

let entityCounter = 0;
const generateId = (type) => {
  const short = type.replace(/\s/g, "").replace("Digital", "Dig");
  return `${short}${entityCounter++}`;
};


export function AppProvider({ children }) {
  const [selectedDisplay, setSelectedDisplay] = useState("inkplate6");
  const [rotation, setRotation] = useState<0 | 1 | 2 | 3>(0);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState(ENTITY_TYPES.SELECT);
  const [toolParams, setToolParams] = useState<Record<string, any>>(
    DEFAULT_PARAMS[ENTITY_TYPES.CIRCLE],
  );
  const [grid, setGrid] = useState({ enabled: false, size: 10 });
  const [padding, setPadding] = useState({ enabled: false, size: 10 });
  const [zoom, setZoom] = useState(1.0);

  const entitiesRef = useRef(entities);
  entitiesRef.current = entities;
  const selectedEntityIdRef = useRef(selectedEntityId);
  selectedEntityIdRef.current = selectedEntityId;
  const deleteEntityRef = useRef<(id: string) => void>(() => {});

  // ── History ──────────────────────────────────────────────────────────────
  const historyRef = useRef<{ past: Entity[][], future: Entity[][] }>({ past: [], future: [] });
  const [historyVersion, setHistoryVersion] = useState(0);

  const pushHistory = useCallback(() => {
    historyRef.current.past.push([...entitiesRef.current]);
    historyRef.current.future = [];
    if (historyRef.current.past.length > 100) historyRef.current.past.shift();
    setHistoryVersion((v) => v + 1);
  }, []);

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    future.unshift([...entitiesRef.current]);
    setEntities(past.pop()!);
    setHistoryVersion((v) => v + 1);
  }, []);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    past.push([...entitiesRef.current]);
    setEntities(future.shift()!);
    setHistoryVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      const mod = e.metaKey || e.ctrlKey;
      if (mod) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(); }
        return;
      }

      if (!isEditing && (e.key === "Backspace" || e.key === "Delete")) {
        const id = selectedEntityIdRef.current;
        if (id) { e.preventDefault(); deleteEntityRef.current(id); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  void historyVersion;
  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  // ── Derived ──────────────────────────────────────────────────────────────
  const display = DISPLAYS[selectedDisplay as keyof typeof DISPLAYS];
  const canvasWidth  = rotation % 2 === 0 ? display.width  : display.height;
  const canvasHeight = rotation % 2 === 0 ? display.height : display.width;
  const selectedEntity =
    entities.find((e) => e.id === selectedEntityId) ?? null;

  // ── Tool selection ───────────────────────────────────────────────────────
  const selectTool = useCallback((toolType) => {
    setActiveTool(toolType);
    setToolParams(DEFAULT_PARAMS[toolType] ?? {});
    setSelectedEntityId(null);
  }, []);

  const updateToolParam = useCallback((key, value) => {
    setToolParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Entity CRUD ──────────────────────────────────────────────────────────
  const createEntity = useCallback(() => {
    pushHistory();
    const id = generateId(activeTool);
    const centered = centerParams(activeTool, toolParams, { width: canvasWidth, height: canvasHeight });
    const newEntity = { id, name: id, type: activeTool, params: centered };
    setEntities((prev) => [...prev, newEntity]);
    setSelectedEntityId(id);
    return id;
  }, [activeTool, toolParams, canvasWidth, canvasHeight, pushHistory]);

  const createEntityAt = useCallback((x: number, y: number) => {
    pushHistory();
    const id = generateId(activeTool);
    const placed = placeAtParams(activeTool, toolParams, x, y);
    const newEntity = { id, name: id, type: activeTool, params: placed };
    setEntities((prev) => [...prev, newEntity]);
    setSelectedEntityId(id);
    return id;
  }, [activeTool, toolParams, pushHistory]);

  const renameEntity = useCallback((id: string, newName: string) => {
    pushHistory();
    setEntities((prev) =>
      prev.map((e) => (e.id === id ? { ...e, name: newName } : e)),
    );
  }, [pushHistory]);

  const selectEntity = useCallback((id: string | null) => {
    setSelectedEntityId(id);
    const entity = entitiesRef.current.find((e) => e.id === id);
    if (entity) setToolParams({ ...entity.params });
  }, []);

  const updateEntity = useCallback((id, newParams) => {
    setEntities((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, params: { ...e.params, ...newParams } } : e,
      ),
    );
  }, []);

  const reorderEntities = useCallback((fromId: string, toId: string) => {
    pushHistory();
    setEntities((prev) => {
      const fromIndex = prev.findIndex((e) => e.id === fromId);
      const toIndex = prev.findIndex((e) => e.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      const insertAt = next.findIndex((e) => e.id === toId);
      next.splice(fromIndex < toIndex ? insertAt + 1 : insertAt, 0, item);
      return next;
    });
  }, [pushHistory]);

  const deleteEntity = useCallback((id) => {
    pushHistory();
    setEntities((prev) => prev.filter((e) => e.id !== id));
    setSelectedEntityId((prev) => (prev === id ? null : prev));
  }, [pushHistory]);
  deleteEntityRef.current = deleteEntity;

  const clearBoard = useCallback(() => {
    pushHistory();
    setEntities([]);
    setSelectedEntityId(null);
  }, [pushHistory]);

  const moveEntity = useCallback((id, dx, dy) => {
    setEntities((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const p = e.params as any;
        if ("x" in p && "y" in p)
          return { ...e, params: { ...p, x: p.x + dx, y: p.y + dy } };
        if ("cx" in p && "cy" in p)
          return { ...e, params: { ...p, cx: p.cx + dx, cy: p.cy + dy } };
        if (e.type === ENTITY_TYPES.TRIANGLE)
          return { ...e, params: { ...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy, x2: p.x2 + dx, y2: p.y2 + dy } };
        if (e.type === ENTITY_TYPES.LINE)
          return { ...e, params: { ...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy } };
        return e;
      }),
    );
  }, []);

  // ── Save / Load ──────────────────────────────────────────────────────────
  const saveProject = useCallback(() => {
    const data = JSON.stringify({ selectedDisplay, rotation, entities }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inkplate-project.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedDisplay, rotation, entities]);

  const loadProject = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.selectedDisplay) setSelectedDisplay(data.selectedDisplay);
          if (data.rotation !== undefined) setRotation(data.rotation as 0 | 1 | 2 | 3);
          if (data.entities) {
            pushHistory();
            setEntities(data.entities);
          }
        } catch {
          alert("Invalid project file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [pushHistory]);

  // ── Arduino code export ──────────────────────────────────────────────────
  const exportArduino = useCallback(() => {
    const colorMode = display.colorMode;

    const inkplateConstructor = (() => {
      if (colorMode === "3bit") return "Inkplate display(INKPLATE_3BIT);";
      if (colorMode === "7color" || colorMode === "6color") return "Inkplate display;";
      return "Inkplate display(INKPLATE_1BIT);";
    })();

    const bitmapIncludes: string[] = [];
    const varLines: string[] = [];
    const drawLines: string[] = [];

    for (const e of entities) {
      const p = e.params;
      const id = e.id;

      switch (e.type) {
        case ENTITY_TYPES.TEXT: {
          const fontSize = p.fontSize ?? 2;
          const charW = 6 * fontSize;
          const charH = 8 * fontSize;
          const boxW = p.width ?? 200;
          const boxH = p.height ?? 60;
          const words = (p.text ?? "").split(" ");
          const wrappedLines: string[] = [];
          let cur = words[0] ?? "";
          for (let i = 1; i < words.length; i++) {
            const test = cur + " " + words[i];
            if (test.length * charW <= boxW) cur = test;
            else { wrappedLines.push(cur); cur = words[i]; }
          }
          if (cur) wrappedLines.push(cur);
          drawLines.push(`  display.setFont();`);
          drawLines.push(`  display.setTextColor(${p.color});`);
          drawLines.push(`  display.setTextSize(${fontSize});`);
          wrappedLines.forEach((line, i) => {
            if ((i + 1) * charH > boxH) return;
            drawLines.push(`  display.setCursor(${p.x}, ${p.y + i * charH});`);
            drawLines.push(`  display.print("${line}");`);
          });
          break;
        }

        case ENTITY_TYPES.CIRCLE:
          drawLines.push(
            `  display.${p.fill ? "fill" : "draw"}Circle(${p.cx}, ${p.cy}, ${p.radius}, ${p.color});`
          );
          break;

        case ENTITY_TYPES.RECTANGLE:
          drawLines.push(
            `  display.${p.fill ? "fill" : "draw"}Rect(${p.x}, ${p.y}, ${p.width}, ${p.height}, ${p.color});`
          );
          break;

        case ENTITY_TYPES.ROUND_RECT:
          drawLines.push(
            `  display.${p.fill ? "fill" : "draw"}RoundRect(${p.x}, ${p.y}, ${p.width}, ${p.height}, ${p.borderRadius ?? 0}, ${p.color});`
          );
          break;

        case ENTITY_TYPES.LINE: {
          const thick = p.thickness ?? 1;
          const colorEnd = p.colorEnd ?? p.color;
          if (p.gradient && thick > 1) {
            drawLines.push(
              `  { float _len_${id} = sqrt(pow(${p.x1}-${p.x0},2)+pow(${p.y1}-${p.y0},2)); if(_len_${id}<1)_len_${id}=1;`,
              `  float _nx_${id} = -(${p.y1}-${p.y0})/_len_${id}, _ny_${id} = (${p.x1}-${p.x0})/_len_${id};`,
              `  for(int _i=-${Math.floor(thick/2)};_i<=${Math.floor(thick/2)};_i++)`,
              `    display.drawGradientLine(${p.x0}+round(_nx_${id}*_i),${p.y0}+round(_ny_${id}*_i),${p.x1}+round(_nx_${id}*_i),${p.y1}+round(_ny_${id}*_i),${p.color},${colorEnd}); }`,
            );
          } else if (p.gradient) {
            drawLines.push(
              `  display.drawGradientLine(${p.x0}, ${p.y0}, ${p.x1}, ${p.y1}, ${p.color}, ${colorEnd});`
            );
          } else if (thick > 1) {
            drawLines.push(
              `  display.drawThickLine(${p.x0}, ${p.y0}, ${p.x1}, ${p.y1}, ${p.color}, ${thick});`
            );
          } else {
            drawLines.push(
              `  display.drawLine(${p.x0}, ${p.y0}, ${p.x1}, ${p.y1}, ${p.color});`
            );
          }
          break;
        }

        case ENTITY_TYPES.TRIANGLE:
          drawLines.push(
            `  display.${p.fill ? "fill" : "draw"}Triangle(${p.x0}, ${p.y0}, ${p.x1}, ${p.y1}, ${p.x2}, ${p.y2}, ${p.color});`
          );
          break;

        case ENTITY_TYPES.BITMAP: {
          bitmapIncludes.push(
            `// Image '${id}': convert your image with https://imageconverter.soldered.com`,
            `// and place the generated '${id}.h' next to this sketch.`,
            `#include "${id}.h"`,
          );
          if (colorMode === "3bit") {
            drawLines.push(`  display.drawBitmap3Bit(${p.x}, ${p.y}, ${id}, ${p.width}, ${p.height});`);
          } else if (colorMode === "7color" || colorMode === "6color") {
            drawLines.push(`  display.drawBitmap(${p.x}, ${p.y}, ${id}, ${p.width}, ${p.height});`);
          } else {
            drawLines.push(`  display.drawBitmap(${p.x}, ${p.y}, ${id}, ${p.width}, ${p.height}, 0);`);
          }
          break;
        }

        case ENTITY_TYPES.GRAPH: {
          const n = p.n ?? 32;
          const data =
            p.data && p.data.length > 0
              ? p.data
              : Array.from({ length: n }, (_, i) => Math.sin((Math.PI * 3 * i) / n));
          const x1 = p.x, y1 = p.y + p.height, x2 = p.x + p.width, y2 = p.y;
          varLines.push(
            `int graph_${id}_n = ${n};`,
            `int graph_${id}_x1 = ${x1};`,
            `int graph_${id}_y1 = ${y1};`,
            `int graph_${id}_x2 = ${x2};`,
            `int graph_${id}_y2 = ${y2};`,
            `double graph_${id}_data[128] = ${JSON.stringify(data).replace("[", "{").replace("]", "}")};`,
          );
          drawLines.push(
            `  { // Graph ${id}`,
            `  int textMargin_${id} = 68;`,
            `  double minD_${id} = 1e9F, maxD_${id} = -1e9F;`,
            `  for (int i = 0; i < graph_${id}_n; ++i) { minD_${id} = min(minD_${id}, graph_${id}_data[i]); maxD_${id} = max(maxD_${id}, graph_${id}_data[i]); }`,
            `  double span_${id} = max(0.3, fabs(maxD_${id} - minD_${id}));`,
            `  int prevX_${id} = -1, prevY_${id} = -1;`,
            `  for (int i = 0; i < graph_${id}_n; ++i) {`,
            `    int tx = graph_${id}_x1 + i * (graph_${id}_x2 - graph_${id}_x1 - textMargin_${id}) / graph_${id}_n;`,
            `    int ty = graph_${id}_y1 - (int)((graph_${id}_data[i] - minD_${id}) * abs(graph_${id}_y1 - graph_${id}_y2) / span_${id});`,
            `    if (i) for (int j = 0; j < (graph_${id}_x2 - graph_${id}_x1) / graph_${id}_n + 1; ++j)`,
            `      display.drawGradientLine(prevX_${id}+j, round(prevY_${id}+(double)(ty-prevY_${id})/((graph_${id}_x2-graph_${id}_x1-textMargin_${id})/graph_${id}_n)*j), prevX_${id}+j, graph_${id}_y1, 3, 7);`,
            `    prevX_${id} = tx; prevY_${id} = ty;`,
            `  }`,
            `  prevX_${id} = -1; prevY_${id} = -1;`,
            `  for (int i = 0; i < graph_${id}_n; ++i) {`,
            `    int tx = graph_${id}_x1 + i * (graph_${id}_x2 - graph_${id}_x1 - textMargin_${id}) / graph_${id}_n;`,
            `    int ty = graph_${id}_y1 - (int)((graph_${id}_data[i] - minD_${id}) * abs(graph_${id}_y1 - graph_${id}_y2) / span_${id});`,
            `    if (i) display.drawThickLine(prevX_${id}, prevY_${id}, tx, ty, 0, 5.0);`,
            `    prevX_${id} = tx; prevY_${id} = ty;`,
            `  }`,
            `  for (int i = 0; i < 4; ++i) {`,
            `    display.setFont();`,
            `    display.drawFastHLine(graph_${id}_x1, graph_${id}_y2+i*(graph_${id}_y1-graph_${id}_y2)/4, graph_${id}_x2-graph_${id}_x1, 4);`,
            `    display.setCursor(graph_${id}_x2-textMargin_${id}+10, graph_${id}_y1+(4-i)*(graph_${id}_y2-graph_${id}_y1)/4+23);`,
            `    display.setTextColor(0, 7); display.setTextSize(3);`,
            `    display.print(String(minD_${id}+(maxD_${id}-minD_${id})*(4-i)/4));`,
            `  }`,
            `  for (int i = 0; i < 5; ++i)`,
            `    display.drawFastVLine(graph_${id}_x1+i*(graph_${id}_x2-graph_${id}_x1)/5, graph_${id}_y2, graph_${id}_y1-graph_${id}_y2, 4);`,
            `  display.drawFastVLine(graph_${id}_x2-textMargin_${id}+2, graph_${id}_y2, graph_${id}_y1-graph_${id}_y2, 4);`,
            `  display.drawThickLine(graph_${id}_x1, graph_${id}_y1, graph_${id}_x2, graph_${id}_y1, 0, 3);`,
            `  }`,
          );
          break;
        }

        case ENTITY_TYPES.CLOCK: {
          drawLines.push(
            `  { // Clock ${id}`,
            `  int clock_cx = ${p.x}, clock_cy = ${p.y}, clock_r = ${p.radius};`,
            `  int clock_r0 = clock_r * 0.55, clock_r1 = clock_r * 0.65, clock_r2 = clock_r * 0.9;`,
            `  int clock_h = ${p.h}, clock_m = ${p.m};`,
            `  display.drawCircle(clock_cx, clock_cy, clock_r, ${p.color});`,
            `  for (int i = 0; i < 60; ++i) {`,
            `    double a = (double)i / 60.0 * 2.0 * 3.14159265;`,
            `    if (i % 5 == 0)`,
            `      display.drawThickLine(clock_cx+clock_r1*cos(a), clock_cy+clock_r1*sin(a), clock_cx+clock_r*cos(a), clock_cy+clock_r*sin(a), ${p.color}, 3);`,
            `    else if (clock_r * 2 > 150)`,
            `      display.drawLine(clock_cx+clock_r1*cos(a), clock_cy+clock_r1*sin(a), clock_cx+clock_r2*cos(a), clock_cy+clock_r2*sin(a), 2);`,
            `  }`,
            `  display.drawThickLine(clock_cx, clock_cy, clock_cx+clock_r0*cos((double)(clock_h-3.0+clock_m/60.0)/12.0*2.0*3.14159265), clock_cy+clock_r0*sin((double)(clock_h-3.0+clock_m/60.0)/12.0*2.0*3.14159265), 2, 2);`,
            `  display.drawThickLine(clock_cx, clock_cy, clock_cx+clock_r2*cos((double)(clock_m-15.0)/60.0*2.0*3.14159265), clock_cy+clock_r2*sin((double)(clock_m-15.0)/60.0*2.0*3.14159265), 2, 2);`,
            `  }`,
          );
          break;
        }

        case ENTITY_TYPES.DIGITAL_CLOCK: {
          varLines.push(
            `int digclock_${id}_h = ${p.h};`,
            `int digclock_${id}_m = ${p.m};`,
            `int digclock_${id}_x = ${p.x};`,
            `int digclock_${id}_y = ${p.y};`,
            `int digclock_${id}_size = ${(p.fontSize ?? 8) * 8};`,
            `int digclock_${id}_bitmask[] = {119,48,93,121,58,107,111,49,127,59};`,
            `int digclock_${id}_triX[] = {83,101,108,101,108,277,101,108,277,257,277,108,257,277,286,76,60,98,60,98,80,80,39,60,80,39,55,31,55,73,31,73,52,31,9,52,9,52,20,61,86,80,86,80,233,233,227,80,233,227,252,260,292,305,305,260,240,305,281,240,240,281,260,259,234,276,234,276,256,256,214,234,214,256,237,38,27,60,38,60,207,207,38,212,212,207,230};`,
            `int digclock_${id}_triY[] = {30,13,60,13,60,14,13,60,14,57,14,60,57,14,29,36,47,61,47,61,198,198,201,47,198,201,219,252,232,253,252,253,390,252,406,390,406,390,416,227,202,249,202,249,203,203,247,249,203,247,224,60,35,49,49,60,200,50,201,200,200,201,220,231,252,252,252,252,403,403,390,252,390,403,415,439,424,392,439,392,394,394,439,439,439,394,424};`,
            `int digclock_${id}_maxX = 310;`,
            `int digclock_${id}_maxY = 440;`,
          );
          drawLines.push(
            `  { // Digital Clock ${id}`,
            `  int dc_temp_${id}[4] = {digclock_${id}_h/10%10, digclock_${id}_h%10, digclock_${id}_m/10%10, digclock_${id}_m%10};`,
            `  int dc_triCount_${id} = sizeof(digclock_${id}_triX)/sizeof(digclock_${id}_triX[0]);`,
            `  for (int i = 0; i < 4; ++i)`,
            `    for (int j = 0; j < dc_triCount_${id}; j += 3) {`,
            `      int b = digclock_${id}_bitmask[dc_temp_${id}[i]];`,
            `      if (b & (1 << ((j-1)/(3*4))))`,
            `        display.fillTriangle(`,
            `          (int)((float)i*(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*1.1+(float)digclock_${id}_x+(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*(float)digclock_${id}_triX[j]/(float)digclock_${id}_maxX),`,
            `          (int)((float)digclock_${id}_y+(float)digclock_${id}_size*(float)digclock_${id}_triY[j]/(float)digclock_${id}_maxY),`,
            `          (int)((float)i*(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*1.1+(float)digclock_${id}_x+(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*(float)digclock_${id}_triX[j+1]/(float)digclock_${id}_maxX),`,
            `          (int)((float)digclock_${id}_y+(float)digclock_${id}_size*(float)digclock_${id}_triY[j+1]/(float)digclock_${id}_maxY),`,
            `          (int)((float)i*(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*1.1+(float)digclock_${id}_x+(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*(float)digclock_${id}_triX[j+2]/(float)digclock_${id}_maxX),`,
            `          (int)((float)digclock_${id}_y+(float)digclock_${id}_size*(float)digclock_${id}_triY[j+2]/(float)digclock_${id}_maxY), ${p.color});`,
            `    }`,
            `  int dc_r_${id} = (int)(0.05*(float)digclock_${id}_size);`,
            `  display.fillCircle((int)((float)digclock_${id}_x+4.0*(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*1.075/2.0),(int)((float)digclock_${id}_y+(float)digclock_${id}_size*0.4),dc_r_${id},${p.color});`,
            `  display.fillCircle((int)((float)digclock_${id}_x+4.0*(float)digclock_${id}_maxX/(float)digclock_${id}_maxY*(float)digclock_${id}_size*1.075/2.0),(int)((float)digclock_${id}_y+(float)digclock_${id}_size*0.6),dc_r_${id},${p.color});`,
            `  }`,
          );
          break;
        }
      }
    }

    const lines: string[] = [
      `// Inkplate GUI Designer export`,
      `// Display: ${display.label}`,
      `#include "Inkplate.h"`,
      ...bitmapIncludes,
      ``,
      inkplateConstructor,
    ];

    if (varLines.length > 0) lines.push(``, ...varLines);

    lines.push(
      ``,
      `void setup() {`,
      `  display.begin();`,
      ...(rotation !== 0 ? [`  display.setRotation(${rotation});`] : []),
      `  display.clearDisplay();`,
      ...drawLines,
      `  display.display();`,
      `}`,
      ``,
      `void loop() {`,
      `  delay(1000);`,
      `}`,
    );

    const code = lines.join("\n");
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inkplate_sketch.ino";
    a.click();
    URL.revokeObjectURL(url);
  }, [entities, display, rotation]);

  return (
    <AppContext.Provider
      value={{
        // Display
        selectedDisplay,
        setSelectedDisplay,
        display,
        rotation,
        setRotation,
        canvasWidth,
        canvasHeight,
        // Entities
        entities,
        selectedEntityId,
        selectedEntity,
        createEntity,
        createEntityAt,
        selectEntity,
        updateEntity,
        deleteEntity,
        clearBoard,
        reorderEntities,
        moveEntity,
        renameEntity,
        // Tool
        activeTool,
        selectTool,
        toolParams,
        updateToolParam,
        // Settings
        grid,
        setGrid,
        padding,
        setPadding,
        zoom,
        setZoom,
        // History
        pushHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        // Actions
        saveProject,
        loadProject,
        exportArduino,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
