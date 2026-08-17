import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const roundsTotal = 5;

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

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function distanceKm(a, b) {
  const R = 6371;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(x));
}

function GuessMarker({ onGuess }) {
  useMapEvents({
    click(e) {
      onGuess({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });

  return null;
}

function FitBounds({ target, guess }) {
  const map = useMap();

  if (target && guess) {
    const bounds = L.latLngBounds([
      [target.lat, target.lng],
      [guess.lat, guess.lng]
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50]
    });
  }

  return null;
}

function GeoGuess({ continent, onExit }) {
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState(() =>
    getRandomLocation(continent)
  );

  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  function validate() {
    if (!guess || !target) return;

    const distance = distanceKm(target, guess);

    const points = Math.max(
      0,
      Math.round(5000 * Math.exp(-distance / 2000))
    );

    setTotalScore((old) => old + points);

    setResult({
      distance,
      points
    });
  }

  function nextRound() {
    if (round >= roundsTotal) {
      alert(
        `Partie terminée !\n\nScore : ${totalScore} points`
      );

      onExit();
      return;
    }

    setRound((old) => old + 1);
    setTarget(getRandomLocation(continent));
    setGuess(null);
    setResult(null);
  }

  return (
    <div className="game">
      <div className="game-header">
        <button onClick={onExit}>←</button>

        <strong>GEORUSH</strong>

        <span>
          {round}/{roundsTotal}
        </span>

        <span>{totalScore} pts</span>
      </div>

      <div className="map-container">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom={true}
          className="game-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GuessMarker onGuess={setGuess} />

          {guess && (
            <Marker
              position={[guess.lat, guess.lng]}
              icon={markerIcon}
            />
          )}

          {result && (
            <>
              <Marker
                position={[target.lat, target.lng]}
                icon={markerIcon}
              />

              <FitBounds
                target={target}
                guess={guess}
              />
            </>
          )}
        </MapContainer>

        <div className="map-message">
          📍 Clique sur la carte pour placer ton guess
        </div>
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
            <strong>{result.points} points</strong>

            <span>
              📏 {result.distance.toFixed(1)} km
            </span>
          </div>

          <button onClick={nextRound}>
            {round < roundsTotal
              ? "MANCHE SUIVANTE →"
              : "TERMINER"}
          </button>
        </div>
      )}
    </div>
  );
}

function getRandomLocation(continent) {
  const list =
    locations[continent] || locations.Monde;

  return list[
    Math.floor(Math.random() * list.length)
  ];
}

function App() {
  const [mode, setMode] = useState(null);

  const [continent, setContinent] =
    useState("Monde");

  if (mode === "geoguess") {
    return (
      <GeoGuess
        continent={continent}
        onExit={() => setMode(null)}
      />
    );
  }

  return (
    <div className="app">
      <div className="home">
        <div className="hello">
          Salut
        </div>

        <h1>Relax</h1>

        <div className="hero">
          <span>🌍</span>

          <div>
            <small>GEORUSH</small>
            <h2>Devine le monde</h2>

            <p>
              Place ton marqueur le plus près
              possible du lieu mystère.
            </p>
          </div>
        </div>

        <h3>Continent</h3>

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

        <h3>Modes solo</h3>

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
            <h2>GeoGuess</h2>

            <p>
              5 manches • 5000 points
            </p>
          </div>

          <span>→</span>
        </button>
      </div>
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);