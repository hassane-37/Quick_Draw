import React from "react";
import "./StatePageMulti.css";

function computeStats(stats) {
  const totalRounds = stats.length;
  const correctRounds = stats.filter(
    s => s.word?.toLowerCase() === s.prediction?.toLowerCase()
  ).length;

  const accuracy =
    totalRounds > 0 ? Math.round((correctRounds / totalRounds) * 100) : 0;

  return { totalRounds, correctRounds, accuracy };
}

/* =========================
   MAIN COMPONENT
========================= */

export default function MultiplayerStatPage({
  player1Name,
  player2Name,
  player1Stats = [],
  player2Stats = []
}) {
  const p1 = computeStats(player1Stats);
  const p2 = computeStats(player2Stats);

  let winnerText = "Draw!";
  if (p1.correctRounds > p2.correctRounds)
    winnerText = `${player1Name} Wins 🏆`;
  else if (p2.correctRounds > p1.correctRounds)
    winnerText = `${player2Name} Wins 🏆`;

  return (
    <div className="stats-page multiplayer">
      {/* ===== HEADER ===== */}
      <header className="stats-header">
        <h1>Game Results</h1>
        <div className="winner-banner">{winnerText}</div>
      </header>

      {/* ===== PLAYER SCORE CARDS (SIDE BY SIDE) ===== */}
      <section className="players-score-row">
        <div className="player-score-card">
          <div className="player-score-name">{player1Name}</div>
          <div className="player-score-stats">
            <div className="summary-item">
              <span className="summary-value">
                {p1.correctRounds}/{p1.totalRounds}
              </span>
              <span className="summary-label">Correct</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{p1.accuracy}%</span>
              <span className="summary-label">Accuracy</span>
            </div>
          </div>
        </div>

        <div className="player-score-card">
          <div className="player-score-name">{player2Name}</div>
          <div className="player-score-stats">
            <div className="summary-item">
              <span className="summary-value">
                {p2.correctRounds}/{p2.totalRounds}
              </span>
              <span className="summary-label">Correct</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{p2.accuracy}%</span>
              <span className="summary-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLAYER 1 ROUNDS ===== */}
      <section className="player-section">
        <h2 className="player-section-title">{player1Name} Rounds</h2>

        <div className="stats-grid">
          {player1Stats.map((item, index) => {
            const isCorrect =
              item.word?.toLowerCase() === item.prediction?.toLowerCase();

            return (
              <div
                key={index}
                className={`stat-card ${
                  isCorrect ? "is-correct" : "is-wrong"
                }`}
              >
                <div className="card-header">
                  <span className="round-number">Round {index + 1}</span>
                  <span
                    className={`status-badge ${
                      isCorrect ? "success" : "fail"
                    }`}
                  >
                    {isCorrect ? "✓ Correct" : "✗ Failed"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="data-row">
                    <span className="label">Keyword:</span>
                    <span className="value target-word">{item.word}</span>
                  </div>

                  <div className="data-row">
                    <span className="label">ML Guessed:</span>
                    <span className="value">
                      {item.prediction || (
                        <em className="no-guess">No guess</em>
                      )}
                    </span>
                  </div>

                  <div className="confidence-container">
                    <div className="confidence-bar-bg">
                      <div
                        className="confidence-bar-fill"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="confidence-text">
                      {item.confidence.toFixed(1)}% Confidence
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PLAYER 2 ROUNDS ===== */}
      <section className="player-section">
        <h2 className="player-section-title">{player2Name} Rounds</h2>

        <div className="stats-grid">
          {player2Stats.map((item, index) => {
            const isCorrect =
              item.word?.toLowerCase() === item.prediction?.toLowerCase();

            return (
              <div
                key={index}
                className={`stat-card ${
                  isCorrect ? "is-correct" : "is-wrong"
                }`}
              >
                <div className="card-header">
                  <span className="round-number">Round {index + 1}</span>
                  <span
                    className={`status-badge ${
                      isCorrect ? "success" : "fail"
                    }`}
                  >
                    {isCorrect ? "✓ Correct" : "✗ Failed"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="data-row">
                    <span className="label">Keyword:</span>
                    <span className="value target-word">{item.word}</span>
                  </div>

                  <div className="data-row">
                    <span className="label">ML Guessed:</span>
                    <span className="value">
                      {item.prediction || (
                        <em className="no-guess">No guess</em>
                      )}
                    </span>
                  </div>

                  <div className="confidence-container">
                    <div className="confidence-bar-bg">
                      <div
                        className="confidence-bar-fill"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                    <span className="confidence-text">
                      {item.confidence.toFixed(1)}% Confidence
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="stats-footer">
        <button
          className="play-again-btn"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </footer>
    </div>
  );
}