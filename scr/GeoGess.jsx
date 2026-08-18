import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const LOCATIONS = {
  Monde: [
    { lat: 48.8566, lng: 2.3522 },
    { lat: 51.5074, lng: -0.1278 },
    { lat: 40.7128, lng: -74.006 },
    { lat: 35.6762, lng: 139.6503 },
    { lat: -33.8688, lng: 151.2093 },
    { lat: 52.52, lng: 13.405 },
    { lat: 41.9028, lng: 12.4964 },
    { lat: -23.5505, lng: -46.6333 },
    { lat: 1.3521, lng: 103.8198 },
    { lat: 19.4326, lng: -99.1332 }
  ],

  Europe: [
    { lat: 48.8566, lng: 2.3522 },
    { lat: 51.5074, lng: -0.1278 },
    { lat: 52.52, lng: 13.405 },
    { lat: 41.9028, lng: 12.4964 },
    { lat: 40.4168, lng: -3.7038 },
    { lat: 59.3293, lng: 18.0686 }
  ],

  Afrique: [
    { lat: -1.2921, lng: 36.8219 },
    { lat: 30.0444, lng: 31.2357 },
    { lat: -26.2041, lng: 28.0473 },
    { lat: 14.7167, lng: -17.4677 },
    { lat: -33.9249, lng: 18.4241 }
  ],

  Amériques: [
    { lat: 40.7128, lng: -74.006 },
    { lat: -23.5505, lng: -46.6333 },
    { lat: 19.4326, lng: -99.1332 },
    { lat: 43.6532, lng: -79.3832 },
    { lat: 49.2827, lng: -123.1207 },
    { lat: -34.6037, lng: -58.3816 }
  ],

  Asie: [
    { lat: 35.6762, lng: 139.6503 },
    { lat: 1.3521, lng: 103.8198 },
    { lat: 13.7563, lng: 100.5018 },
    { lat: 25.2048, lng: 55.2708 },
    { lat: 37.5665, lng: 126.978 }
  ],

  Océanie: [
    { lat: -33.8688, lng: 151.2093 },
    { lat: -37.8136, lng: 144.9631 },
    { lat: -27.4698, lng: 153.0251 }
  ]
};

function randomLocation(continent) {
  const list =
    LOCATIONS[continent] ||
    LOCATIONS.Monde;

  return list[
    Math.floor(
      Math.random() * list.length
    )
  ];
}

function distanceKm(a, b) {
  const R = 6371;

  const lat1 =
    a.lat * Math.PI / 180;

  const lat2 =
    b.lat * Math.PI / 180;

  const dLat =
    (b.lat - a.lat) *
    Math.PI / 180;

  const dLng =
    (b.lng - a.lng) *
    Math.PI / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(Math.sqrt(x))
  );
}

/* =========================
   STREET VIEW
========================= */

function StreetView({
  position,
  onReady
}) {
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStreetView() {
      try {
        const apiKey =
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          console.error(
            "VITE_GOOGLE_MAPS_API_KEY manquante"
          );

          return;
        }

        const loader = new Loader({
          apiKey,
          version: "weekly"
        });

        const google =
          await loader.load();

        if (cancelled) return;

        panoramaRef.current =
          new google.maps.StreetViewPanorama(
            containerRef.current,
            {
              position,
              pov: {
                heading:
                  Math.random() * 360,
                pitch: 0
              },

              zoom: 1,

              addressControl: false,

              fullscreenControl: true,

              motionTracking: true,

              motionTrackingControl: true,

              linksControl: true,

              clickToGo: true
            }
          );

        onReady?.(
          panoramaRef.current
        );

      } catch (error) {
        console.error(
          "Erreur Google Street View:",
          error
        );
      }
    }

    loadStreetView();

    return () => {
      cancelled = true;

      if (panoramaRef.current) {
        panoramaRef.current.setVisible(false);
        panoramaRef.current = null;
      }
    };
  }, [position, onReady]);

  return (
    <div
      ref={containerRef}
      className="street-view"
    />
  );
}

/* =========================
   MINI MAP
========================= */

function GuessMap({
  target,
  guess,
  setGuess,
  visible
}) {
  const mapRef = useRef(null);
  const elementRef = useRef(null);
  const markerRef = useRef(null);
  const targetMarkerRef =
    useRef(null);

  useEffect(() => {
    if (
      !visible ||
      !elementRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map =
      new window.google.maps.Map(
        elementRef.current,
        {
          center: {
            lat: 20,
            lng: 0
          },

          zoom: 2,

          streetViewControl: false,

          fullscreenControl: false,

          mapTypeControl: false
        }
      );

    map.addListener(
      "click",
      (event) => {
        setGuess({
          lat:
            event.latLng.lat(),

          lng:
            event.latLng.lng()
        });
      }
    );

    mapRef.current = map;

  }, [visible, setGuess]);

  useEffect(() => {
    if (!mapRef.current || !guess) {
      return;
    }

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current =
      new window.google.maps.Marker({
        position: guess,
        map: mapRef.current
      });

  }, [guess]);

  useEffect(() => {
    if (
      !mapRef.current ||
      !target
    ) {
      return;
    }

    if (targetMarkerRef.current) {
      targetMarkerRef.current.setMap(null);
    }

    targetMarkerRef.current =
      new window.google.maps.Marker({
        position: target,
        map: mapRef.current,
        icon: {
          path:
            window.google.maps.SymbolPath
              .CIRCLE,

          scale: 8,

          fillColor: "#ff3b30",

          fillOpacity: 1,

          strokeColor: "#ffffff",

          strokeWeight: 2
        }
      });

  }, [target]);

  return (
    <div
      ref={elementRef}
      className="guess-map"
    />
  );
}

/* =========================
   GEOGUESS
========================= */

export default function GeoGuess({
  continent = "Monde",
  onExit
}) {
  const [round, setRound] =
    useState(1);

  const [target, setTarget] =
    useState(() =>
      randomLocation(continent)
    );

  const [guess, setGuess] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [totalScore, setTotalScore] =
    useState(0);

  const [showMap, setShowMap] =
    useState(false);

  const [streetViewKey, setStreetViewKey] =
    useState(0);

  function openMap() {
    setShowMap(true);
  }

  function validate() {
    if (!guess) return;

    const distance =
      distanceKm(target, guess);

    const points = Math.max(
      0,
      Math.round(
        5000 *
          Math.exp(
            -distance / 2000
          )
      )
    );

    setTotalScore(
      old => old + points
    );

    setResult({
      distance,
      points
    });
  }

  function nextRound() {
    if (round >= 5) {
      alert(
        `Partie terminée !\n\nScore final : ${
          totalScore
        } points`
      );

      onExit();
      return;
    }

    setRound(
      old => old + 1
    );

    setTarget(
      randomLocation(continent)
    );

    setGuess(null);

    setResult(null);

    setShowMap(false);

    setStreetViewKey(
      old => old + 1
    );
  }

  return (
    <div className="geoguess">

      {/* HEADER */}

      <div className="geoguess-header">

        <button
          className="exit-button"
          onClick={onExit}
        >
          ←
        </button>

        <strong>
          GEORUSH
        </strong>

        <span>
          {round}/5
        </span>

        <span>
          {totalScore} pts
        </span>

      </div>

      {/* STREET VIEW */}

      <div className="street-container">

        <StreetView
          key={streetViewKey}
          position={target}
        />

        <div className="street-overlay">

          <span>
            🌍 {continent}
          </span>

          <span>
            Manche {round}/5
          </span>

        </div>

      </div>

      {/* MAP */}

      {showMap && !result && (
        <div className="guess-map-wrapper">

          <GuessMap
            target={target}
            guess={guess}
            setGuess={setGuess}
            visible={showMap}
          />

          <div className="map-help">
            📍 Appuie sur la carte pour
            placer ton marqueur
          </div>

        </div>
      )}

      {/* BUTTON OPEN MAP */}

      {!showMap && !result && (
        <button
          className="open-map-button"
          onClick={openMap}
        >
          🗺️ OUVRIR LA CARTE
        </button>
      )}

      {/* VALIDATE */}

      {showMap && !result && (
        <button
          className="validate-button"
          disabled={!guess}
          onClick={validate}
        >
          🎯 VALIDER
        </button>
      )}

      {/* RESULT */}

      {result && (
        <div className="geo-result">

          <div className="geo-result-score">
            +{result.points}
          </div>

          <div className="geo-result-distance">
            📏{" "}
            {result.distance.toFixed(1)}
            {" "}km
          </div>

          <button
            className="next-button"
            onClick={nextRound}
          >
            {round < 5
              ? "MANCHE SUIVANTE →"
              : "TERMINER"}
          </button>

        </div>
      )}

    </div>
  );
}