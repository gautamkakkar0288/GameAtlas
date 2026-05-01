import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGameToLibrary, removeGameFromLibrary, selectIsInLibrary } from "../store/slices/librarySlice";
import { addToWishlist, removeFromWishlist, selectIsWishlisted } from "../store/slices/wishlistSlice";
import toast from "react-hot-toast";
import { truncate } from "../utils/helpers";

const StarRating = ({ rating }) => {
  return (
    <span className="game-card-rating">
      ★ {rating ? Number(rating).toFixed(1) : "N/A"}
    </span>
  );
};

const GameCard = ({ game, onClick }) => {
  const dispatch = useDispatch();
  const inLibrary   = useSelector(selectIsInLibrary(game._id));
  const isWishlisted = useSelector(selectIsWishlisted(game._id));
  const [imgError, setImgError] = useState(false);

  const fallback = `https://placehold.co/400x200/10122B/6D28D9?text=${encodeURIComponent(game.title || "Game")}`;

  const handleLibrary = (e) => {
    e.stopPropagation();
    if (inLibrary) {
      dispatch(removeGameFromLibrary(game._id));
      toast.success("Removed from library");
    } else {
      dispatch(addGameToLibrary(game._id));
      toast.success("Added to library!");
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(game._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(game._id));
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="game-card fade-in" onClick={onClick}>
      {/* Image */}
      <div className="game-card-image-wrap">
        <img
          src={imgError ? fallback : (game.coverImage || game.image || fallback)}
          alt={game.title}
          onError={() => setImgError(true)}
        />
        {/* Hover overlay buttons */}
        <div className="game-card-overlay">
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleLibrary}
              className={`btn btn-sm ${inLibrary ? "btn-primary" : "btn-secondary"}`}
            >
              {inLibrary ? "✓ In Library" : "+ Library"}
            </button>
            <button
              onClick={handleWishlist}
              className="btn btn-ghost btn-sm"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* Rating badge */}
        {game.rating && (
          <div className="game-card-badge">★ {Number(game.rating).toFixed(1)}</div>
        )}
      </div>

      {/* Body */}
      <div className="game-card-body">
        <div className="game-card-title">{truncate(game.title, 40)}</div>
        <div className="game-card-meta">
          {game.genre && <span className="game-card-genre">{game.genre}</span>}
          {game.releaseYear && (
            <span className="game-card-genre">{game.releaseYear}</span>
          )}
          {game.rating && <StarRating rating={game.rating} />}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
