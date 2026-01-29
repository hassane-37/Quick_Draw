import React from "react";
import styled from 'styled-components';
import './Card.css';


export const Card = ({ title, value }) => {
  return (
    <>
    <StyledWrapper>
      <div className="container">
        <div className="form_area dashboard_card">
        <p className="title">{title}</p>  
        <p className="card_value">{value}</p>
        </div>
      </div>
    </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: stretch;
    
    background-color: transparent;
  }

  /* CARD */
  .form_area {
   

    background-color: #ffd139;
    width: 100%;
   
    padding: 20px 18px;

    border: 2px solid #000000;
    border-radius: 20px;
    box-shadow: 3px 4px 0px 1px #000000;

    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .form_area:hover {
    transform: translateY(-2px);
    box-shadow: 5px 6px 0px 1px #000000;
  }

  /* CARD TITLE */
  .title {
    ;
  }

  /* CARD VALUE */
  .card_value {
    
  }

  /* TEXT DEFAULT */
  p {
    margin: 0;
    font-family: monospace;
  }

  /* KEEP FORM STYLES (unchanged) */
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
    margin: 25px 0px;
    width: 290px;
    font-size: 15px;
    background: #ffffff;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 3px 3px 0px 0px #000000;
  }

  .btn:hover {
    opacity: 0.9;
  }

  .link {
    font-weight: 800;
    color: #000000;
    padding: 5px;
  }
`;



export default Card;