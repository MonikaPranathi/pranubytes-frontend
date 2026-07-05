import { useEffect, useState } from 'react';
import API from '../../api/axios';

function AdminSettings() {
  const [deliveryFee, setDeliveryFee] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings');
        setDeliveryFee(res.data.delivery_fee);
        setPlatformFee(res.data.platform_fee);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await API.put('/settings', {
        delivery_fee: deliveryFee,
        platform_fee: platformFee,
      });
      setMessage('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Delivery & Platform Fees</h2>

      <form onSubmit={handleSave} style={styles.form}>
        <label style={styles.label}>Delivery Fee (₹)</label>
        <input
          type="number"
          value={deliveryFee}
          onChange={(e) => setDeliveryFee(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Platform Fee (₹)</label>
        <input
          type="number"
          value={platformFee}
          onChange={(e) => setPlatformFee(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.saveButton} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {message && <p style={{ color: '#2e7d32' }}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 60px',
    maxWidth: 450,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  saveButton: {
    marginTop: 15,
    padding: '10px 20px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
};

export default AdminSettings;