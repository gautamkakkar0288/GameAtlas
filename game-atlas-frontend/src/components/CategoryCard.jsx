const CategoryCard = ({ category, onClick }) => {
  const { name, image, count, gradient } = category;

  const defaultGradient = gradient ||
    "linear-gradient(135deg, rgba(109,40,217,0.8), rgba(236,72,153,0.6))";

  return (
    <div className="category-card" onClick={onClick}>
      {image ? (
        <img src={image} alt={name} className="category-card-bg" />
      ) : (
        <div style={{ width: "100%", height: "100%", background: defaultGradient }} />
      )}
      <div
        className="category-card-overlay"
        style={{
          background: image
            ? "linear-gradient(to top, rgba(7,9,27,0.9) 0%, rgba(7,9,27,0.3) 100%)"
            : "transparent",
        }}
      >
        <div className="category-card-label">{name}</div>
        {count !== undefined && (
          <div className="category-card-count">{count} games</div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
