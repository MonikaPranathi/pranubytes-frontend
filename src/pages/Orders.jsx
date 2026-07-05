import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import OrderTracker from '../components/OrderTracker';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <h2>No orders yet</h2>
        <button style={styles.button} onClick={() => navigate('/')}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Your Orders</h2>

      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <span><strong>Order #{order.id}</strong></span>
            <span style={styles.status(order.status)}>{order.status}</span>
          </div>
          <p style={{ color: '#777', marginTop: 5 }}>
            {new Date(order.created_at).toLocaleDateString()} · {order.payment_method}
          </p>

          <OrderTracker status={order.status} />

          <p style={styles.total}>Total: ₹{order.total}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '30px auto',
    padding: '0 20px',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 18,
    marginTop: 15,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  status: (status) => ({
    color: status === 'Delivered' ? '#2e7d32' : '#f57c00',
    fontWeight: 'bold',
  }),
  total: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: '12px 30px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
};

export default Orders;