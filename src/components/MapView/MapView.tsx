import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useSimulationStore } from '../../stores/simulationStore';
import VehicleMarker from './VehicleMarker';
import TrafficLightMarker from './TrafficLightMarker';
import type { RefObject } from 'react';
import type { Socket } from 'socket.io-client';

// Controls the Leaflet zoom from outside the component
function ZoomController({ zoom }: { zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setZoom(zoom); }, [zoom, map]);
  return null;
}

function Markers({
  simSocket, showVehicles, showLights,
}: {
  simSocket: RefObject<Socket | null>;
  showVehicles: boolean;
  showLights: boolean;
}) {
  useMap();
  const vehicles = useSimulationStore((s) => s.vehicles);
  const trafficLights = useSimulationStore((s) => s.trafficLights);

  return (
    <>
      {showLights && Object.values(trafficLights).map((light) => (
        <TrafficLightMarker key={light.id} light={light} />
      ))}
      {showVehicles && Object.values(vehicles).map((vehicle) => (
        <VehicleMarker key={vehicle.id} vehicle={vehicle} simSocket={simSocket} />
      ))}
    </>
  );
}

interface Props {
  simSocket: RefObject<Socket | null>;
  zoom?: number;
  showVehicles?: boolean;
  showLights?: boolean;
}

export default function MapView({
  simSocket,
  zoom = 13,
  showVehicles = true,
  showLights = true,
}: Props) {
  return (
    <MapContainer
      center={[4.6534, -74.0836]}
      zoom={zoom}
      className="w-full h-full"
      zoomControl={false}
    >
      <ZoomController zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <Markers simSocket={simSocket} showVehicles={showVehicles} showLights={showLights} />
    </MapContainer>
  );
}
