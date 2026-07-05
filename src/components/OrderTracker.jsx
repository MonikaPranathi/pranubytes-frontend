function OrderTracker({ status }) {
  const stages = ['Pending', 'Accepted', 'Packing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = stages.indexOf(status);

  if (status === 'Cancelled') {
    return (
      <div style={{ padding: '10px 0', color: '#c62828', fontWeight: 'bold' }}>
        ❌ This order has been cancelled.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {stages.map((stage, index) => (
        <div key={stage} style={styles.stageWrapper}>
          <div style={styles.stageColumn}>
            <div
              style={{
                ...styles.circle,
                backgroundColor: index <= currentIndex ? '#2e7d32' : '#ddd',
              }}
            >
              {index <= currentIndex ? '✓' : ''}
            </div>
            <span
              style={{
                ...styles.label,
                color: index <= currentIndex ? '#2e7d32' : '#999',
                fontWeight: index === currentIndex ? 'bold' : 'normal',
              }}
            >
              {stage}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              style={{
                ...styles.line,
                backgroundColor: index < currentIndex ? '#2e7d32' : '#ddd',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    margin: '15px 0',
    flexWrap: 'wrap',
  },
  stageWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 90,
  },
  stageColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 70,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  },
  label: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  line: {
    flex: 1,
    height: 3,
    marginBottom: 22,
    minWidth: 15,
  },
};

export default OrderTracker;