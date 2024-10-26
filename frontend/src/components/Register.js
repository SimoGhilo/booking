import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';


const Register = () => {

  // Hook
  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (name === '' || password === '' || surname == '' || email == '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if(!email.includes('@'))
    {
        setErrorMessage('Please use a valid email.');
        return;
    }

    if(password != confirmPassword)
    {
        setErrorMessage("passwords need to match.")
        return;
    }

    if(password.length < 6)
    {
        setErrorMessage("Password must be at least 6 characters!")
        return;
    }

    // Reset error message
    setErrorMessage('');

    /** Call api to register */    
    registerUser();

  };

  /** Code below is used to redirect the user to the dashboard if authenticated */
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/check', {
          method: 'GET',
          credentials: 'include'  // Sends session cookies along with the request
        });

        const data = await response.json();
        // If the user is authenticated, redirect to dashboard
        if (data.authenticated) {
            navigate('/dashboard');
            } 

      } catch (error) {
        console.log(error);
      } 
    };

    checkAuth();
}, []);

/** Auth check ends */

/** API functions */

  async function registerUser(){

    const formData = {
        name: name,
        surname: surname,
        email: email,
        password: password
      };

      try {
        let result = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(formData)
        });

        let data = await result.json();

        if (data.message) {
            // Handle success (e.g., redirect or show a success message)
            setSuccessMessage('User created successfully!');
            setTimeout(() => {
                navigate('/login');
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
      <h2>Register</h2>
      {errorMessage && <h3 style={{ color: 'red' }}>{errorMessage}</h3>}
      {successMessage && <h3 style={{ color: 'green' }}>{successMessage}</h3>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">First name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="surname">Last name:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Account</button>
        <Link to="/login" className="button">
        <button>Log in</button>
      </Link>
      </form>
    </div>
  );
};

export default Register;
