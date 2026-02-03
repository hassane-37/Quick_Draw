import { FaGamepad, FaUsers, FaTrophy } from "react-icons/fa";
import Header from "../components/Header/Header";
import { Card } from "../components/Card/Card";
import { useState, useEffect } from "react";
import MultiCards from "../components/MultipleCards";
import "./DashboardPage.css";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const [showModeCards, setShowModeCards] = useState(false);
  const [stats, setStats] = useState({
    games_played: 0,
    wins: 0,
    top_score: 0,
    recent_games: []
  });
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        // Cognito utilise 'sub' pour l'ID unique, mais on peut aussi avoir 'username'
        const user_id = decoded.sub || decoded.username || decoded["cognito:username"];
        setUsername(decoded.name || decoded["name"] || "User");

        console.log("Fetching stats for user_id:", user_id);

        const response = await fetch(
          `http://localhost:4000/api/games/stats/${user_id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Stats received:", result.data);
          setStats(result.data);
        } else {
          console.error("Failed to fetch stats:", response.status);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Formater l'activité récente
  const formatActivity = (game) => {
    const won = game.correct_count >= Math.ceil(game.total_rounds / 2);
    return `${won ? "Won" : "Lost"} a ${game.model_type?.toUpperCase() || "Classic"} game ${game.correct_count}/${game.total_rounds}`;
  };

  return (
    <>
      <Header id={1} bgColor="#ffd139" />

      <main className="dashboard">
        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div>
            <h1>Welcome back {username}</h1>
            <p>Track your progress and start a new game</p>
          </div>
          <div className="hero-badge">
            <FaTrophy />
            <span>Level {Math.floor(stats.games_played / 5) + 1}</span>
          </div>
        </section>

        {/* STATS */}
        <section className="cards-container">
          <Card title="Games Played" value={loading ? "..." : stats.games_played} />
          <Card title="Wins" value={loading ? "..." : stats.wins} />
          <Card title="Top Score" value={loading ? "..." : stats.top_score} />
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
            {loading ? (
              <li>Loading...</li>
            ) : stats.recent_games.length === 0 ? (
              <li>No games played yet. Start playing!</li>
            ) : (
              stats.recent_games.map((game, idx) => (
                <li key={game.id || idx}>{formatActivity(game)}</li>
              ))
            )}
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
