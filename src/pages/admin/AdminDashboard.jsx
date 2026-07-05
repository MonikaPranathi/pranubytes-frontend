import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError('Access denied or failed to load dashboard.');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading dashboard...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

     <div style={styles.navRow}>
        <Link to="/admin/products" style={styles.navLink}>Manage Products</Link>
        <Link to="/admin/orders" style={styles.navLink}>Manage Orders</Link>
        <Link to="/admin/categories" style={styles.navLink}>Manage Categories</Link>
        <Link to="/admin/banners" style={styles.navLink}>Manage Banners</Link>
        <Link to="/admin/coupons" style={styles.navLink}>Manage Coupons</Link>
        <Link to="/admin/settings" style={styles.navLink}>Settings</Link>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Orders</p>
          <p style={styles.statValue}>{stats.totalOrders}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Products</p>
          <p style={styles.statValue}>{stats.totalProducts}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Customers</p>
          <p style={styles.statValue}>{stats.totalCustomers}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Revenue</p>
          <p style={styles.statValue}>₹{stats.totalRevenue}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Today's Sales</p>
          <p style={styles.statValue}>₹{stats.todaySales}</p>
        </div>
      </div>

      <h3 style={{ marginTop: 30 }}>Orders by Status</h3>
      <div style={styles.statusRow}>
        {stats.statusCounts.map((s) => (
          <div key={s.status} style={styles.statusPill}>
            {s.status}: {s.count}
          </div>
        ))}
      </div>

      {stats.lowStockProducts.length > 0 && (
        <>
          <h3 style={{ marginTop: 30, color: '#c62828' }}>⚠ Low Stock Alert</h3>
          <ul>
            {stats.lowStockProducts.map((p) => (
              <li key={p.id}>{p.name} — only {p.stock} left</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 60px',
  },
  navRow: {
    display: 'flex',
    gap: 20,
    marginTop: 15,
    marginBottom: 25,
  },
  navLink: {
    padding: '10px 20px',
    backgroundColor: '#1a237e',
    color: 'white',
    borderRadius: 6,
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 20,
  },
  statCard: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  statLabel: {
    color: '#777',
    fontSize: 14,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1a237e',
  },
  statusRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  statusPill: {
    backgroundColor: '#e8eaf6',
    color: '#1a237e',
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 14,
  },
};

export default AdminDashboard;