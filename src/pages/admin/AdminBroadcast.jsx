import { useState } from 'react';
import API from '../../api/axios';

function AdminBroadcast() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    try {
      await API.post('/push/broadcast', { title, body });
      setMessage('✅ Notification sent to all subscribed customers!');
      setTitle('');
      setBody('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  const quickTemplates = [
    { label: 'Festival Wishes', title: '🎉 Festival Greetings!', body: 'Wishing you and your family a happy festival! Enjoy special discounts today.' },
    { label: 'New Coupon', title: '🎁 New Coupon Added!', body: 'Use code PRANU10 for 10% off your next order. Limited time offer!' },
    { label: 'New Product', title: '🆕 New Arrival!', body: 'Check out our latest addition to the menu — fresh and ready to order!' },
  ];

  const applyTemplate = (template) => {
    setTitle(template.title);
    setBody(template.body);
  };

  return (
    <div style={styles.container}>
      <h2>Send Notification to Customers</h2>
      <p style={{ color: '#777', fontSize: 14 }}>
        This sends a real push notification to everyone who has enabled notifications on the site.
      </p>

      <div style={styles.templateRow}>
        {quickTemplates.map((t) => (
          <button key={t.label} onClick={() => applyTemplate(t)} style={styles.templateButton}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} style={styles.form}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          placeholder="e.g. Diwali Offer!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Message</label>
        <textarea
          placeholder="e.g. Get 20% off on all pickles this Diwali!"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={styles.textarea}
          rows={4}
          required
        />

        <button type="submit" style={styles.sendButton} disabled={sending}>
          {sending ? 'Sending...' : 'Send Notification'}
        </button>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px 15px',
    maxWidth: 500,
  },
  templateRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 15,
  },
  templateButton: {
    padding: '8px 14px',
    backgroundColor: '#e8eaf6',
    color: '#1a237e',
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 13,
  },
  form: {
    marginTop: 20,
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  textarea: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  sendButton: {
    marginTop: 15,
    padding: '12px 20px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 15,
  },
};

export default AdminBroadcast;