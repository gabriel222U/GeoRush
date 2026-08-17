import React, { useState } from "react";

const QUESTIONS = [
  {
    question: "Quelle est la capitale de la France ?",
    answers: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    correct: "Paris",
  },
  {
    question: "Quel est le plus grand continent ?",
    answers: ["Europe", "Afrique", "Asie", "Amérique"],
    correct: "Asie",
  },
  {
    question: "Quelle est la capitale du Japon ?",
    answers: ["Séoul", "Tokyo", "Pékin", "Osaka"],
    correct: "Tokyo",
  },
  {
    question: "Quel pays a la forme d'une botte ?",
    answers: ["Espagne", "Italie", "Grèce", "Portugal"],
    correct: "Italie",
  },
  {
    question: "Quelle est la capitale de l'Australie ?",
    answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: "Canberra",
  },
  {
    question: "Dans quel pays se trouve le Machu Picchu ?",
    answers: ["Chili", "Pérou", "Mexique", "Brésil"],
    correct: "Pérou",
  },
  {
    question: "Quelle est la capitale du Canada ?",
    answers: ["Toronto", "Montréal", "Vancouver", "Ottawa"],
    correct: "Ottawa",
  },
  {
    question: "Quel pays possède le plus grand territoire ?",
    answers: ["Chine", "Canada", "États-Unis", "Russie"],
    correct: "Russie",
  },
  {
    question: "Quelle est la capitale de l'Égypte ?",
    answers: ["Le Caire", "Alexandrie", "Gizeh", "Louxor"],
    correct: "Le Caire",
  },
  {
    question: "Dans quel pays se trouve la ville de Barcelone ?",
    answers: ["Portugal", "Italie", "Espagne", "France"],
    correct: "Espagne",
  },
];

export default function Classic({ onBack }) {
  const [question, setQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[question];

  function answer(choice) {
    if (selected) return;

    setSelected(choice);

    if (choice === current.correct) {
      setScore((s) => s + 100);
    }

    setTimeout(() => {
      if (question + 1 >= QUESTIONS.length) {
        setFinished(true);
      } else {
        setQuestion((q) => q + 1);
        setSelected(null);
      }
    }, 700);
  }

  if (finished) {
    return (
      <div className="game-page">
        <button className="back-button" onClick={onBack}>
          ← Retour
        </button>

        <div className="game-result">
          <div className="result-icon">🏆</div>
          <h1>Partie terminée !</h1>

          <div className="result-score">{score}</div>
          <p>/ 1000 points</p>

          <button
            className="main-button"
            onClick={() => {
              setQuestion(0);
              setScore(0);
              setSelected(null);
              setFinished(false);
            }}
          >
            Rejouer →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={onBack}>
        ← Retour
      </button>

      <div className="game-header">
        <span>CLASSIC</span>
        <strong>
          {question + 1}/{QUESTIONS.length}
        </strong>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${((question + 1) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <div className="question-card">
        <div className="question-number">
          QUESTION {question + 1}
        </div>

        <h1>{current.question}</h1>

        <div className="answers">
          {current.answers.map((answerText) => {
            let className = "answer";

            if (selected) {
              if (answerText === current.correct) {
                className += " correct";
              } else if (answerText === selected) {
                className += " wrong";
              }
            }

            return (
              <button
                key={answerText}
                className={className}
                onClick={() => answer(answerText)}
              >
                {answerText}
              </button>
            );
          })}
        </div>
      </div>

      <div className="classic-score">
        Score : <strong>{score}</strong>
      </div>
    </div>
  );
}