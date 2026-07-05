import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import BannerCarousel from '../components/BannerCarousel';

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, bannerRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products'),
          API.get('/banners'),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setBanners(bannerRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item.cartKey === product.cartKey);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} (${product.weight}) added to cart!`);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  let filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div>
      {banners.length > 0 ? (
        <BannerCarousel banners={banners} />
      ) : (
        <div style={styles.banner}>
          <h1 style={styles.bannerText}>Fresh Pickles & Snacks, Delivered to You</h1>
          <p style={styles.bannerSubtext}>Authentic homemade taste, made with love</p>
        </div>
      )}

      <div style={{ padding: '20px 30px' }}>
        <h2>Categories</h2>
        <div style={styles.categoryRow}>
          <div style={styles.categoryItem} onClick={() => setSelectedCategory(null)}>
            <div
              style={{
                ...styles.categoryCircle,
                ...(selectedCategory === null ? styles.categoryCircleActive : {}),
              }}
            >
              🍽️
            </div>
            <span style={styles.categoryLabel2}>All</span>
          </div>

          {categories.map((cat) => (
            <div
              key={cat.id}
              style={styles.categoryItem}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  style={{
                    ...styles.categoryCircleImage,
                    ...(selectedCategory === cat.id ? styles.categoryCircleActive : {}),
                  }}
                />
              ) : (
                <div
                  style={{
                    ...styles.categoryCircle,
                    ...(selectedCategory === cat.id ? styles.categoryCircleActive : {}),
                  }}
                >
                  📦
                </div>
              )}
              <span style={styles.categoryLabel2}>{cat.name}</span>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: 30 }}>
          {searchTerm
            ? `Search results for "${searchTerm}"`
            : selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'All Products'}
        </h2>

        {filteredProducts.length === 0 ? (
          <p style={{ marginTop: 15, color: '#777' }}>No products found.</p>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categories.find((c) => c.id === product.category_id)?.name}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, categoryName, onAddToCart }) {
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [{ weight: product.weight, price: product.price, stock: product.stock }];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const isOutOfStock = selectedVariant.stock === 0;

  return (
    <div style={styles.productCard}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={styles.productImage} />
        ) : (
          <div style={styles.productImagePlaceholder}>🥭</div>
        )}
        <h4 style={styles.productName}>{product.name}</h4>
        <p style={styles.categoryLabel}>{categoryName}</p>
        <p style={styles.stockLabel}>
          {isOutOfStock ? '❌ Out of stock' : '✅ In stock'}
        </p>
      </Link>

      <div style={styles.variantRow}>
        {variants.map((v) => (
          <button
            key={v.weight}
            onClick={() => setSelectedVariant(v)}
            style={{
              ...styles.weightPillButton,
              ...(selectedVariant.weight === v.weight ? styles.weightPillButtonActive : {}),
            }}
          >
            {v.weight}
          </button>
        ))}
      </div>

      <p style={styles.price}>₹{selectedVariant.price}</p>

      <button
        style={{
          ...styles.addToCartButton,
          ...(isOutOfStock ? styles.addToCartButtonDisabled : {}),
        }}
        disabled={isOutOfStock}
        onClick={() =>
          onAddToCart({
            ...product,
            weight: selectedVariant.weight,
            price: selectedVariant.price,
            cartKey: `${product.id}-${selectedVariant.weight}`,
          })
        }
      >
        Add To Cart
      </button>
    </div>
  );
}

const styles = {
  banner: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '50px 30px',
    textAlign: 'center',
  },
  bannerText: {
    fontSize: '32px',
    margin: 0,
  },
  bannerSubtext: {
    fontSize: '16px',
    marginTop: 10,
    opacity: 0.9,
  },
  categoryRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    width: 80,
  },
  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    border: '3px solid transparent',
  },
  categoryCircleImage: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid transparent',
  },
  categoryCircleActive: {
    border: '3px solid #2e7d32',
  },
  categoryLabel2: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: 15,
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '15px',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  productImagePlaceholder: {
    fontSize: '50px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  productName: {
    margin: '5px 0 2px 0',
    fontSize: 16,
  },
  categoryLabel: {
    color: '#999',
    fontSize: 13,
    margin: '0 0 6px 0',
  },
  stockLabel: {
    fontSize: 13,
    color: '#2e7d32',
    margin: '0 0 8px 0',
  },
  variantRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  weightPillButton: {
    backgroundColor: '#f3e5f5',
    color: '#6a1b9a',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: 13,
    border: '2px solid transparent',
    cursor: 'pointer',
  },
  weightPillButtonActive: {
    border: '2px solid #6a1b9a',
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: 18,
    marginBottom: 10,
  },
  addToCartButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#42a5f5',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 'auto',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

export default Home;