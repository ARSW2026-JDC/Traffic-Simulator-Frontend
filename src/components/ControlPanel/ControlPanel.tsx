import { useState } from 'react';
import type { RefObject } from 'react';
import type { Socket } from 'socket.io-client';
import { useSimulationStore } from '../../stores/simulationStore';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  simSocket: RefObject<Socket | null>;
  zoom: number;
  onZoomChange: (z: number) => void;
  showVehicles: boolean;
  showLights: boolean;
  showSpecs: boolean;
  onToggleVehicles: () => void;
  onToggleLights: () => void;
  onToggleSpecs: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ControlPanel({
  simSocket, zoom, onZoomChange,
  showVehicles, showLights, showSpecs,
  onToggleVehicles, onToggleLights, onToggleSpecs,
  isCollapsed = false,
  onToggleCollapse = () => {},
}: Props) {
  const { trafficLights } = useSimulationStore();
  const { user } = useAuthStore();
  const canEdit = user?.role === 'USER' || user?.role === 'ADMIN';

  const [globalSpeed, setGlobalSpeed] = useState(60);
  const [selectedLight, setSelectedLight] = useState<string | null>(null);

  const lightList = Object.values(trafficLights);

  const handleAddVehicle = () => {
    simSocket.current?.emit('vehicle:add', { speed: globalSpeed });
  };

  const handleRemoveVehicle = () => {
    simSocket.current?.emit('vehicle:remove', {});
  };

  const handleAddLight = () => {
    simSocket.current?.emit('light:add', {});
  };

  const handleRemoveLight = () => {
    if (!selectedLight) return;
    simSocket.current?.emit('light:remove', { id: selectedLight });
    setSelectedLight(null);
  };

  return (
    <aside className={`sim-left ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sim-collapse-btn" onClick={onToggleCollapse} title={isCollapsed ? 'Expandir' : 'Contraer'}>
        {isCollapsed ? '→' : '←'}
      </button>

      {/* ── CONTROLES DEL MAPA ── */}
      <div className="sim-section">
        <p className="sim-section-title">Controles del mapa</p>

        <label className="sim-label">Niveles del zoom</label>
        <input
          type="range"
          min={10}
          max={18}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="sim-slider"
        />

        <label className="sim-label" style={{ marginTop: '.5rem' }}>Visibilidad de capas</label>
        <div className="sim-checks">
          <label className="sim-check-row">
            <input type="checkbox" checked={showVehicles} onChange={onToggleVehicles} />
            Capa de vehículos
          </label>
          <label className="sim-check-row">
            <input type="checkbox" checked={showLights} onChange={onToggleLights} />
            Capa de semáforos
          </label>
          <label className="sim-check-row">
            <input type="checkbox" checked={showSpecs} onChange={onToggleSpecs} />
            Capa de especificaciones
          </label>
        </div>
      </div>

      {/* ── CONFIGURACIÓN DE VEHÍCULOS ── */}
      <div className="sim-section">
        <p className="sim-section-title">Configuración de vehículos</p>

        <label className="sim-label">Velocidad promedio</label>
        <div className="sim-speed-box">{globalSpeed} km/h</div>

        <div className="sim-speed-row">
          <button
            className="sim-speed-btn"
            onClick={() => setGlobalSpeed((v) => Math.max(5, v - 5))}
            disabled={!canEdit}
          >−</button>
          <input
            type="range"
            min={5}
            max={120}
            step={5}
            value={globalSpeed}
            onChange={(e) => setGlobalSpeed(Number(e.target.value))}
            disabled={!canEdit}
            style={{ flex: 1, accentColor: '#2258B1' }}
          />
          <button
            className="sim-speed-btn"
            onClick={() => setGlobalSpeed((v) => Math.min(120, v + 5))}
            disabled={!canEdit}
          >+</button>
        </div>

        <div className="sim-btn-row">
          <button className="sim-btn" onClick={handleAddVehicle} disabled={!canEdit}>
            Añadir
          </button>
          <button className="sim-btn" onClick={handleRemoveVehicle} disabled={!canEdit}>
            Eliminar
          </button>
        </div>
      </div>

      {/* ── CONFIGURACIÓN DE SEMÁFOROS ── */}
      <div className="sim-section">
        <p className="sim-section-title">Configuración de semáforos</p>

        <div className="sim-semaphore-list">
          {lightList.length === 0 ? (
            <span style={{ fontSize: '.75rem', color: '#9CA3AF', padding: '.2rem' }}>
              Sin semáforos activos
            </span>
          ) : (
            lightList.map((l) => (
              <button
                key={l.id}
                className={`sim-semaphore-item ${selectedLight === l.id ? 'selected' : ''}`}
                onClick={() => setSelectedLight(l.id === selectedLight ? null : l.id)}
              >
                {l.name || `Semáforo ${l.id.slice(0, 8)}`}
              </button>
            ))
          )}
        </div>

        <div className="sim-btn-row">
          <button className="sim-btn" onClick={handleAddLight} disabled={!canEdit}>
            Añadir
          </button>
          <button className="sim-btn" onClick={handleRemoveLight} disabled={!canEdit || !selectedLight}>
            Eliminar
          </button>
        </div>
      </div>

    </aside>
  );
}
