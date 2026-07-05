import { useEffect, useState } from 'react';
import API from '../../api/axios';

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBanners = async () => {
    try {
      const res = await API.get('/admin/banners');
      setBanners(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

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
      setImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload a banner image first.');
      return;
    }

    try {
      await API.post('/banners', { image_url: imageUrl, title });
      setImageUrl('');
      setTitle('');
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to add banner');
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.put(`/banners/${id}/toggle`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('Failed to update banner status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await API.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('Failed to delete banner');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Manage Banners</h2>

      <form onSubmit={handleAdd} style={styles.form}>
        <h4>Add New Banner</h4>
        <p style={{ color: '#777', fontSize: 13 }}>
          Recommended: wide rectangular images (e.g. 1200x400px) for best fit on the homepage.
        </p>

        <label style={styles.uploadLabel}>
          {uploading ? 'Uploading...' : 'Choose Banner Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>

        {imageUrl && <img src={imageUrl} alt="Preview" style={styles.previewImage} />}

        <input
          type="text"
          placeholder="Banner title / offer text (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.addButton}>Add Banner</button>
      </form>

      <div style={styles.list}>
        {banners.map((banner) => (
          <div key={banner.id} style={styles.bannerCard}>
            <img src={banner.image_url} alt={banner.title} style={styles.bannerThumbnail} />
            <div style={styles.bannerInfo}>
              <p><strong>{banner.title || 'No title'}</strong></p>
              <p style={{ color: banner.is_active ? '#2e7d32' : '#999', fontSize: 13 }}>
                {banner.is_active ? '✅ Active (visible on site)' : '⏸ Inactive (hidden)'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleToggle(banner.id)} style={styles.toggleButton}>
                {banner.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(banner.id)} style={styles.deleteButton}>
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
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#e8eaf6',
    color: '#1a237e',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    maxHeight: 150,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #ddd',
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  addButton: {
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
  bannerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    border: '1px solid #eee',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  bannerThumbnail: {
    width: 120,
    height: 60,
    objectFit: 'cover',
    borderRadius: 6,
  },
  bannerInfo: {
    flex: 1,
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

export default AdminBanners;