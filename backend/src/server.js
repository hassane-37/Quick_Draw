// server.js
const http = require("http");
const WebSocket = require("ws");
const app = require("./app");
const ENV = require("./config/env");
const logger = require("./config/logger");
const { addGameSession, checkGameSession, matchOnlinePlayers } = require("./socketLogic/gameSessions");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gameSessions = {}; // Private room storage
const onlineGameQueue = []; // Matchmaking queue
const ongoingMatches = {}; // WHERE RESULTS ARE STORED
const usernames = []; // Map playerID to username

wss.on("connection", (ws) => {
    console.log("WS client connected");

    ws.on("message", (rawData) => {
        try {
            const data = JSON.parse(rawData.toString());
            
            if (data.type === "CREATE_GAME_ONLINE") {
                // Add to queue if not already there
                if (!onlineGameQueue.find(p => p.id === data.id)) {
                    onlineGameQueue.push({ id: data.id, ws: ws });
                }
                
                // Try to match immediately
                const match = matchOnlinePlayers(onlineGameQueue);
                if (match) {
                    const { player1, player2, matchId } = match;
                    
                    // Initialize the ongoing match record
                    ongoingMatches[matchId] = {
                        players: [player1.id, player2.id],
                        sockets: { [player1.id]: player1.ws, [player2.id]: player2.ws },
                        results: {} // Store by playerID
                    };

                    const payload = JSON.stringify({ 
                        type: "GAME_STATUS_ONLINE", 
                        matchId: matchId,
                        players: [player1.id, player2.id]
                    });

                    player1.ws.send(payload);
                    player2.ws.send(payload);
                }
            } 
            else if (data.type === "SET_USERNAME") {
               // For simplicity, we just store the last username set. In production, you'd want a better mapping.
              if (usernames[0]) {
                usernames[1] = data.username;
              } else {
                usernames[0] = data.username;
              }
              console.log("Usernames updated:", usernames);

              console.log("Username set for player:", data.username);
            }

            else if (data.type === "CHECK_GAME") {
                // Private lobby logic
                const gameExists = checkGameSession(data.code, gameSessions);
                if (gameExists) {
                    const matchId = `private_${data.code}`;
                    // If first time checking and it exists, setup match object
                    if (!ongoingMatches[matchId]) {
                        ongoingMatches[matchId] = {
                            players: gameSessions[data.code],
                            sockets: {}, // We'll populate sockets as they message
                            results: {}
                        };
                    }
                    // Map this specific socket to this player ID
                    ongoingMatches[matchId].sockets[data.id] = ws;
                    
                    ws.send(JSON.stringify({ type: "GAME_STATUS", exists: true, matchId }));
                }
            }

            else if (data.type === "PLAYER_ENDED") {
                const { matchId, id, predictions } = data;
                const match = ongoingMatches[matchId];
                
                if (!match) return console.error("Match not found:", matchId);

                // Store individual results
                match.results[id] = predictions;

                const finishedPlayers = Object.keys(match.results);
                
                if (finishedPlayers.length === 2) {
                    const payload = JSON.stringify({
                        type: "BOTH_PLAYERS_ENDED",
                        results: match.results, // Send the whole results object
                        
                    });

                    match.players.forEach((pid) => {
                        if (match.sockets[pid]) match.sockets[pid].send(payload);
                    });
                    
                    // Cleanup match after 30 seconds
                    setTimeout(() => { delete ongoingMatches[matchId]; }, 30000);
                }
            }
        } catch (err) {
            console.error("Server Error:", err);
        }
    });

    ws.on("close", () => {
        const index = onlineGameQueue.findIndex(p => p.ws === ws);
        if (index !== -1) onlineGameQueue.splice(index, 1);
    });
});

server.listen(ENV.PORT, () => {
    logger.info(`Server running on http://localhost:${ENV.PORT}`);
});