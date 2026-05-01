import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BellRing, HeartOff, Search } from "lucide-react";
import toast from "react-hot-toast";
import { wishlistService } from "../services/wishlistService";

const getDiscount = (id) => {
  const values = [12, 18, 25, 35, 42, 50];
  return values[id % values.length];
};

const formatPrice = (value) => `₹${new Intl.NumberFormat("en-IN").format(value)}`;

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyGameId, setBusyGameId] = useState(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistService.getWishlist();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async (gameId) => {
    try {
      setBusyGameId(gameId);
      await wishlistService.removeFromWishlist(gameId);
      setItems((prev) => prev.filter((item) => item.gameId !== gameId && item.game?.id !== gameId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to remove");
    } finally {
      setBusyGameId(null);
    }
  };

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.game?.title?.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "14px", flexWrap: "wrap" }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Your Wishlist</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
            Saved games with live deal vibes, discount highlights, and price alert targets.
          </p>
        </div>
        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={18} style={{ position: "absolute", left: "10px", top: "12px", color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wishlist..."
            style={{
              width: "100%",
              padding: "11px 14px 11px 36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              color: "white",
              outline: "none",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "42px" }}>
          <h3>Loading wishlist...</h3>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "56px" }}>
          <h3>Your wishlist is empty</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", marginBottom: "16px" }}>
            Add games from Home or Game Details to track future discounts.
          </p>
          <Link to="/" className="btn btn-primary">Explore Games</Link>
        </div>
      ) : (
        <div className="games-grid">
          {visibleItems.map((item) => {
            const game = item.game || {};
            const gameId = game.id || item.gameId;
            const discount = getDiscount(gameId || 1);
            const basePrice = 3999 - ((gameId || 1) % 5) * 400;
            const salePrice = Math.max(799, Math.round(basePrice * ((100 - discount) / 100)));
            const alertTarget = Math.max(699, salePrice - 200);
            const isBusy = busyGameId === gameId;

            return (
              <article key={item.id || gameId} className="game-card" style={{ background: "linear-gradient(180deg, rgba(16,18,43,0.92), rgba(7,9,27,0.95))" }}>
                <div className="game-card-image-wrap" style={{ height: "190px" }}>
                  <img
                    src={game.coverImage || "https://placehold.co/800x450/111827/6D28D9?text=Wishlist+Game"}
                    alt={game.title || "Game"}
                  />
                  <div className="game-card-badge" style={{ color: "#F472B6", borderColor: "rgba(244,114,182,0.4)" }}>
                    {discount}% OFF
                  </div>
                </div>

                <div className="game-card-body" style={{ display: "grid", gap: "10px" }}>
                  <h3 className="game-card-title" style={{ fontSize: "19px" }}>{game.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{game.genre || "Action"} • {game.platform || "Steam / Epic"}</p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ color: "var(--text-dim)", textDecoration: "line-through", fontSize: "13px" }}>{formatPrice(basePrice)}</span>
                    <span style={{ color: "#34D399", fontWeight: 800, fontSize: "24px" }}>{formatPrice(salePrice)}</span>
                  </div>

                  <div style={{ border: "1px solid rgba(56,189,248,0.35)", background: "rgba(6,182,212,0.08)", borderRadius: "10px", padding: "8px 10px" }}>
                    <p style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#67E8F9", fontWeight: 700 }}>
                      <BellRing size={14} />
                      Price Alert Enabled
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Notify me when price drops below <span style={{ color: "white", fontWeight: 700 }}>{formatPrice(alertTarget)}</span>
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Link to={`/games/${gameId}`} className="btn btn-primary btn-sm">View Details</Link>
                    <button onClick={() => removeItem(gameId)} disabled={isBusy} className="btn btn-danger btn-sm">
                      <HeartOff size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

