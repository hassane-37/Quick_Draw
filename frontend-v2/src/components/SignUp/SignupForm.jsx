import React from 'react';
import styled from 'styled-components';
import './SignUpForm.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const FormSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(''); // <-- NOUVEAU
  const [showConfirmation, setShowConfirmation] = useState(false); // <-- NOUVEAU
  const [successMessage, setSuccessMessage] = useState(''); // <-- NOUVEAU
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message); // Afficher le message de succès
        setShowConfirmation(true); // Montrer le champ de confirmation
        setLoading(false);
        // NE PAS REDIRIGER ICI - l'utilisateur doit confirmer son email
      } else {
        setError(data.message || data.error || 'Signup failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setLoading(false);
    }
  }

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/confirmEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          code: confirmationCode
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Email confirmed successfully! You can now login.');
        setTimeout(() => {
          navigate('/'); // Rediriger vers login après confirmation
        }, 3000);
      } else {
        setError(data.message || data.error || 'Confirmation failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setLoading(false);
    }
  }

  // Si on doit afficher la confirmation
  if (showConfirmation) {
    return (
      <StyledWrapper>
        <div className="container">
          <div className="form_area">
            <p className="title">CONFIRM EMAIL</p>
            {successMessage && <p style={{ color: 'green', margin: '10px' }}>{successMessage}</p>}
            <form onSubmit={handleConfirmSubmit}>
              <div className="form_group">
                <label className="sub_title" htmlFor="code">Confirmation Code</label>
                <input 
                  placeholder="Enter code from email" 
                  className="form_style" 
                  type="text" 
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
                {/* <small>Check your email at {email} for the confirmation code</small> */}
              </div>
              <div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Confirming...' : 'CONFIRM EMAIL'}
                </button>
                <button 
                  className="btn" 
                  type="button" 
                  onClick={() => {
                    // API pour renvoyer le code
                    fetch('http://localhost:4000/api/auth/resend-code', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: username })
                    });
                  }}
                  style={{ marginTop: '10px', backgroundColor: '#f0f0f0' }}
                >
                  Resend Code
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </StyledWrapper>
    );
  }

  // Formulaire de signup initial
  return (
    <>
      <StyledWrapper>
        <div className="container">
          <div className="form_area">
            <p className="title">SIGN UP</p>
            {successMessage && <p style={{ color: 'green', margin: '10px' }}>{successMessage}</p>}
            <form onSubmit={handleSignupSubmit}>
              <div className="form_group">
                <label className="sub_title" htmlFor="name">Username</label>
                <input 
                  placeholder="Enter your username" 
                  className="form_style" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form_group">
                <label className="sub_title" htmlFor="email">Email</label>
                <input 
                  placeholder="Enter your email" 
                  className="form_style" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form_group">
                <label className="sub_title" htmlFor="password">Password</label>
                <input 
                  placeholder="Enter your password" 
                  className="form_style" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              <div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Signing up...' : 'SIGN UP'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>Have an Account? <Link className="link" to="/">Login Here!</Link></p>
              </div>
            </form>
          </div>
        </div>
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
