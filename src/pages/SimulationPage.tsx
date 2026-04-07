import { useState } from 'react';
import { useSimulationSocket } from '../hooks/useSimulationSocket';
import { useChatSocket } from '../hooks/useChatSocket';
import { useHistorySocket } from '../hooks/useHistorySocket';
import MapView from '../components/MapView/MapView';
import SimNavbar from '../components/Navbar/Navbar';
import ControlPanel from '../components/ControlPanel/ControlPanel';
import RightPanel from '../components/Sidebar/RightPanel';
import '../pages/SimulationPage.css';

export default function SimulationPage() {
  const simSocket    = useSimulationSocket();
  const chatSocket   = useChatSocket();
  const historySocket = useHistorySocket();

  // Map controls state
  const [zoom, setZoom]               = useState(13);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showLights, setShowLights]     = useState(true);
  const [showSpecs, setShowSpecs]       = useState(true);

  // Panel collapse state
  const [isLeftCollapsed, setIsLeftCollapsed]   = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // historySocket used to trigger the hook (connection side-effect)
  void historySocket;

  return (
    <div className="sim-root">
      <SimNavbar simSocket={simSocket} />

      <div className="sim-body">
        {/* Left: control panel */}
        <ControlPanel
          simSocket={simSocket}
          zoom={zoom}
          onZoomChange={setZoom}
          showVehicles={showVehicles}
          showLights={showLights}
          showSpecs={showSpecs}
          onToggleVehicles={() => setShowVehicles((v) => !v)}
          onToggleLights={() => setShowLights((v) => !v)}
          onToggleSpecs={() => setShowSpecs((v) => !v)}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed((v) => !v)}
        />

        {/* Center: map */}
        <div className="sim-map">
          <MapView
            simSocket={simSocket}
            zoom={zoom}
            showVehicles={showVehicles}
            showLights={showLights}
          />
        </div>

        {/* Right: users + history + chat */}
        <RightPanel 
          chatSocket={chatSocket}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed((v) => !v)}
        />
      </div>
    </div>
  );
}
