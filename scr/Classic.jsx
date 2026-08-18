import React, { useState } from "react";

const QUESTIONS = {
  Monde: [
    {
      question: "Quelle est la capitale de la France ?",
      answers: ["Paris", "Lyon", "Marseille", "Bordeaux"],
      correct: "Paris"
    },
    {
      question: "Quelle est la capitale du Japon ?",
      answers: ["Tokyo", "Kyoto", "Osaka", "Nara"],
      correct: "Tokyo"
    },
    {
      question: "Quelle est la capitale du Canada ?",
      answers: ["Toronto", "Ottawa", "Vancouver", "Montréal"],
      correct: "Ottawa"
    },
    {
      question: "Quelle est la capitale de l'Australie ?",
      answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: "Canberra"
    },
    {
      question: "Quel est le plus grand pays du monde ?",
      answers: ["Canada", "Chine", "Russie", "États-Unis"],
      correct: "Russie"
    },
    {
      question: "Dans quel pays se trouve le Machu Picchu ?",
      answers: ["Pérou", "Chili", "Bolivie", "Mexique"],
      correct: "Pérou"
    },
    {
      question: "Quelle est la capitale de l'Égypte ?",
      answers: ["Alexandrie", "Le Caire", "Gizeh", "Louxor"],
      correct: "Le Caire"
    },
    {
      question: "Quelle est la capitale du Brésil ?",
      answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
      correct: "Brasília"
    },
    {
      question: "Quelle est la capitale de l'Espagne ?",
      answers: ["Barcelone", "Séville", "Madrid", "Valence"],
      correct: "Madrid"
    },
    {
      question: "Quelle est la capitale de l'Allemagne ?",
      answers: ["Munich", "Berlin", "Hambourg", "Francfort"],
      correct: "Berlin"
    },
    {
      question: "Quel pays possède la forme d'une botte ?",
      answers: ["Italie", "Grèce", "Espagne", "Portugal"],
      correct: "Italie"
    },
    {
      question: "Quelle est la capitale de la Chine ?",
      answers: ["Shanghai", "Pékin", "Hong Kong", "Nankin"],
      correct: "Pékin"
    }
  ],

  Europe: [
    {
      question: "Quelle est la capitale de l'Italie ?",
      answers: ["Rome", "Milan", "Naples", "Venise"],
      correct: "Rome"
    },
    {
      question: "Quelle est la capitale du Portugal ?",
      answers: ["Porto", "Lisbonne", "Braga", "Faro"],
      correct: "Lisbonne"
    },
    {
      question: "Quelle est la capitale de la Grèce ?",
      answers: ["Athènes", "Sparte", "Thessalonique", "Corinthe"],
      correct: "Athènes"
    },
    {
      question: "Quelle est la capitale de la Norvège ?",
      answers: ["Oslo", "Bergen", "Stockholm", "Helsinki"],
      correct: "Oslo"
    },
    {
      question: "Quelle est la capitale de la Suède ?",
      answers: ["Oslo", "Stockholm", "Göteborg", "Malmö"],
      correct: "Stockholm"
    },
    {
      question: "Quelle est la capitale de la Pologne ?",
      answers: ["Cracovie", "Varsovie", "Gdańsk", "Wrocław"],
      correct: "Varsovie"
    },
    {
      question: "Quelle est la capitale de la Belgique ?",
      answers: ["Bruxelles", "Anvers", "Liège", "Gand"],
      correct: "Bruxelles"
    },
    {
      question: "Quelle est la capitale de l'Irlande ?",
      answers: ["Dublin", "Cork", "Galway", "Limerick"],
      correct: "Dublin"
    }
  ],

  Afrique: [
    {
      question: "Quelle est la capitale de l'Égypte ?",
      answers: ["Le Caire", "Alexandrie", "Gizeh", "Louxor"],
      correct: "Le Caire"
    },
    {
      question: "Quelle est la capitale du Maroc ?",
      answers: ["Casablanca", "Rabat", "Marrakech", "Fès"],
      correct: "Rabat"
    },
    {
      question: "Quelle est la capitale du Sénégal ?",
      answers: ["Dakar", "Thiès", "Saint-Louis", "Touba"],
      correct: "Dakar"
    },
    {
      question: "Quelle est la capitale du Kenya ?",
      answers: ["Mombasa", "Nairobi", "Kisumu", "Malindi"],
      correct: "Nairobi"
    },
    {
      question: "Quelle est la capitale de l'Afrique du Sud ?",
      answers: ["Le Cap", "Pretoria", "Johannesburg", "Durban"],
      correct: "Pretoria"
    },
    {
      question: "Quelle est la capitale de l'Algérie ?",
      answers: ["Oran", "Alger", "Constantine", "Annaba"],
      correct: "Alger"
    }
  ],

  Amériques: [
    {
      question: "Quelle est la capitale des États-Unis ?",
      answers: ["New York", "Washington D.C.", "Boston", "Chicago"],
      correct: "Washington D.C."
    },
    {
      question: "Quelle est la capitale du Brésil ?",
      answers: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
      correct: "Brasília"
    },
    {
      question: "Quelle est la capitale du Mexique ?",
      answers: ["Cancún", "Mexico", "Guadalajara", "Monterrey"],
      correct: "Mexico"
    },
    {
      question: "Quelle est la capitale de l'Argentine ?",
      answers: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"],
      correct: "Buenos Aires"
    },
    {
      question: "Quelle est la capitale du Chili ?",
      answers: ["Santiago", "Valparaíso", "Concepción", "Arica"],
      correct: "Santiago"
    },
    {
      question: "Quelle est la capitale du Canada ?",
      answers: ["Toronto", "Ottawa", "Vancouver", "Montréal"],
      correct: "Ottawa"
    }
  ],

  Asie: [
    {
      question: "Quelle est la capitale du Japon ?",
      answers: ["Tokyo", "Kyoto", "Osaka", "Nara"],
      correct: "Tokyo"
    },
    {
      question: "Quelle est la capitale de la Chine ?",
      answers: ["Shanghai", "Pékin", "Hong Kong", "Xi'an"],
      correct: "Pékin"
    },
    {
      question: "Quelle est la capitale de la Corée du Sud ?",
      answers: ["Busan", "Séoul", "Incheon", "Daegu"],
      correct: "Séoul"
    },
    {
      question: "Quelle est la capitale de l'Inde ?",
      answers: ["Mumbai", "New Delhi", "Bangalore", "Jaipur"],
      correct: "New Delhi"
    },
    {
      question: "Quelle est la capitale de la Thaïlande ?",
      answers: ["Bangkok", "Phuket", "Pattaya", "Chiang Mai"],
      correct: "Bangkok"
    },
    {
      question: "Quelle est la capitale de la Turquie ?",
      answers: ["Istanbul", "Ankara", "Izmir", "Bursa"],
      correct: "Ankara"
    }
  ],

  Océanie: [
    {
      question: "Quelle est la capitale de l'Australie ?",
      answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correct: "Canberra"
    },
    {
      question: "Quelle est la capitale de la Nouvelle-Zélande ?",
      answers: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
      correct: "Wellington"
    },
    {
      question: "Quelle est la capitale des Fidji ?",
      answers: ["Suva", "Nadi", "Lautoka", "Labasa"],
      correct: "Suva"
    },
    {
      question: "Quelle est la capitale de la Papouasie-Nouvelle-Guinée ?",
      answers: ["Port Moresby", "Lae", "Madang", "Goroka"],
      correct: "Port Moresby"
    }
  ]
};

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

export default function Classic({
  continent = "Monde",
  onBack
}) {
  const source =
    QUESTIONS[continent] || QUESTIONS.Monde;

  const [questions] = useState(() =>
    shuffle(source)
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  function chooseAnswer(answer) {
    if (selected) return;

    setSelected(answer);

    if (answer === current.correct) {
      setScore((old) => old + 100);
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((old) => old + 1);
        setSelected(null);
      }
    }, 600);
  }

  if (finished) {
    return (
      <div className="game-page">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Retour
        </button>

        <div className="game-result">

          <div className="result-icon">
            🏆
          </div>

          <h1>
            Partie terminée !
          </h1>

          <div className="result-score">
            {score}
          </div>

          <p>
            / {questions.length * 100} points
          </p>

          <button
            className="main-button"
            onClick={onBack}
          >
            Retour aux modes
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="game-page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Retour
      </button>

      <div className="game-header">

        <span>
          CLASSIC
        </span>

        <strong>
          {index + 1}/{questions.length}
        </strong>

        <span>
          🌍 {continent}
        </span>

      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{
            width:
              `${((index + 1) / questions.length) * 100}%`
          }}
        />

      </div>

      <div className="question-card">

        <div className="question-number">
          QUESTION {index + 1}
        </div>

        <h1>
          {current.question}
        </h1>

        <div className="answers">

          {current.answers.map(
            (answer) => {

              let className = "answer";

              if (selected) {

                if (
                  answer === current.correct
                ) {
                  className += " correct";
                }

                if (
                  answer === selected &&
                  answer !== current.correct
                ) {
                  className += " wrong";
                }
              }

              return (
                <button
                  key={answer}
                  className={className}
                  onClick={() =>
                    chooseAnswer(answer)
                  }
                >
                  {answer}
                </button>
              );
            }
          )}

        </div>

      </div>

      <div className="classic-score">
        Score :{" "}
        <strong>
          {score}
        </strong>
      </div>

    </div>
  );
}