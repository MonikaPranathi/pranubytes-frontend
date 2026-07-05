import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/pranubyteslogo.jpeg';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoContainer}>
        <span style={styles.logoText}>Pranu Bytes</span>
        <img src={logo} alt="Pranu Bytes Logo" style={styles.logoImage} />
      </Link>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>🔍</button>
      </form>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        <Link to="/orders" style={styles.link}>Orders</Link>
        <Link to="/addresses" style={styles.link}>Addresses</Link>

        {token ? (
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 30px',
    backgroundColor: '#2e7d32',
    color: 'white',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
  },
  logoImage: {
    height: '85px',
    width: '85px',
    marginTop: '6px',
    marginLeft: '15px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid white',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: 500,
    margin: '0 20px',
    alignSelf: 'flex-start',
    marginTop: '4px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 18px',
    borderRadius: '20px 0 0 20px',
    border: 'none',
    outline: 'none',
    fontSize: 16,
  },
  searchButton: {
    padding: '12px 18px',
    borderRadius: '0 20px 20px 0',
    border: 'none',
    backgroundColor: 'white',
    color: '#2e7d32',
    cursor: 'pointer',
    fontSize: 16,
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  },
  button: {
    backgroundColor: 'white',
    color: '#2e7d32',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;