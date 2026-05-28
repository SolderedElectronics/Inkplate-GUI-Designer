import { useApp, ENTITY_TYPES } from "../context/AppContext";

const ICONS = {
  [ENTITY_TYPES.SELECT]: (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none">
      <path
        d="M4 2v11l3-3 2.2 4.8 1.8-.8L8.8 9.5 13 9.5z"
        fill="currentColor"
      />
    </svg>
  ),
  [ENTITY_TYPES.LINE]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <line
        x1="3"
        y1="15"
        x2="15"
        y2="3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ENTITY_TYPES.RECTANGLE]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="9"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  [ENTITY_TYPES.ROUND_RECT]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <rect
        x="2.5"
        y="4.5"
        width="13"
        height="9"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  [ENTITY_TYPES.CIRCLE]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <circle
        cx="9"
        cy="9"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  [ENTITY_TYPES.TRIANGLE]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <polygon
        points="9,2.5 15.5,15.5 2.5,15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  [ENTITY_TYPES.TEXT]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <text
        x="9"
        y="14"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fontFamily="serif"
        fill="currentColor"
      >
        T
      </text>
    </svg>
  ),
  [ENTITY_TYPES.BITMAP]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <rect
        x="1.5"
        y="2.5"
        width="15"
        height="13"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="5.5" cy="6.5" r="1.5" fill="currentColor" />
      <path
        d="M1.5 13.5l4-4 3.5 3 2.5-3L16 13"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  [ENTITY_TYPES.GRAPH]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <polyline
        points="2,14 5,8 9,11 13,5 16,7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2"
        y1="15"
        x2="16"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ENTITY_TYPES.CLOCK]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <circle
        cx="9"
        cy="9"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="9"
        y1="9"
        x2="9"
        y2="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="9"
        y1="9"
        x2="13"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  [ENTITY_TYPES.DIGITAL_CLOCK]: (
    <svg viewBox="0 0 18 18" width="18" height="18">
      <rect
        x="1"
        y="5"
        width="16"
        height="8"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="9"
        y="12"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="monospace"
        fill="currentColor"
      >
        88:88
      </text>
    </svg>
  ),
};

const LABELS = {
  [ENTITY_TYPES.SELECT]: "Select / Move",
  [ENTITY_TYPES.LINE]: "Line",
  [ENTITY_TYPES.RECTANGLE]: "Rectangle",
  [ENTITY_TYPES.ROUND_RECT]: "Round rect",
  [ENTITY_TYPES.CIRCLE]: "Circle",
  [ENTITY_TYPES.TRIANGLE]: "Triangle",
  [ENTITY_TYPES.TEXT]: "Text",
  [ENTITY_TYPES.BITMAP]: "Bitmap",
  [ENTITY_TYPES.GRAPH]: "Graph",
  [ENTITY_TYPES.CLOCK]: "Clock",
  [ENTITY_TYPES.DIGITAL_CLOCK]: "Digital Clock",
};

const SHAPES = [
  ENTITY_TYPES.LINE,
  ENTITY_TYPES.RECTANGLE,
  ENTITY_TYPES.ROUND_RECT,
  ENTITY_TYPES.CIRCLE,
  ENTITY_TYPES.TRIANGLE,
  ENTITY_TYPES.TEXT,
  ENTITY_TYPES.BITMAP,
];

const WIDGETS = [
  ENTITY_TYPES.GRAPH,
  ENTITY_TYPES.CLOCK,
  ENTITY_TYPES.DIGITAL_CLOCK,
];

function Divider() {
  return <div className="border-t border-gray-200 mx-2 my-1" />;
}

function SectionLabel({ children }) {
  return (
    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider text-center mt-2 mb-0.5 select-none">
      {children}
    </p>
  );
}

function ToolButton({ type, active, onClick }) {
  return (
    <div className="relative group flex justify-center">
      <button
        onClick={onClick}
        className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded transition-colors
          ${
            active
              ? "bg-violet-200 text-violet-800"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        {ICONS[type]}
      </button>
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs font-mono rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-100">
        {LABELS[type]}
      </div>
    </div>
  );
}

export default function LeftSidebar() {
  const { activeTool, selectTool } = useApp();

  return (
    <aside className="w-12 bg-white border-r border-gray-200 flex flex-col items-center shrink-0 py-2">
      <ToolButton
        type={ENTITY_TYPES.SELECT}
        active={activeTool === ENTITY_TYPES.SELECT}
        onClick={() => selectTool(ENTITY_TYPES.SELECT)}
      />

      {SHAPES.map((type) => (
        <ToolButton
          key={type}
          type={type}
          active={activeTool === type}
          onClick={() => selectTool(type)}
        />
      ))}

      {WIDGETS.map((type) => (
        <ToolButton
          key={type}
          type={type}
          active={activeTool === type}
          onClick={() => selectTool(type)}
        />
      ))}
    </aside>
  );
}
