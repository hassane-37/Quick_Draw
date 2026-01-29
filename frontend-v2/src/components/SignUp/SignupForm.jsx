import React from 'react';
import styled from 'styled-components';
import './SignUpForm.css';
import {useState}  from 'react';
import { Link } from 'react-router-dom';

export const FormSignUp = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  }
  
  return (
    <>
    <StyledWrapper>
      <div className="container">
        <div className="form_area">
          <p className="title">SIGN UP</p>
          <form>
            <div className="form_group">
              <label className="sub_title" htmlFor="name">Username</label>
              <input placeholder="Enter your full name" className="form_style" type="text" onChange={(e)=>{setUsername(e.target.value)}} />
            </div>
            <div className="form_group">
              <label className="sub_title" htmlFor="email">Email</label>
              <input placeholder="Enter your email" id="email" className="form_style" type="email" onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            <div className="form_group">
              <label className="sub_title" htmlFor="password">Password</label>
              <input placeholder="Enter your password" id="password" className="form_style" type="password" onChange={(e)=>{setPassword(e.target.value)}} />
            </div>
            <div>
              <button className="btn">SIGN UP</button>
              <p>Have an Account? <Link className="link" to="/">Login Here!</Link></p><a className="link" >
              </a></div><a className="link" >
            </a></form></div><a className="link" >
        </a></div>
    </StyledWrapper>
    <img src="/Background1.png" alt="doodle" className="fixed-image" />
    </>
  );
}

const StyledWrapper = styled.div`
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
    margin: 25px auto;
    width: 290px;
    font-size: 15px;
    background: #ffffff;
    border-radius: 10px;
    font-weight: 800;
    box-shadow: 3px 3px 0px 0px #000000;
    border: 2px solid #000000;
    display:flex;
    justify-content: center;
  }

  .btn:hover {
    opacity: .9;
  }
    p{
    font-family: monospace;
    }
  .link {
    font-weight: 800;
    color: #000000;
    padding: 5px;
  }`;

export default FormSignUp;
