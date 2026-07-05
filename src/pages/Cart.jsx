import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getKey = (item) => item.cartKey || item.id;

  const handleIncrease = (key) => {
    const newCart = cart.map((item) =>
      getKey(item) === key ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const handleDecrease = (key) => {
    const newCart = cart
      .map((item) =>
        getKey(item) === key ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const handleRemove = (key) => {
    const newCart = cart.filter((item) => getKey(item) !== key);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <h2>Your cart is empty</h2>
        <button style={styles.shopButton} onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={getKey(item)} style={styles.cartItem}>
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} style={styles.itemImage} />
          ) : (
            <div style={styles.imageBox}>🥭</div>
          )}

          <div style={styles.itemDetails}>
            <h4>{item.name}</h4>
            <p style={{ color: '#777' }}>{item.weight}</p>
            <p style={styles.price}>₹{item.price}</p>
          </div>

          <div style={styles.quantityRow}>
            <button style={styles.qtyButton} onClick={() => handleDecrease(getKey(item))}>−</button>
            <span style={styles.qtyDisplay}>{item.quantity}</span>
            <button style={styles.qtyButton} onClick={() => handleIncrease(getKey(item))}>+</button>
          </div>

          <p style={styles.subtotal}>₹{item.price * item.quantity}</p>

          <button style={styles.removeButton} onClick={() => handleRemove(getKey(item))}>
            Remove
          </button>
        </div>
      ))}

      <div style={styles.totalRow}>
        <h3>Total: ₹{total}</h3>
        <button style={styles.checkoutButton} onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 60px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '15px 0',
    borderBottom: '1px solid #eee',
  },
  imageBox: {
    fontSize: 40,
    width: 70,
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
  },
  itemImage: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    border: '1px solid #ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  qtyDisplay: {
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    fontWeight: 'bold',
    minWidth: 70,
    textAlign: 'right',
  },
  removeButton: {
    color: 'red',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
  },
  totalRow: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButton: {
    padding: '12px 30px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
  shopButton: {
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

export default Cart;