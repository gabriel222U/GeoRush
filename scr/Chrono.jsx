import React, { useEffect, useState } from "react";

const questions = [
  {
    question: "Quelle est la capitale de la France ?",
    answers: ["Paris", "Lyon", "Marseille", "Lille"],
    correct: "Paris",
  },
  {
    question: "Quelle est la capitale du Japon ?",
    answers: ["Kyoto", "Tokyo", "Osaka", "Hiroshima"],
    correct: "Tokyo",
  },
  {
    question: "Quelle est la capitale de l'Italie ?",
    answers: ["Milan", "Rome", "Naples", "Venise"],
    correct: "Rome",
  },
  {
    question: "Quelle est la capitale du Canada ?",
    answers: ["Toronto", "Vancouver", "Ottawa", "Montréal"],
    correct: "Ottawa",
  },
];

export default function Chrono({ onBack }) {
  const [question, setQuestion] = useState(0);
  const [time, setTime] = useState(15);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;

    if (time <= 0) {
      nextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, finished]);

  function nextQuestion() {
    if (question + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setQuestion((q) => q + 1);
    setTime(15);
  }

  function answer(choice) {
    if (choice === questions[question].correct) {
      setScore((s) => s + time * 10);
    }

    nextQuestion();
  }

  if (finished) {
    return (
      <div className="game-page">
        <button onClick={onBack}>← Retour</button>

        <div className="result-card">
          <h1>🔥 Chrono terminé !</h1>
          <p>Score</p>
          <strong>{score}</strong>
          <button onClick={onBack}>Retour aux modes</button>
        </div>
      </div>
    );
  }

  const q = questions[question];

  return (
    <div className="game-page">
      <button onClick={onBack}>← Retour</button>

      <div className="chrono-header">
        <span>
          Question {question + 1}/{questions.length}
        </span>

        <span className="chrono-time">
          ⏱️ {time}s
        </span>
      </div>

      <div className="question-card">
        <h2>{q.question}</h2>

        <div className="answers">
          {q.answers.map((answer) => (
            <button
              key={answer}
              onClick={() => answer(answer)}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}