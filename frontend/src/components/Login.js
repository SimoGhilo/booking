import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Login.css';


const LoginForm = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (name === '' || password === '' || surname == '' || email == '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Reset error message
    setErrorMessage('');

    /** APi stuff */


  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <Link to="/register" className="button">
        <button>Sign Up</button>
      </Link>
      </form>
    </div>
  );
};

export default LoginForm;
