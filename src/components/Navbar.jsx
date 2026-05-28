import { useApp, DISPLAYS } from "../context/AppContext";
import arduinoLogo from "../assets/arduino.png";
import solderedLogo from "../assets/soldered.svg";

export default function Navbar() {
  const {
    selectedDisplay,
    setSelectedDisplay,
    saveProject,
    loadProject,
    exportArduino,
  } = useApp();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-surface border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img src={solderedLogo} alt="" className="h-6 border-r pr-2" />
        <h1 className="font-bold text-lg leading-tight tracking-tight text-gray-900 font-mono">
          Inkplate GUI Designer
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <select
          className="border border-gray-400 text-sm font-mono px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-violet-400"
          value={selectedDisplay}
          onChange={(e) => setSelectedDisplay(e.target.value)}
        >
          {Object.entries(DISPLAYS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <span className="text-gray-300 font-mono mx-1">|</span>

        <button
          onClick={saveProject}
          className="text-sm font-mono hover:cursor-pointer transition-colors px-2 py-0.5"
        >
          Save
        </button>
        <span className="text-gray-300 font-mono">|</span>
        <button
          onClick={loadProject}
          className="text-sm font-mono hover:cursor-pointer transition-colors px-2 py-0.5"
        >
          Load
        </button>
        <span className="text-gray-300 font-mono mx-1">|</span>
        <button
          onClick={exportArduino}
          className="flex items-center border border-arduino text-arduino gap-1.5 text-sm font-mono font-semibold px-1 py-0.5 rounded transition-colors bg-white hover:opacity-80 cursor-pointer"
        >
          <img src={arduinoLogo} alt="" className="w-4 h-4" />
          <span className="hidden sm:inline">Export Arduino Code</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
}
