import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/wishlistService";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistService.getWishlist();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addGame",
  async (gameId, { rejectWithValue }) => {
    try {
      const res = await wishlistService.addToWishlist(gameId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeGame",
  async (gameId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(gameId);
      return gameId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.games = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.games.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.games = state.games.filter(
          (g) => g.gameId !== action.payload && g._id !== action.payload && g.game?.id !== action.payload
        );
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectWishlist        = (state) => state.wishlist.games;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectIsWishlisted    = (gameId) => (state) =>
  state.wishlist.games.some((g) => g.gameId === gameId || g._id === gameId || g.game?.id === gameId);

export default wishlistSlice.reducer;
