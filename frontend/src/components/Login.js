import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';


const LoginForm = () => {

  // navigate

  let navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (password === '' || email == '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Reset error message
    setErrorMessage('');

    loginUser();


  };


  /**APi functions  */

  async function loginUser(){

    const formData = {
        email: email,
        password: password
      };

      try {
        let result = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        let data = await result.json();

        console.log(data, 'data');

        if (data.message) {
            // Handle success (e.g., redirect or show a success message)
            setSuccessMessage('Login successful!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
          } else if(data.errors) {

            let error =  "";

            data.errors.forEach((e) => error += e.msg + " ");
            setErrorMessage(error || 'An error occurred');
          }
        
      } catch (error) {
        console.log(error, 'error');

        setErrorMessage('Network error, please try again later.');
      }


  }



  return (
    <div className="login-form">
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <h3 style={{ color: 'green' }}>{successMessage}</h3>}
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
