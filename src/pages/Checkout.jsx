import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [settings, setSettings] = useState({ delivery_fee: 0, platform_fee: 0 });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = Number(settings.delivery_fee) || 0;
  const platformFee = Number(settings.platform_fee) || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + deliveryFee + platformFee - discountAmount;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [addrRes, settingsRes] = await Promise.all([
          API.get('/addresses'),
          API.get('/settings'),
        ]);
        setAddresses(addrRes.data);
        setSettings(settingsRes.data);

        const defaultAddr = addrRes.data.find((a) => a.is_default) || addrRes.data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await API.post('/coupons/apply', {
        code: couponCode,
        orderTotal: subtotal,
      });
      setAppliedCoupon(res.data);
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const placeOrderInBackend = async () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    const res = await API.post('/checkout', {
      items: cart,
      paymentMethod,
      address: selectedAddress.full_address,
      deliveryFee,
      platformFee,
      discount: discountAmount,
    });
    localStorage.removeItem('cart');
    navigate(`/order-success/${res.data.orderId}`);
  };

  const handleRazorpayPayment = async () => {
    try {
      const { data } = await API.post('/create-razorpay-order', { amount: total });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Pranu Bytes',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.verified) {
              await placeOrderInBackend();
            } else {
              setError('Payment verification failed. Please try again.');
              setLoading(false);
            }
          } catch (err) {
            console.error(err);
            setError('Payment verification failed. Please try again.');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: { color: '#2e7d32' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
      setError('Could not start payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError('');

    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'COD') {
        await placeOrderInBackend();
      } else {
        await handleRazorpayPayment();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (pageLoading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <h2>Your cart is empty</h2>
        <button style={styles.button} onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>

      <div style={styles.box}>
        <div style={styles.boxHeader}>
          <h3>Delivery Address</h3>
          <Link to="/addresses" style={styles.manageLink}>Manage Addresses</Link>
        </div>

        {addresses.length === 0 ? (
          <div>
            <p style={{ color: '#777' }}>No saved addresses yet.</p>
            <Link to="/addresses" style={styles.addAddressButton}>+ Add Address</Link>
          </div>
        ) : (
          addresses.map((addr) => (
            <label key={addr.id} style={styles.addressOption}>
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
              />
              <div style={{ marginLeft: 10 }}>
                <strong>{addr.label}</strong>
                {addr.is_default && <span style={styles.defaultTag}>Default</span>}
                <p style={{ margin: '4px 0', color: '#555', fontSize: 14 }}>{addr.full_address}</p>
              </div>
            </label>
          ))
        )}
      </div>

      <div style={styles.box}>
        <h3>Apply Coupon</h3>
        {appliedCoupon ? (
          <div style={styles.appliedCouponRow}>
            <span>
              ✅ <strong>{appliedCoupon.code}</strong> applied — you saved ₹{appliedCoupon.discountAmount}
            </span>
            <button onClick={handleRemoveCoupon} style={styles.removeCouponButton}>Remove</button>
          </div>
        ) : (
          <div style={styles.couponRow}>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              style={styles.couponInput}
            />
            <button onClick={handleApplyCoupon} style={styles.applyButton} disabled={applyingCoupon}>
              {applyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}
        {couponError && <p style={{ color: 'red', fontSize: 13, marginTop: 6 }}>{couponError}</p>}
      </div>

      <div style={styles.box}>
        <h3>Payment Method</h3>
        {['UPI', 'Card', 'COD'].map((method) => (
          <label key={method} style={styles.radioLabel}>
            <input
              type="radio"
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {' '}{method}
          </label>
        ))}
      </div>

      <div style={styles.box}>
        <h3>Price Details</h3>
        <div style={styles.priceRow}>
          <span>Subtotal (MRP)</span>
          <span>₹{subtotal}</span>
        </div>
        <div style={styles.priceRow}>
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div style={styles.priceRow}>
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        {discountAmount > 0 && (
          <div style={{ ...styles.priceRow, color: '#2e7d32' }}>
            <span>Coupon Discount</span>
            <span>−₹{discountAmount}</span>
          </div>
        )}
        <div style={styles.totalRow}>
          <strong>Total Amount</strong>
          <strong>₹{total}</strong>
        </div>
        {discountAmount > 0 && (
          <p style={styles.savingsBanner}>You will save ₹{discountAmount} on this order</p>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button style={styles.button} onClick={handlePlaceOrder} disabled={loading}>
        {loading
          ? 'Processing...'
          : paymentMethod === 'COD'
          ? `Place Order — ₹${total}`
          : `Pay ₹${total}`}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '30px auto',
    padding: '0 20px',
  },
  box: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageLink: {
    fontSize: 13,
    color: '#1565c0',
  },
  addressOption: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
  },
  defaultTag: {
    marginLeft: 8,
    fontSize: 11,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '2px 8px',
    borderRadius: 10,
  },
  addAddressButton: {
    display: 'inline-block',
    marginTop: 10,
    padding: '8px 16px',
    backgroundColor: '#2e7d32',
    color: 'white',
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: 14,
  },
  couponRow: {
    display: 'flex',
    gap: 10,
    marginTop: 10,
  },
  couponInput: {
    flex: 1,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    fontSize: 14,
  },
  applyButton: {
    padding: '10px 20px',
    backgroundColor: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  appliedCouponRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    fontSize: 14,
  },
  removeCouponButton: {
    background: 'none',
    border: 'none',
    color: '#c62828',
    cursor: 'pointer',
    fontSize: 13,
  },
  radioLabel: {
    display: 'block',
    padding: '8px 0',
    fontSize: 16,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 14,
    color: '#555',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #eee',
  },
  savingsBanner: {
    marginTop: 10,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 25,
    padding: 14,
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
};

export default Checkout;