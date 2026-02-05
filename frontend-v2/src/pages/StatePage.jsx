import React from 'react';
import './StatePage.css';

export default function StatPage({ stats = [] }) {
  // Calculate general statistics
  const totalRounds = stats.length;
  const correctRounds = stats.filter(s => s.word.toLowerCase() === s.prediction.toLowerCase()).length;
  const accuracy = totalRounds > 0 ? Math.round((correctRounds / totalRounds) * 100) : 0;

  return (
    <div className="stats-page">
      <header className="stats-header">
        <h1>Your Results</h1>
        <div className="summary-banner">
          <div className="summary-item">
            <span className="summary-value">{correctRounds}/{totalRounds}</span>
            <span className="summary-label">Correct</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{accuracy}%</span>
            <span className="summary-label">Accuracy</span>
          </div>
        </div>
      </header>

      <main className="stats-grid">
        {stats.map((item, index) => {
          const isCorrect = item.word.toLowerCase() === item.prediction.toLowerCase();
          
          return (
            <div key={index} className={`stat-card ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
              <div className="card-header">
                <span className="round-number">Round {index + 1}</span>
                <span className={`status-badge ${isCorrect ? 'success' : 'fail'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Failed'}
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
                    {item.prediction || <em className="no-guess">No guess</em>}
                  </span>
                </div>

                <div className="confidence-container">
                  <div className="confidence-bar-bg">
                    <div 
                      className="confidence-bar-fill" 
                      style={{ width: `${item.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-text">{item.confidence.toFixed(1)}% Confidence</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="stats-footer">
        <button className="play-again-btn" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </footer>
    </div>
  );
}