import { useState, useEffect } from 'react';

function BannerCarousel({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div style={styles.container}>
      <img
        src={banners[current].image_url}
        alt={banners[current].title || 'Banner'}
        style={styles.image}
      />

      {banners.length > 1 && (
        <div style={styles.dots}>
          {banners.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              style={{
                ...styles.dot,
                backgroundColor: index === current ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  dots: {
    position: 'absolute',
    bottom: 15,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

export default BannerCarousel;