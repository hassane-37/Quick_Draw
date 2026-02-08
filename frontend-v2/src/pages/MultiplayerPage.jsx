import Header from "../components/Header/Header";
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import { useWebSocket } from "../webSocket/SocketContext.jsx";
import { useSearchParams } from "react-router-dom";

function generateCode(length = 5) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let lastChar = null;

  for (let i = 0; i < length; i++) {
    let c;
    do {
      c = chars[Math.floor(Math.random() * chars.length)];
    } while (c === lastChar);

    result += c;
    lastChar = c;
  }

  return result;
}



export const MultiplayerPage = () => {
  return (
    <>
    <Header id={4} bgColor="#ffd139"/>
    <MultiplayerMenu></MultiplayerMenu>
    </>
    );  
}

export const MultiplayerMenu = () => {

  var code = generateCode(5);

  const wsRef = useWebSocket();

  const send = () => {
    console.log("Sending DRAW message via WebSocket");
    //send the code to the server
    wsRef.current?.send(JSON.stringify({type:"CREATE_GAME",code:code,id:"id1"}));
  };

  const sendInvite = () => {
    console.log("Sending INVITE message via WebSocket");
    wsRef.current?.send(JSON.stringify({type:"CREATE_GAME",code:inviteCode,id:"id2"}));
  };

  const onlinePlay = () => {
    console.log("Sending ONLINE PLAY message via WebSocket");
    //wsRef.current?.send(JSON.stringify({type:"CREATE_GAME_ONLINE",id:"id1"}));
    sendUsername();
  } 
  
  const sendUsername = () => {
    const username = localStorage.getItem("username") || "UnknownUser";
    console.log("Sending USERNAME message via WebSocket:", username);
    wsRef.current?.send(JSON.stringify({type:"SET_USERNAME",username:username}));
  }


  const [mode, setMode] = useState(null); 

  const [inviteCode, setInviteCode] = useState('');
  const [searchParams] = useSearchParams();
  const model = searchParams.get("model");

  return (
    <>
      <StyledWrapper>
        <div className="container">
          <div className="form_area">
            <p className="title">MULTIPLAYER</p>

            {/* Initial buttons */}
            {!mode && (
              <>
                <Link to={`/game-multiplayer?session=online&model=${model}`}>
                <button className="btn" onClick={onlinePlay}>
                  PLAY ONLINE
                </button>
                </Link>

                <button className="btn" onClick={() => setMode('join')}>
                  JOIN A GAME
                </button>

                <button className="btn" onClick={() => setMode('invite')}>
                  INVITE SOMEONE
                </button>
              </>
            )}

            {/* Join game UI */}
            {mode === 'join' && (
              <>
                <div className="form_group">
                  <label className="sub_title">Game Code</label>
                  <input
                    className="form_style"
                    placeholder="Enter game code"
                    type="text"
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </div>
                <Link to={`/game-multiplayer?session=${inviteCode}&model=${model}`}>
                <button className="btn" onClick={sendInvite}>
                  JOIN
                </button>
                </Link>
                
              </>
            )}

            {/* Invite someone UI */}
            {mode === 'invite' && (
              <>
                <div className="form_group">
                  <label className="sub_title">Game Code</label>
                  <input
                    className="form_style"
                    value={code}
                    readOnly
                  />
                </div>
                
              <Link to={`/game-multiplayer?session=${code}&model=${model}`}>
                <button className="btn" onClick={send}>
                  PLAY
                </button>
              </Link>

              </>
            )}
          </div>
        </div>
      </StyledWrapper>

      <img src="/Background1.png" alt="doodle" className="fixed-image" />
    </>
  );
};



const StyledWrapper = styled.div`
    a{
    text-decoration: none;
    }
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: #ffd139;
  }

  .form_area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #ffd139;
    height: auto;
    width: auto;
    border: 2px solid #000000;
    border-radius: 20px;
    box-shadow: 3px 4px 0px 1px #000000;
    padding-bottom: 20px;
  }

  .title {
    color: #000000;
    font-family: "Regular 400", sans-serif;
    font-weight: 900;
    font-size: 1.5em;
    margin-top: 20px;
  }

  .sub_title {
    font-weight: 900;
    margin: 5px 0;
    font-family: "Lato", sans-serif;
  }

  .form_group {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin: 10px;
  }

  .form_style {
    outline: none;
    border: 2px solid #000000;
    box-shadow: 3px 4px 0px 1px #000000;
    width: 290px;
    padding: 12px 10px;
    border-radius: 4px;
    font-size: 15px;
    font-family: monospace;
  }

  .form_style:focus, .btn:focus {
    transform: translateY(4px);
    box-shadow: 1px 2px 0px 0px #000000;
  }

  .btn {
    padding: 15px;
    margin: 15px auto;
    margin-right: 10px;
    margin-left: 10px;
    width: 290px;
    font-size: 15px;
    background: #ffffff;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 3px 3px 0px 0px #000000;
    border: 2px solid #000000;
    display: flex;
    justify-content: center;
  }

  .btn:hover {
    opacity: .9;
  }

  p {
    font-family: monospace;
  }
`;

export default MultiplayerPage;