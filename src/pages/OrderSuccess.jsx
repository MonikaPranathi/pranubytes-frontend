import { useParams, Link } from 'react-router-dom';

function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div style={styles.container}>
      <div style={styles.icon}>✅</div>
      <h2>Order Placed Successfully!</h2>
      <p>Your order ID is <strong>#{orderId}</strong></p>
      <p style={{ color: '#777', marginTop: 10 }}>
        You can track your order status in the Orders page.
      </p>

      <div style={styles.buttonRow}>
        <Link to="/orders" style={styles.button}>View Orders</Link>
        <Link to="/" style={styles.buttonOutline}>Continue Shopping</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: 60,
  },
  icon: {
    fontSize: 60,
  },
  buttonRow: {
    marginTop: 25,
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#2e7d32',
    color: 'white',
    borderRadius: 6,
    textDecoration: 'none',
  },
  buttonOutline: {
    padding: '12px 25px',
    border: '1px solid #2e7d32',
    color: '#2e7d32',
    borderRadius: 6,
    textDecoration: 'none',
  },
};

export default OrderSuccess;