import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/pranubyteslogo.jpeg';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    setMenuOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.topRow}>
        <Link to="/" style={styles.logoContainer} onClick={() => setMenuOpen(false)}>
          <span style={styles.logoText}>Pranu Bytes</span>
          <img src={logo} alt="Pranu Bytes Logo" style={styles.logoImage} />
        </Link>

        {isMobile && (
          <button
            style={styles.menuButtonVisible}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}

        <div style={isMobile ? { display: 'none' } : styles.desktopLinks}>
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
      </div>

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

      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart</Link>
          <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Orders</Link>
          <Link to="/addresses" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Addresses</Link>
          {token ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              style={styles.mobileLogoutButton}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '8px 20px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  },
  logoImage: {
    height: '55px',
    width: '55px',
    marginTop: '4px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid white',
  },
  menuButtonVisible: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: 26,
    cursor: 'pointer',
  },
  desktopLinks: {
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
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '20px 0 0 20px',
    border: 'none',
    outline: 'none',
    fontSize: 15,
  },
  searchButton: {
    padding: '10px 16px',
    borderRadius: '0 20px 20px 0',
    border: 'none',
    backgroundColor: 'white',
    color: '#2e7d32',
    cursor: 'pointer',
    fontSize: 15,
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 12,
    gap: 10,
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 16,
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  mobileLogoutButton: {
    backgroundColor: 'white',
    color: '#2e7d32',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: 5,
  },
};

export default Navbar;