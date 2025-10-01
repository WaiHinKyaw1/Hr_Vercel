"use client";

import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

export default function MapWithSearch() {
  const [center, setCenter] = useState({ lat: 16.8409, lng: 96.1735 }); // Default Yangon
  const [markers, setMarkers] = useState([{ lat: 16.8409, lng: 96.1735 }]);
  const searchBoxRef = useRef(null);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const newCenter = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setCenter(newCenter);
    setMarkers([newCenter]);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <StandaloneSearchBox
        onLoad={ref => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlacesChanged}
      >
        <input
          type="text"
          placeholder="Search location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 10,
          }}
        />
      </StandaloneSearchBox>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {markers.map((m, i) => (
          <Marker key={i} position={m} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
