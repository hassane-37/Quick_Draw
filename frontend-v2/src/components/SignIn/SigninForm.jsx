import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import '../SignUp/SignUpForm.css';
import { useNavigate } from 'react-router-dom';

export const FormSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:4000/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Prendre en charge le token custom JWT renvoyé par le backend
      const jwtToken = data.token || data?.data?.accessToken; // fallback si ancienne réponse

      const username = await getUserNameByEmail(email); // Récupérer le nom d'utilisateur à partir de l'email

      if (!jwtToken) {
        throw new Error('No token returned from server');
      }

      // Stocker UNIQUEMENT le token (les infos utilisateur seront récupérées via /api/auth/me)
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('username', username); 
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserNameByEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/getUserNameByEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get username');
      }
      return data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  };


  return (
    <>
      <StyledWrapper>
        <div className="container">
          <div className="form_area">
            <p className="title">SIGN IN</p>

            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <label className="sub_title" htmlFor="email">Email</label>
                <input
                  placeholder="Enter your email"
                  id="email"
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
                  id="password"
                  className="form_style"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Signing in...' : 'SIGN IN'}
                </button>

                <p>
                  Don't have an Account?
                  <Link to="/signup" className="link"> Sign Up Here!</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </StyledWrapper>

      <img src="/Background1.png" alt="doodle" className="fixed-image" />
    </>
  );
};

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

export default FormSignIn;
