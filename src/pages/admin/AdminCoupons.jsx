import { useEffect, useState } from 'react';
import API from '../../api/axios';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    code: '',
    discount_type: 'percent',
    discount_value: '',
    min_order_amount: '',
    expiry_date: '',
  };
  const [form, setForm] = useState(emptyForm);

  const fetchCoupons = async () => {
    try {
      const res = await API.get('/admin/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons', form);
      setForm(emptyForm);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to add coupon');
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.put(`/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Manage Coupons</h2>

      <form onSubmit={handleAdd} style={styles.form}>
        <h4>Add New Coupon</h4>

        <div style={styles.formGrid}>
          <input
            name="code"
            placeholder="Coupon Code (e.g. PRANU10)"
            value={form.code}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="discount_type"
            value={form.discount_type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>

          <input
            name="discount_value"
            type="number"
            placeholder={form.discount_type === 'percent' ? 'Discount %' : 'Discount ₹'}
            value={form.discount_value}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="min_order_amount"
            type="number"
            placeholder="Minimum Order Amount (₹)"
            value={form.min_order_amount}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.addButton}>Add Coupon</button>
      </form>

      <div style={styles.list}>
        {coupons.map((coupon) => (
          <div key={coupon.id} style={styles.couponCard}>
            <div>
              <strong>{coupon.code}</strong>
              <p style={{ color: '#777', margin: '4px 0', fontSize: 14 }}>
                {coupon.discount_type === 'percent'
                  ? `${coupon.discount_value}% OFF`
                  : `₹${coupon.discount_value} OFF`}
                {coupon.min_order_amount > 0 && ` · Min order ₹${coupon.min_order_amount}`}
                {coupon.expiry_date && ` · Expires ${new Date(coupon.expiry_date).toLocaleDateString()}`}
              </p>
              <p style={{ fontSize: 13, color: coupon.is_active ? '#2e7d32' : '#999' }}>
                {coupon.is_active ? '✅ Active' : '⏸ Inactive'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleToggle(coupon.id)} style={styles.toggleButton}>
                {coupon.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(coupon.id)} style={styles.deleteButton}>
                Delete
              </button>
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
    maxWidth: 700,
  },
  form: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginTop: 10,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  addButton: {
    marginTop: 15,
    padding: '10px 20px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  list: {
    marginTop: 25,
  },
  couponCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  toggleButton: {
    padding: '6px 12px',
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 13,
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 13,
  },
};

export default AdminCoupons;