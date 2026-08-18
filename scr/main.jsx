import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

import Classic from "./Classic";
import Chrono from "./Chrono";
import GeoGuess from "./GeoGuess";

const continents = [
  "Monde",
  "Europe",
  "Afrique",
  "Amériques",
  "Asie",
  "Océanie"
];
function App() {
  const [mode, setMode] = useState(null);
  const [continent, setContinent] = useState("Monde");

  function goHome() {
    setMode(null);
  }

  if (mode === "geoguess") {
    return (
      <GeoGuess
        continent={continent}
        onExit={goHome}
      />
    );
  }

  if (mode === "classic") {
    return (
      <Classic
        continent={continent}
        onBack={goHome}
      />
    );
  }

  if (mode === "chrono") {
    return (
      <Chrono
        continent={continent}
        onBack={goHome}
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

            <h2>
              Devine le monde
            </h2>

            <p>
              Teste tes connaissances
              géographiques.
            </p>
          </div>
        </div>

        <h3>Continent</h3>

        <div className="chips">
          {continents.map((name) => (
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
          ))}
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
            <h2>Classic</h2>

            <p>
              Questions • 100 points
            </p>
          </div>

          <span>→</span>
        </button>

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
            <h2>Chrono</h2>

            <p>
              Réponds avant la fin du temps
            </p>
          </div>

          <span>→</span>
        </button>

      </div>
    </div>
  );
}
const rootElement =
  document.getElementById("root");

const root =
  createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
