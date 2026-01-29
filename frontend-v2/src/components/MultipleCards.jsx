import React from 'react';
import styled from 'styled-components';
import {
  FaRandom,
  FaPaw,
  FaCar,
  FaAppleAlt,
  FaCube,
  FaBrain
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MultiCards = () => {
  const [showModelChoice, setShowModelChoice] = useState(false);
  const navigate = useNavigate();

  const goToGame = (model) => {
    const route = "/game-" + model;
    navigate(route, { state: { model } });
  };

  return (
    <StyledWrapper>
      <div className="cards">

        {/* RANDOM */}
        <div className="card red" onClick={() => setShowModelChoice(true)}>
          <p className="tip">
            <FaRandom /> Random
          </p>
          <p className="second-text">(House, Pizza, Tree, Ant...)</p>
        </div>

        <div className="card blue">
          <p className="tip"><FaPaw /> Animaux</p>
          <p className="second-text">(Cow, Tiger, Cat, Bird...)</p>
        </div>

        <div className="card green">
          <p className="tip"><FaCube /> Objets</p>
          <p className="second-text">(Broom, Bed, Door...)</p>
        </div>

        <div className="card green">
          <p className="tip"><FaCar /> Véhicules</p>
          <p className="second-text">(Car, Airplane, Bus...)</p>
        </div>

        <div className="card green">
          <p className="tip"><FaAppleAlt /> Fruits</p>
          <p className="second-text">(Apple, Orange, Banana...)</p>
        </div>
      </div>

      {/* MODEL CHOICE MODAL */}
      {showModelChoice && (
        <div className="overlay" onClick={() => setShowModelChoice(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <div className="model-card" onClick={() => goToGame("cnn")}>
              <FaBrain size={30} />
              <h3>CNN</h3>
              <p>Image-based recognition</p>
            </div>

            <div className="model-card" onClick={() => goToGame("lstm")}>
              <FaBrain size={30} />
              <h3>LSTM</h3>
              <p>Stroke-sequence model</p>
            </div>

          </div>
        </div>
      )}
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
    p{
        color: black;
    }
    h3{
    font-family:monospace;
    }
  .cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .cards .red {
    background-color: #ffffff;
  }

  .cards .blue {
    background-color: #ffffff;
  }

  .cards .green {
    background-color: #ffffff;
  }

  .cards .card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: 100px;
    width: 250px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: 400ms;
  }

  .cards .card p.tip {
    font-size: 1em;
    font-weight: 700;
  }

  .cards .card p.second-text {
    font-size: .7em;
  }

  .cards .card:hover {
    transform: scale(1.1, 1.1);
  }

  .cards:hover > .card:not(:hover) {
    filter: blur(10px);
    transform: scale(0.9, 0.9);
  }
  .overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  display: flex;
  gap: 30px;
}

.model-card {
  width: 200px;
  height: 150px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.model-card:hover {
  transform: scale(1.1);
  background: #f0f0f0;
}  
  `;

export default MultiCards;