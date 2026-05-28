import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import Canvas from "./components/Canvas";
import RightPanel from "./components/RightPanel";

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100 select-none">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightPanel />
        </div>
      </div>
    </AppProvider>
  );
}
