import { FaGamepad, FaUsers, FaTrophy } from "react-icons/fa";
import Header from "../components/Header/Header";
import { Card } from "../components/Card/Card";
import { useState } from "react";
import MultiCards from "../components/MultipleCards";
import "./DashboardPage.css";

import { useAuth } from "../components/hooks/useAuth";


 

function DashboardPage() {
    const { user, loading } = useAuth();
    const [showModeCards, setShowModeCards] = useState(false);
    
    if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#ffd139'
      }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }


  return (
    <>
      <Header id={1} bgColor="#ffd139" />

      <main className="dashboard">
        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div>
            <h1>Welcome back {user?.username || user?.email || 'Player'}!</h1>
            <p>Track your progress and start a new game</p>
          </div>
          <div className="hero-badge">
            <FaTrophy />
            <span>Level 5</span>
          </div>
        </section>

        {/* STATS */}
        <section className="cards-container">
          <Card title="Games Played" value={4} />
          <Card title="Wins" value={18} />
          <Card title="Top Score" value={781} />
        </section>

        {/* PLAY SECTION */}
        <section className="play-section">
          <h2>Play</h2>

          <div className="btn-container">
            <button
            className="btn primary"
            onClick={() => setShowModeCards(true)}
            >
            <FaGamepad /> Classic
            </button>

            <button
            className="btn secondary"
            onClick={() => setShowModeCards(true)}
            >
            <FaUsers /> Multiplayer
            </button>
          </div>
        </section>

        {showModeCards && (
          <div
            className="overlay"
            onClick={() => setShowModeCards(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <MultiCards />
            </div>
          </div>
        )}

        {/* RECENT ACTIVITY */}
        <section className="activity">
          <h2>Recent Activity</h2>
          <ul>
            <li> Won a Classic game 4/6</li>
            <li> Lost a Classic game 2/6</li>
            <li> Lost a Classic game 2/6</li>
          </ul>
        </section>

        {/* BACKGROUND DECORATION */}
        <img
          src="/Background3.png"
          alt="doodle"
          className="fixed-image-inv"
        />
      </main>
    </>
  );
}

export default DashboardPage;
