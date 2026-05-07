import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

// Custom pin icon
const pinIcon = L.divIcon({
  className: 'pin-marker',
  html: '<div class="pin-marker-inner"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const pendingPinIcon = L.divIcon({
  className: 'pin-marker',
  html: '<div class="pin-marker-inner" style="width:24px;height:24px;background:#FAC775;border-color:#854F0B;animation:pulse 1.2s ease-in-out infinite"></div><style>@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.85}}</style>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function RemoveBounds() {
  const map = useMap()
  useEffect(() => {
    map.setMaxBounds(null)
  }, [map])
  return null
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  })
  return null
}

function ClosePopupOnMove() {
  const map = useMap()
  useMapEvents({
    movestart: () => map.closePopup(),
  })
  return null
}

export default function PinMap({ pins, pendingLocation, onMapClick }) {
  return (
    <MapContainer
      center={[39.5, -98.5]}
      zoom={4}
      minZoom={2}
      maxZoom={12}
      zoomControl={true}
      worldCopyJump={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RemoveBounds />
      <MapClickHandler onMapClick={onMapClick} />
      <ClosePopupOnMove />

      {pins.map(pin => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
          <Popup>
            <div className="font-sans">
              <p className="font-medium text-sm text-navy m-0">
                {pin.first_name} · {pin.beach_name}, {pin.state}
              </p>
              {pin.note && (
                <p className="text-xs text-gray-600 m-0 mt-1 italic">
                  "{pin.note}"
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {pendingLocation && (
        <Marker
          position={[pendingLocation.lat, pendingLocation.lng]}
          icon={pendingPinIcon}
        />
      )}
    </MapContainer>
  )
}
