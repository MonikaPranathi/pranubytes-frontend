import { useEffect, useState } from 'react';
import API from '../../api/axios';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      setNewImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name: newCategory, image_url: newImageUrl });
      } else {
        await API.post('/categories', { name: newCategory, image_url: newImageUrl });
      }
      setNewCategory('');
      setNewImageUrl('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setNewCategory(cat.name);
    setNewImageUrl(cat.image_url || '');
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewCategory('');
    setNewImageUrl('');
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products in it may become uncategorized.')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Manage Categories</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h4>{editingId ? 'Edit Category' : 'Add New Category'}</h4>

        <input
          type="text"
          placeholder="Category name (e.g. Dry Fruits)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={styles.input}
        />

        <label style={styles.uploadLabel}>
          {uploading ? 'Uploading...' : 'Choose Category Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>

        {newImageUrl && (
          <img src={newImageUrl} alt="Preview" style={styles.previewImage} />
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={styles.addButton}>
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={styles.list}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.categoryRow}>
            <div style={styles.categoryInfo}>
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} style={styles.thumbnail} />
              ) : (
                <div style={styles.thumbnailPlaceholder}>📦</div>
              )}
              <span>{cat.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(cat)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(cat.id)} style={styles.deleteButton}>Delete</button>
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
    maxWidth: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 15,
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
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
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: '50%',
    border: '1px solid #ddd',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#1a237e',
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
    marginTop: 25,
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  categoryInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 45,
    height: 45,
    objectFit: 'cover',
    borderRadius: '50%',
  },
  thumbnailPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    backgroundColor: '#f1f8e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
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

export default AdminCategories;