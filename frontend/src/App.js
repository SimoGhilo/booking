import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import logo from './img/logo.png';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <div className="logo">
          <img src={logo} alt="Logo" className='logo-image' />
        </div>
          <nav>
            <div className='links-container'>
              <Link to="/"><h6 className='link'>Home</h6></Link>
              <Link to="/search"><h6 className='link'>Search</h6></Link>
            </div>
            <div className='icon-container'>
              <Link to="/login"><i className="fa-regular fa-user-circle" style={{ color: 'white' }}></i></Link>
            </div>
          </nav>
          <div className='subheader'>
            <h1>Find your next stay</h1>
            <h6>Search low prices on hotels, homes and much more...</h6>
          </div>
        </header>
        <body>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchBar />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </body>
        <footer>
          <div className='row'>
            <div class="about">
              <h3>About us:</h3>
              <p>We offer the best booking services for hotels, flights, and car rentals. Explore the world with us at unbeatable prices.</p>
              <p>&copy; 2024 BookingSite. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
