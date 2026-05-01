import { useState, useEffect } from "react";
import { gameService } from "../services/gameService";
import toast from "react-hot-toast";

export const useGames = (params = {}) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gameService.getAllGames(params);
      setGames(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch games";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { games, loading, error, refetch: fetchGames };
};
