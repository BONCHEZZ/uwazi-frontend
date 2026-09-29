declare module 'leaflet' {
  const leaflet: any
  export default leaflet
}

declare module 'react-leaflet' {
  import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
  export { MapContainer, TileLayer, Marker, Popup, useMap }
}
