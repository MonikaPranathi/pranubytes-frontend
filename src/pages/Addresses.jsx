import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const emptyForm = {
    label: 'Home',
    full_address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    latitude: null,
    longitude: null,
    is_default: false,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = async () => {
    try {
      const res = await API.get('/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const components = result.address_components;

            const getComponent = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || '';

            setForm((prev) => ({
              ...prev,
              full_address: result.formatted_address,
              city: getComponent('locality') || getComponent('administrative_area_level_2'),
              state: getComponent('administrative_area_level_1'),
              pincode: getComponent('postal_code'),
              latitude,
              longitude,
            }));
          } else {
            alert('Could not detect address from your location. Please enter manually.');
          }
        } catch (err) {
          console.error(err);
          alert('Failed to fetch address from location.');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error(error);
        alert('Could not access your location. Please allow location permission.');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/addresses/${editingId}`, form);
      } else {
        await API.post('/addresses', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save address');
    }
  };

  const handleEdit = (addr) => {
    setForm({
      label: addr.label,
      full_address: addr.full_address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      latitude: addr.latitude,
      longitude: addr.longitude,
      is_default: addr.is_default,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await API.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await API.put(`/addresses/${id}/default`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert('Failed to set default address');
    }
  };

  const handleCancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Your Addresses</h2>

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          + Add New Address
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h4>{editingId ? 'Edit Address' : 'Add New Address'}</h4>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            style={styles.locationButton}
            disabled={locating}
          >
            {locating ? 'Detecting location...' : '📍 Use Current Location'}
          </button>

          <select name="label" value={form.label} onChange={handleChange} style={styles.input}>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="full_address"
            placeholder="Full Address"
            value={form.full_address}
            onChange={handleChange}
            style={styles.textarea}
            rows={3}
            required
          />

          <div style={styles.row}>
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            {' '}Set as default address
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={styles.saveButton}>
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button type="button" onClick={handleCancelForm} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.list}>
        {addresses.map((addr) => (
          <div key={addr.id} style={styles.addressCard}>
            <div style={styles.addressHeader}>
              <strong>{addr.label}</strong>
              {addr.is_default ? (
                <span style={styles.defaultBadge}>Default</span>
              ) : (
                <button onClick={() => handleSetDefault(addr.id)} style={styles.setDefaultButton}>
                  Set as Default
                </button>
              )}
            </div>
            <p style={{ marginTop: 6 }}>{addr.full_address}</p>
            <p style={{ color: '#777', fontSize: 14 }}>
              {addr.city}, {addr.state} - {addr.pincode}
            </p>
            {addr.phone && <p style={{ color: '#777', fontSize: 14 }}>📞 {addr.phone}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={() => handleEdit(addr)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(addr.id)} style={styles.deleteButton}>Delete</button>
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
    maxWidth: 600,
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    marginTop: 15,
  },
  form: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  locationButton: {
    padding: '10px',
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
    flex: 1,
  },
  textarea: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  row: {
    display: 'flex',
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  list: {
    marginTop: 20,
  },
  addressCard: {
    border: '1px solid #eee',
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
  },
  addressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  setDefaultButton: {
    backgroundColor: 'transparent',
    color: '#1565c0',
    border: '1px solid #1565c0',
    padding: '4px 12px',
    borderRadius: 15,
    fontSize: 12,
    cursor: 'pointer',
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

export default Addresses;