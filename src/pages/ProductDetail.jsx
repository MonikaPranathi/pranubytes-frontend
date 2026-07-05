import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} style={styles.imageBox} />
      ) : (
        <div style={styles.imageBox}>🥭</div>
      )}

      <div style={styles.details}>
        <h2>{product.name}</h2>
        <p style={styles.weight}>{product.weight}</p>
        <p style={styles.price}>₹{product.price}</p>
        <p style={styles.description}>{product.description}</p>

        <div style={styles.quantityRow}>
          <button
            style={styles.qtyButton}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span style={styles.qtyDisplay}>{quantity}</span>
          <button
            style={styles.qtyButton}
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        <button style={styles.addButton} onClick={handleAddToCart}>
          Add to Cart
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: 40,
    padding: '40px 60px',
    flexWrap: 'wrap',
  },
  imageBox: {
    fontSize: 150,
    width: 300,
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f8e9',
    borderRadius: 15,
    objectFit: 'cover',
  },
  details: {
    flex: 1,
    minWidth: 280,
  },
  weight: {
    color: '#777',
    marginTop: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
  },
  description: {
    marginTop: 15,
    color: '#444',
    lineHeight: 1.5,
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    marginTop: 25,
  },
  qtyButton: {
    width: 36,
    height: 36,
    fontSize: 18,
    border: '1px solid #ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  qtyDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 25,
    padding: '12px 30px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
  message: {
    marginTop: 15,
    color: 'green',
    fontWeight: 'bold',
  },
};

export default ProductDetail;