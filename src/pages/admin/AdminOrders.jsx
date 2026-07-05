import { useEffect, useState } from 'react';
import API from '../../api/axios';

const STATUS_FLOW = [
  'Pending',
  'Accepted',
  'Packing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <strong>Order #{order.id}</strong>
                <p style={{ color: '#777', margin: '4px 0' }}>
                  {order.customer_name} · {order.customer_email}
                </p>
              </div>
              <span style={styles.statusBadge(order.status)}>{order.status}</span>
            </div>

            <p style={{ marginTop: 8 }}>
              <strong>Total:</strong> ₹{order.total} · <strong>Payment:</strong> {order.payment_method}
            </p>
            <p style={{ marginTop: 4, color: '#555' }}>
              <strong>Address:</strong> {order.address}
            </p>
            <p style={{ marginTop: 4, color: '#999', fontSize: 13 }}>
              {new Date(order.created_at).toLocaleString()}
            </p>

            <div style={styles.statusRow}>
              <label style={{ fontSize: 14, marginRight: 10 }}>Update Status:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updatingId === order.id}
                style={styles.select}
              >
                {STATUS_FLOW.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {updatingId === order.id && <span style={{ marginLeft: 10 }}>Updating...</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 60px',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: (status) => ({
    padding: '5px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor:
      status === 'Delivered' ? '#e8f5e9' :
      status === 'Cancelled' ? '#ffebee' : '#fff3e0',
    color:
      status === 'Delivered' ? '#2e7d32' :
      status === 'Cancelled' ? '#c62828' : '#e65100',
  }),
  statusRow: {
    marginTop: 15,
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
  },
};

export default AdminOrders;