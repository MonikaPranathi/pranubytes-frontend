import { useEffect, useState } from 'react';
import API from '../../api/axios';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    name: '',
    category_id: '',
    image_url: '',
    description: '',
    discount: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([{ weight: '', price: '', stock: '' }]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariantRow = () => {
    setVariants([...variants, { weight: '', price: '', stock: '' }]);
  };

  const removeVariantRow = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      console.error(err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanVariants = variants
      .filter((v) => v.weight && v.price)
      .map((v) => ({
        weight: v.weight,
        price: parseFloat(v.price),
        stock: parseInt(v.stock) || 0,
      }));

    if (cleanVariants.length === 0) {
      alert('Please add at least one weight and price option.');
      return;
    }

    try {
      const payload = { ...form, variants: cleanVariants };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post('/products', payload);
      }
      setForm(emptyForm);
      setVariants([{ weight: '', price: '', stock: '' }]);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category_id: product.category_id,
      image_url: product.image_url,
      description: product.description,
      discount: product.discount,
    });

    if (product.variants && product.variants.length > 0) {
      setVariants(
        product.variants.map((v) => ({
          weight: v.weight,
          price: v.price,
          stock: v.stock,
        }))
      );
    } else {
      setVariants([{ weight: product.weight, price: product.price, stock: product.stock }]);
    }

    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setVariants([{ weight: '', price: '', stock: '' }]);
    setEditingId(null);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Manage Products</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>

        <div style={styles.formGrid}>
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            name="discount"
            type="number"
            placeholder="Discount %"
            value={form.discount}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={styles.uploadLabel}>
              {uploading ? 'Uploading...' : 'Choose Product Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>

            {form.image_url && (
              <img src={form.image_url} alt="Preview" style={styles.previewImage} />
            )}
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{ ...styles.input, gridColumn: '1 / -1' }}
            rows={2}
          />
        </div>

        <h4 style={{ marginTop: 20 }}>Weight & Price Options</h4>
        {variants.map((variant, index) => (
          <div key={index} style={styles.variantRow}>
            <input
              placeholder="Weight (e.g. 250g)"
              value={variant.weight}
              onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
              style={styles.variantInput}
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
              style={styles.variantInput}
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
              style={styles.variantInput}
            />
            <button
              type="button"
              onClick={() => removeVariantRow(index)}
              style={styles.removeVariantButton}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addVariantRow} style={styles.addVariantButton}>
          + Add Another Weight Option
        </button>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: 40 }}>Existing Products</h3>
      <div style={styles.productList}>
        {products.map((product) => (
          <div key={product.id} style={styles.productRow}>
            <div>
              <strong>{product.name}</strong>
              <p style={{ color: '#777', margin: '4px 0' }}>
                {product.variants && product.variants.length > 0
                  ? product.variants.map((v) => `${v.weight} - ₹${v.price} (Stock: ${v.stock})`).join(' · ')
                  : `₹${product.price} · ${product.weight} · Stock: ${product.stock ?? 0}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleEdit(product)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 60px',
  },
  form: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginTop: 10,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
    fontFamily: 'inherit',
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#e8eaf6',
    color: '#1a237e',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  },
  previewImage: {
    display: 'block',
    marginTop: 10,
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #ddd',
  },
  variantRow: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  variantInput: {
    flex: 1,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  removeVariantButton: {
    padding: '10px 14px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  addVariantButton: {
    marginTop: 12,
    padding: '8px 16px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 14,
  },
  submitButton: {
    padding: '10px 25px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 25px',
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  productList: {
    marginTop: 15,
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  editButton: {
    padding: '6px 15px',
    backgroundColor: '#fff3e0',
    color: '#e65100',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 15px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
};

export default AdminProducts;