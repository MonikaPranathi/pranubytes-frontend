import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Verify this user is actually an admin by hitting a protected admin route
      try {
        await API.get('/admin/dashboard');
        navigate('/admin/dashboard');
      } catch {
        setError('This account does not have admin access.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Admin Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 60,
  },
  form: {
    width: 320,
    padding: 30,
    border: '1px solid #ddd',
    borderRadius: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 12,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 15,
  },
  button: {
    width: '100%',
    padding: 12,
    marginTop: 18,
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    fontSize: 16,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
};

export default AdminLogin;