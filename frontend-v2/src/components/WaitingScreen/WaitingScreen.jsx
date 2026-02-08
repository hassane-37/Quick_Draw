import React from 'react';
import styled, { keyframes } from 'styled-components';

export const WaitingScreen = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="form_area">
          <p className="title">WAITING ROOM</p>

          <div className="loader_wrapper">
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <p className="waiting_text">Waiting for someone to join...</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background-color: #ffd139; /* same palette */
    height: 100vh;
  }

  .form_area {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffd139;
    border: 2px solid #000;
    border-radius: 20px;
    box-shadow: 3px 4px 0px 1px #000;
    padding: 40px 30px;
  }

  .title {
    font-family: "Regular 400", sans-serif;
    font-weight: 900;
    font-size: 1.5em;
    margin-bottom: 30px;
    color: #000;
  }

  .loader_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }

  .loader {
    display: flex;
    gap: 8px;
  }

  .loader div {
    width: 12px;
    height: 12px;
    background: #000; /* match your button/outline color */
    border-radius: 50%;
    animation: ${bounce} 1.4s infinite ease-in-out both;
  }

  .loader div:nth-child(1) { animation-delay: -0.32s; }
  .loader div:nth-child(2) { animation-delay: -0.16s; }
  .loader div:nth-child(3) { animation-delay: 0s; }
  .loader div:nth-child(4) { animation-delay: 0.16s; }

  .waiting_text {
    font-family: monospace;
    font-weight: 700;
    color: #000;
    margin-top: 10px;
  }
`;

export default WaitingScreen;
