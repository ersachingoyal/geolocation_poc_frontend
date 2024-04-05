import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React from "react";

const MapPointer = ({latitude, longitude, address}) => {
  return (
    <div className="my-5">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        className="vh-100"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
           {address?.suburb} {address?.city}, {address?.county}, {address?.state_district}, {address?.state}, {address?.postcode}, 
           {address?.country} 
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPointer;
