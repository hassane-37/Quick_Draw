function addGameSession(data, sessions) {
    const code = data.code.toString();
    if (!sessions[code]) {
        sessions[code] = [data.id];
    } else {
        if (!sessions[code].includes(data.id)) {
            sessions[code].push(data.id);
        }
    }
    console.log("Current Private Sessions:", sessions);
}

function checkGameSession(code, sessions) {
    return !!(sessions[code] && sessions[code].length >= 2);
}

function matchOnlinePlayers(onlineQueue) {
    if (onlineQueue.length < 2) return null;
    
    // Pull the first two players out of the queue
    const [player1, player2] = onlineQueue.splice(0, 2);
    // Generate a unique match ID for them
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    return { player1, player2, matchId };
}

module.exports = { addGameSession, checkGameSession, matchOnlinePlayers };