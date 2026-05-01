import { useState } from "react";
import { getProfilePicUrl, formatDate, truncate } from "../utils/helpers";

const Stars = ({ rating, max = 5 }) => (
  <div className="review-stars">
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className="review-star"
        style={{ color: i < rating ? "#FBBF24" : "var(--bg-surface-3)" }}
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewCard = ({ review, onLike }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX = 180;
  const isLong = review.body?.length > MAX;

  return (
    <div className="review-card">
      <div className="review-card-header">
        <img
          src={getProfilePicUrl(review.user?.profilePic, review.user?.name)}
          alt={review.user?.name}
          className="review-avatar"
        />
        <div>
          <div className="review-author">{review.user?.name || "Anonymous"}</div>
          <div className="review-date">{formatDate(review.createdAt)}</div>
        </div>
        {review.rating && <Stars rating={review.rating} />}
      </div>

      {review.title && (
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>
          {review.title}
        </div>
      )}

      <p className="review-body">
        {isLong && !expanded ? truncate(review.body, MAX) : review.body}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none", border: "none", color: "var(--primary-light)",
              cursor: "pointer", fontSize: 13, marginLeft: 6, padding: 0,
            }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Likes */}
      <div className="review-likes">
        <button
          onClick={() => onLike?.(review._id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <span style={{ fontSize: 16 }}>♡</span>
          <span>{review.likes || 0} helpful</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
