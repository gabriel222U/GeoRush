import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

import Classic from "./Classic";
import Chrono from "./Chrono";

const locations = {
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
  const list = locations[continent] || locations.Monde;

  return list[
    Math.floor(Math.random() * list.length)
  ];
}

function distanceKm(a, b) {
  const R = 6371;

  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;

  const dLat =
    (b.lat - a.lat) * Math.PI / 180;

  const dLng =
    (b.lng - a.lng) * Math.PI / 180;

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
   CARTE GEOGUESS
========================= */

function MapGame({
  target,
  guess,
  setGuess,
  result
}) {
  const mapRef = useRef(null);
  const elementRef = useRef(null);
  const guessMarkerRef = useRef(null);
  const targetMarkerRef = useRef(null);

  useEffect(() => {
    if (
      !elementRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map = L.map(
      elementRef.current,
      {
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true
      }
    ).setView([20, 0], 2);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    map.on("click", (event) => {
      setGuess({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    });

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setGuess]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !guess) {
      return;
    }

    if (guessMarkerRef.current) {
      guessMarkerRef.current.remove();
    }

    guessMarkerRef.current = L.marker([
      guess.lat,
      guess.lng
    ]).addTo(map);
  }, [guess]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !result) {
      return;
    }

    if (targetMarkerRef.current) {
      targetMarkerRef.current.remove();
    }

    targetMarkerRef.current = L.marker([
      target.lat,
      target.lng
    ]).addTo(map);

    if (guess) {
      const bounds = L.latLngBounds([
        [guess.lat, guess.lng],
        [target.lat, target.lng]
      ]);

      map.fitBounds(
        bounds,
        {
          padding: [50, 50]
        }
      );
    }
  }, [result, target, guess]);

  return (
    <div
      ref={elementRef}
      className="game-map"
    />
  );
}

/* =========================
   GEOGUESS
========================= */

function GeoGuess({
  continent,
  onExit
}) {
  const [round, setRound] = useState(1);

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

  function validate() {
    if (!guess) {
      return;
    }

    const distance =
      distanceKm(target, guess);

    const points = Math.max(
      0,
      Math.round(
        5000 *
        Math.exp(-distance / 2000)
      )
    );

    setTotalScore(
      (old) => old + points
    );

    setResult({
      distance,
      points
    });
  }

  function nextRound() {
    if (round >= 5) {
      alert(
        `Partie terminée !\n\nScore final : ${totalScore} points`
      );

      onExit();
      return;
    }

    setRound(
      (old) => old + 1
    );

    setTarget(
      randomLocation(continent)
    );

    setGuess(null);
    setResult(null);
  }

  return (
    <div className="game">

      <div className="game-header">

        <button onClick={onExit}>
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

      <div className="map-container">

        <MapGame
          target={target}
          guess={guess}
          setGuess={setGuess}
          result={result}
        />

        {!result && (
          <div className="map-message">
            📍 Touche la carte pour placer ton guess
          </div>
        )}

      </div>

      {!result ? (

        <button
          className="validate-button"
          disabled={!guess}
          onClick={validate}
        >
          🎯 VALIDER
        </button>

      ) : (

        <div className="result-panel">

          <div>

            <strong>
              +{result.points} points
            </strong>

            <span>
              📏{" "}
              {result.distance.toFixed(1)}
              {" "}km
            </span>

          </div>

          <button
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

/* =========================
   ACCUEIL
========================= */

function Home({
  continent,
  setContinent,
  setMode
}) {
  return (
    <div className="app">

      <div className="home">

        <div className="hello">
          Salut
        </div>

        <h1>
          Relax
        </h1>

        <div className="hero">

          <span>
            🌍
          </span>

          <div>

            <small>
              GEORUSH
            </small>

            <h2>
              Devine le monde
            </h2>

            <p>
              Place ton marqueur le plus
              près possible du lieu mystère.
            </p>

          </div>

        </div>

        <h3>
          Continent
        </h3>

        <div className="chips">

          {Object.keys(locations).map(
            (name) => (

              <button
                key={name}
                className={
                  continent === name
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setContinent(name)
                }
              >
                {name}
              </button>

            )
          )}

        </div>

        <h3>
          Modes solo
        </h3>

        {/* GEOGUESS */}

        <button
          className="mode-card"
          onClick={() =>
            setMode("geoguess")
          }
        >

          <div className="mode-icon">
            🌍
          </div>

          <div>

            <h2>
              GeoGuess
            </h2>

            <p>
              5 manches • 5000 points
            </p>

          </div>

          <span>
            →
          </span>

        </button>

        {/* CLASSIC */}

        <button
          className="mode-card"
          onClick={() =>
            setMode("classic")
          }
        >

          <div className="mode-icon">
            🧠
          </div>

          <div>

            <h2>
              Classic
            </h2>

            <p>
              10 questions • 1000 points
            </p>

          </div>

          <span>
            →
          </span>

        </button>

        {/* CHRONO */}

        <button
          className="mode-card"
          onClick={() =>
            setMode("chrono")
          }
        >

          <div className="mode-icon">
            ⏱️
          </div>

          <div>

            <h2>
              Chrono
            </h2>

            <p>
              15 secondes par question
            </p>

          </div>

          <span>
            →
          </span>

        </button>

      </div>

    </div>
  );
}

/* =========================
   APP
========================= */

function App() {

  const [mode, setMode] =
    useState(null);

  const [continent, setContinent] =
    useState("Monde");

  if (mode === "geoguess") {

    return (
      <GeoGuess
        continent={continent}
        onExit={() =>
          setMode(null)
        }
      />
    );
  }

  if (mode === "classic") {

    return (
      <Classic
        onBack={() =>
          setMode(null)
        }
      />
    );
  }

  if (mode === "chrono") {

    return (
      <Chrono
        onBack={() =>
          setMode(null)
        }
      />
    );
  }

  return (
    <Home
      continent={continent}
      setContinent={setContinent}
      setMode={setMode}
    />
  );
}

/* =========================
   LANCEMENT
========================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);