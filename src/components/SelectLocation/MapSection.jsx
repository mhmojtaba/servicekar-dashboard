import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { MdMyLocation } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  return (
    <Marker
      draggable
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            const { lat, lng } = marker.getLatLng();
            setPosition(lat, lng);
          }
        },
      }}
      position={position}
      ref={markerRef}
    />
  );
}

function MapCenterUpdater({ center, zoom, shouldUpdateZoom }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      if (shouldUpdateZoom && zoom) {
        map.setView(center, zoom);
      } else {
        map.setView(center, map.getZoom());
      }
    }
  }, [center, zoom, shouldUpdateZoom, map]);

  return null;
}

export default function MapSection({ location, onChange }) {
  const defaultCenter = [35.6892, 51.389];
  const [zoom, setZoom] = useState(13);
  const [shouldUpdateZoom, setShouldUpdateZoom] = useState(false);

  const getInitialCenter = () => {
    if (location) {
      if (Array.isArray(location) && location.length === 2) {
        return location;
      } else if (location.lat && location.lng) {
        return [location.lat, location.lng];
      }
    }
    return defaultCenter;
  };

  const [center, setCenter] = useState(getInitialCenter);
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (location) {
      let newCenter;
      if (Array.isArray(location) && location.length === 2) {
        newCenter = location;
      } else if (location.lat && location.lng) {
        newCenter = [location.lat, location.lng];
      }

      if (
        newCenter &&
        (newCenter[0] !== center[0] || newCenter[1] !== center[1])
      ) {
        setCenter(newCenter);
        setShouldUpdateZoom(false);
      }
    }
  }, [location, center]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("مرورگر شما از تشخیص موقعیت جغرافیایی پشتیبانی نمی‌کند");
      return;
    }

    setLoadingLoc(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const newCenter = [lat, lng];
        setCenter(newCenter);
        setZoom(17);
        setShouldUpdateZoom(true);
        onChange(lat, lng);
        setLoadingLoc(false);
      },
      (err) => {
        console.error("Error getting location:", err.message);

        let errorMessage = "خطا در دریافت موقعیت مکانی";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "دسترسی به موقعیت مکانی رد شده است";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "موقعیت مکانی در دسترس نیست";
            break;
          case err.TIMEOUT:
            errorMessage = "زمان انتظار برای دریافت موقعیت به پایان رسید";
            break;
        }

        alert(errorMessage);
        setLoadingLoc(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const focusOnCurrentLocation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (location) {
      let currentCenter;
      if (Array.isArray(location) && location.length === 2) {
        currentCenter = location;
      } else if (location.lat && location.lng) {
        currentCenter = [location.lat, location.lng];
      }

      if (currentCenter) {
        setCenter(currentCenter);
        setZoom(17);
        setShouldUpdateZoom(true);
      }
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onChange(lat, lng);
      },
    });
    return null;
  };

  const getMarkerPosition = () => {
    if (location) {
      if (Array.isArray(location) && location.length === 2) {
        return location;
      } else if (location.lat && location.lng) {
        return [location.lat, location.lng];
      }
    }
    return null;
  };

  const markerPosition = getMarkerPosition();

  return (
    <div className="relative">
      <div className="absolute bottom-5 right-2 z-[999] flex items-center space-x-2 p-2 rounded">
        <button
          onClick={useMyLocation}
          disabled={loadingLoc}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="استفاده از موقعیت فعلی"
        >
          {loadingLoc ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MdMyLocation className="w-4 h-4" />
          )}
        </button>
      </div>

      {markerPosition && (
        <div className="absolute top-[25%] left-[11px] z-[999] flex items-center border border-gray-400 rounded shadow">
          <button
            onClick={(e) => focusOnCurrentLocation(e)}
            disabled={loadingLoc}
            className="flex items-center p-2 text-sm bg-white text-black rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="تمرکز روی موقعیت انتخاب شده"
          >
            <FaRegQuestionCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: 300, width: "100%" }}
        className="rounded border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <MapCenterUpdater
          center={center}
          zoom={zoom}
          shouldUpdateZoom={shouldUpdateZoom}
        />
        {markerPosition && (
          <DraggableMarker position={markerPosition} setPosition={onChange} />
        )}
      </MapContainer>
    </div>
  );
}
