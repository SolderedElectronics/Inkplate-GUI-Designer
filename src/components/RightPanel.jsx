import { useState } from "react";
import { useApp, ENTITY_TYPES, COLOR_MODES } from "../context/AppContext";

// ─── Small reusable form controls ─────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-mono text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function FieldRow({ children }) {
  return <div className="flex gap-2 mb-3">{children}</div>;
}

function FieldCell({ label, children }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-mono text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      min={min}
      max={max}
      onChange={(e) => onChange(Math.round(Number(e.target.value)))}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white"
    />
  );
}

function TextInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-violet-400 bg-white"
    />
  );
}

function ColorSlider({ value, onChange }) {
  const { display } = useApp();
  const palette = COLOR_MODES[display?.colorMode ?? "3bit"] ?? COLOR_MODES["3bit"];
  const selected = Math.max(0, Math.min(value ?? 0, palette.length - 1));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1 flex-wrap">
        {palette.map((c, i) => (
          <button
            key={i}
            title={c.label}
            onClick={() => onChange(i)}
            style={{
              width: 20,
              height: 20,
              background: c.css,
              border: selected === i ? "2px solid #7c3aed" : "1px solid #999",
              borderRadius: 3,
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-mono text-gray-500">{palette[selected]?.label}</span>
    </div>
  );
}

function CheckboxInput({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={value ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3.5 h-3.5 accent-violet-600"
      />
      <span className="text-sm font-mono text-gray-700">{label}</span>
    </label>
  );
}

// ─── Per-type param forms ─────────────────────────────────────────────────
function PencilForm({ p, set }) {
  const count = p.pixels?.length ?? 0;
  return (
    <>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      {count > 0 && (
        <p className="text-xs font-mono text-gray-400 mt-1">{count} pixel{count !== 1 ? "s" : ""}</p>
      )}
    </>
  );
}

function LineForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X0"><NumberInput value={p.x0} onChange={(v) => set("x0", v)} /></FieldCell>
        <FieldCell label="Y0"><NumberInput value={p.y0} onChange={(v) => set("y0", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="X1"><NumberInput value={p.x1} onChange={(v) => set("x1", v)} /></FieldCell>
        <FieldCell label="Y1"><NumberInput value={p.y1} onChange={(v) => set("y1", v)} /></FieldCell>
      </FieldRow>
      <Field label="Thickness"><NumberInput value={p.thickness} min={1} onChange={(v) => set("thickness", v)} /></Field>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      <CheckboxInput label="Gradient" value={p.gradient} onChange={(v) => set("gradient", v)} />
      {p.gradient && (
        <Field label="Color end"><ColorSlider value={p.colorEnd} onChange={(v) => set("colorEnd", v)} /></Field>
      )}
    </>
  );
}

function RectForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="Width"><NumberInput value={p.width} min={1} onChange={(v) => set("width", v)} /></FieldCell>
        <FieldCell label="Height"><NumberInput value={p.height} min={1} onChange={(v) => set("height", v)} /></FieldCell>
      </FieldRow>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      <CheckboxInput label="Fill" value={p.fill} onChange={(v) => set("fill", v)} />
    </>
  );
}

function RoundRectForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="Width"><NumberInput value={p.width} min={1} onChange={(v) => set("width", v)} /></FieldCell>
        <FieldCell label="Height"><NumberInput value={p.height} min={1} onChange={(v) => set("height", v)} /></FieldCell>
      </FieldRow>
      <Field label="Border radius"><NumberInput value={p.borderRadius} min={0} onChange={(v) => set("borderRadius", v)} /></Field>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      <CheckboxInput label="Fill" value={p.fill} onChange={(v) => set("fill", v)} />
    </>
  );
}

function CircleForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="Cx"><NumberInput value={p.cx} onChange={(v) => set("cx", v)} /></FieldCell>
        <FieldCell label="Cy"><NumberInput value={p.cy} onChange={(v) => set("cy", v)} /></FieldCell>
      </FieldRow>
      <Field label="Radius"><NumberInput value={p.radius} min={1} onChange={(v) => set("radius", v)} /></Field>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      <CheckboxInput label="Fill" value={p.fill} onChange={(v) => set("fill", v)} />
    </>
  );
}

function TriangleForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X0"><NumberInput value={p.x0} onChange={(v) => set("x0", v)} /></FieldCell>
        <FieldCell label="Y0"><NumberInput value={p.y0} onChange={(v) => set("y0", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="X1"><NumberInput value={p.x1} onChange={(v) => set("x1", v)} /></FieldCell>
        <FieldCell label="Y1"><NumberInput value={p.y1} onChange={(v) => set("y1", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="X2"><NumberInput value={p.x2} onChange={(v) => set("x2", v)} /></FieldCell>
        <FieldCell label="Y2"><NumberInput value={p.y2} onChange={(v) => set("y2", v)} /></FieldCell>
      </FieldRow>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
      <CheckboxInput label="Fill" value={p.fill} onChange={(v) => set("fill", v)} />
    </>
  );
}

function TextForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="Width"><NumberInput value={p.width} min={10} onChange={(v) => set("width", v)} /></FieldCell>
        <FieldCell label="Height"><NumberInput value={p.height} min={10} onChange={(v) => set("height", v)} /></FieldCell>
      </FieldRow>
      <Field label="Text"><TextInput value={p.text} onChange={(v) => set("text", v)} /></Field>
      <Field label="Font size"><NumberInput value={p.fontSize} min={1} max={10} onChange={(v) => set("fontSize", v)} /></Field>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
    </>
  );
}

function GraphForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="Width"><NumberInput value={p.width} min={20} onChange={(v) => set("width", v)} /></FieldCell>
        <FieldCell label="Height"><NumberInput value={p.height} min={20} onChange={(v) => set("height", v)} /></FieldCell>
      </FieldRow>
      <Field label="Data points"><NumberInput value={p.n} min={2} max={128} onChange={(v) => set("n", v)} /></Field>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
    </>
  );
}

function ClockForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <Field label="Radius"><NumberInput value={p.radius} min={10} onChange={(v) => set("radius", v)} /></Field>
      <FieldRow>
        <FieldCell label="Hour (0–11)"><NumberInput value={p.h} min={0} max={11} onChange={(v) => set("h", v)} /></FieldCell>
        <FieldCell label="Minute (0–59)"><NumberInput value={p.m} min={0} max={59} onChange={(v) => set("m", v)} /></FieldCell>
      </FieldRow>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
    </>
  );
}

function DigitalClockForm({ p, set }) {
  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <Field label="Size"><NumberInput value={p.fontSize} min={1} max={20} onChange={(v) => set("fontSize", v)} /></Field>
      <FieldRow>
        <FieldCell label="Hour (0–23)"><NumberInput value={p.h} min={0} max={23} onChange={(v) => set("h", v)} /></FieldCell>
        <FieldCell label="Minute (0–59)"><NumberInput value={p.m} min={0} max={59} onChange={(v) => set("m", v)} /></FieldCell>
      </FieldRow>
      <Field label="Color"><ColorSlider value={p.color} onChange={(v) => set("color", v)} /></Field>
    </>
  );
}

function BitmapForm({ p, set }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("src", ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <FieldRow>
        <FieldCell label="X"><NumberInput value={p.x} onChange={(v) => set("x", v)} /></FieldCell>
        <FieldCell label="Y"><NumberInput value={p.y} onChange={(v) => set("y", v)} /></FieldCell>
      </FieldRow>
      <FieldRow>
        <FieldCell label="Width"><NumberInput value={p.width} min={1} onChange={(v) => set("width", v)} /></FieldCell>
        <FieldCell label="Height"><NumberInput value={p.height} min={1} onChange={(v) => set("height", v)} /></FieldCell>
      </FieldRow>
      <Field label="Image">
        <label className="block w-full text-center text-sm font-mono border border-gray-300 rounded px-2 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
          {p.src ? "Change image" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        {p.src && (
          <img
            src={p.src}
            alt=""
            className="mt-2 w-full object-contain max-h-24 rounded border border-gray-200"
          />
        )}
      </Field>
    </>
  );
}

const FORMS = {
  [ENTITY_TYPES.PENCIL]: PencilForm,
  [ENTITY_TYPES.LINE]: LineForm,
  [ENTITY_TYPES.RECTANGLE]: RectForm,
  [ENTITY_TYPES.ROUND_RECT]: RoundRectForm,
  [ENTITY_TYPES.CIRCLE]: CircleForm,
  [ENTITY_TYPES.TRIANGLE]: TriangleForm,
  [ENTITY_TYPES.TEXT]: TextForm,
  [ENTITY_TYPES.BITMAP]: BitmapForm,
  [ENTITY_TYPES.GRAPH]: GraphForm,
  [ENTITY_TYPES.CLOCK]: ClockForm,
  [ENTITY_TYPES.DIGITAL_CLOCK]: DigitalClockForm,
};

// ─── Layers panel ──────────────────────────────────────────────────────────
function EntityItem({ entity, selected, onClick, onDelete, onDragStart, onDragOver, onDrop, onDragEnd, dragOver }) {
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart(entity.id); }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(entity.id); }}
      onDrop={(e) => { e.preventDefault(); onDrop(entity.id); }}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between group px-1 py-0.5 rounded cursor-pointer text-xs font-mono transition-colors
        ${selected ? "bg-violet-200 text-violet-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}
        ${dragOver ? "border border-violet-400" : "border border-transparent"}`}
      onClick={onClick}
    >
      <span className="text-gray-400 mr-1 cursor-grab select-none text-[10px]">⠿</span>
      <span className="flex-1 truncate">{entity.name ?? entity.id}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(entity.id); }}
        className="hidden group-hover:block text-red-400 hover:text-red-600 text-xs px-1 leading-none"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

function LayersPanel() {
  const { entities, selectedEntityId, selectEntity, deleteEntity, clearBoard, reorderEntities } = useApp();
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleDrop = (toId) => {
    if (dragId && dragId !== toId) reorderEntities(dragId, toId);
    setDragId(null);
    setDragOverId(null);
  };

  const handleClearClick = () => {
    if (entities.length === 0) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    clearBoard();
    setConfirming(false);
  };

  const reversed = [...entities].reverse();

  return (
    <div className="border-t border-gray-200 flex flex-col" style={{ height: 180, flexShrink: 0 }}>
      <div className="flex items-center justify-between px-3 py-1.5 shrink-0">
        <p className="font-bold text-xs font-mono text-gray-600 uppercase tracking-wider select-none">
          Layers
        </p>
        {confirming ? (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-gray-500 select-none">Clear all?</span>
            <button
              onClick={handleConfirm}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={handleClearClick}
            disabled={entities.length === 0}
            title="Clear all layers"
            className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path d="M2 4h12M5 4V2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l.8 9a.5.5 0 0 0 .5.5h7.4a.5.5 0 0 0 .5-.5L13 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-y-auto px-2 pb-2">
        {reversed.length === 0 && (
          <p className="text-xs text-gray-400 font-mono italic px-1">No entities yet</p>
        )}
        {reversed.map((entity) => (
          <EntityItem
            key={entity.id}
            entity={entity}
            selected={selectedEntityId === entity.id}
            onClick={() => selectEntity(entity.id)}
            onDelete={deleteEntity}
            onDragStart={setDragId}
            onDragOver={setDragOverId}
            onDrop={handleDrop}
            onDragEnd={() => { setDragId(null); setDragOverId(null); }}
            dragOver={dragOverId === entity.id}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main panel ────────────────────────────────────────────────────────────
export default function RightPanel() {
  const {
    activeTool,
    toolParams,
    updateToolParam,
    selectedEntity,
    updateEntity,
    renameEntity,
  } = useApp();

  const isSelect = activeTool === ENTITY_TYPES.SELECT;

  const PropertiesContent = () => {
    if (selectedEntity) {
      const Form = FORMS[selectedEntity.type] ?? (() => null);
      const set = (key, val) => updateEntity(selectedEntity.id, { [key]: val });
      return (
        <>
          <Field label="Name">
            <TextInput
              value={selectedEntity.name ?? selectedEntity.id}
              onChange={(v) => renameEntity(selectedEntity.id, v)}
            />
          </Field>
          <div className="border-t border-gray-100 my-3" />
          <Form p={selectedEntity.params} set={set} />
        </>
      );
    }

    if (isSelect) {
      return (
        <p className="text-xs font-mono text-gray-400 leading-relaxed mt-1">
          Select an entity on canvas, or pick a tool to create one.
        </p>
      );
    }

    const Form = FORMS[activeTool] ?? (() => null);
    const set = (key, val) => updateToolParam(key, val);
    return (
      <>
        <h2 className="font-bold text-sm font-mono text-gray-900 mb-3">
          {`New ${activeTool.toLowerCase()}`}
        </h2>
        <Form p={toolParams} set={set} />
        <p className="mt-3 text-xs font-mono text-gray-400 leading-relaxed">
          Click canvas to place.
        </p>
      </>
    );
  };

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0" style={{ minHeight: 0 }}>
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
        {PropertiesContent()}
      </div>
      <LayersPanel />
    </aside>
  );
}
