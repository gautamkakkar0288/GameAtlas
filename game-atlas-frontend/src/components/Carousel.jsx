import { useState, useEffect, useCallback } from "react";

const Carousel = ({ slides = [], autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() =>
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)), [slides.length]);
  const next = useCallback(() =>
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)), [slides.length]);

  useEffect(() => {
    if (!autoPlay || slides.length < 2) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, slides.length]);

  if (!slides.length) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Track */}
      <div className="carousel-root">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="carousel-slide">
              <img
                src={slide.image}
                alt={slide.title}
                className="carousel-slide-img"
              />
              <div className="carousel-slide-overlay">
                {slide.tag && <span className="carousel-tag">{slide.tag}</span>}
                <h1 className="carousel-title">{slide.title}</h1>
                {slide.description && (
                  <p className="carousel-desc">{slide.description}</p>
                )}
                {slide.actions && (
                  <div className="carousel-actions">{slide.actions}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button className="carousel-btn-prev" onClick={prev} aria-label="Previous">‹</button>
            <button className="carousel-btn-next" onClick={next} aria-label="Next">›</button>
          </>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
