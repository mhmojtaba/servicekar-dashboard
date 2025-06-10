import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaStore } from "react-icons/fa";
import styles from "./SelectLocation.module.css";

const SelectLocation = ({ location, setLocation }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            setLocation([latitude, longitude]);
          },
          () => {
            setLocation([32.644397, 51.667455]);
          }
        );
      } else {
        setLocation([32.644397, 51.667455]);
      }
    };

    if (location.length === 0) {
      getUserLocation();
    }
  }, [setLocation]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView(location, 16);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        const shopIcon = L.divIcon({
          className: "",
          html: ReactDOMServer.renderToStaticMarkup(
            <FaStore style={{ fontSize: "32px", color: "#2C3E50" }} />
          ),
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
      } else {
        mapRef.current.setView(location, mapRef.current.getZoom());
      }

      const updateLocation = () => {
        const { lat, lng } = mapRef.current.getCenter();
        setLocation([lat, lng]);
      };

      mapRef.current.on("moveend", updateLocation);
      mapRef.current.on("zoomend", updateLocation);

      return () => {
        mapRef.current.off("moveend", updateLocation);
        mapRef.current.off("zoomend", updateLocation);
      };
    }
  }, [location]);

  return (
    <div className={styles.container}>
      <div
        ref={mapContainerRef}
        className={styles.selectLocationMap}
        style={{ height: "100%" }}
      />
      <FaMapMarkerAlt className={styles.markerIcon} />
    </div>
  );
};

export default SelectLocation;
