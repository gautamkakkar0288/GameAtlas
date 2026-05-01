import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { libraryService } from "../../services/libraryService";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchLibrary = createAsyncThunk(
  "library/fetchLibrary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await libraryService.getLibrary();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load library");
    }
  }
);

export const addGameToLibrary = createAsyncThunk(
  "library/addGame",
  async (gameId, { rejectWithValue }) => {
    try {
      const res = await libraryService.addGame(gameId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add game");
    }
  }
);

export const removeGameFromLibrary = createAsyncThunk(
  "library/removeGame",
  async (gameId, { rejectWithValue }) => {
    try {
      await libraryService.removeGame(gameId);
      return gameId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove game");
    }
  }
);

export const updateGameStatus = createAsyncThunk(
  "library/updateStatus",
  async ({ gameId, status }, { rejectWithValue }) => {
    try {
      const res = await libraryService.updateStatus(gameId, status);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const librarySlice = createSlice({
  name: "library",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLibrary: (state) => {
      state.games = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGameToLibrary.fulfilled, (state, action) => {
        state.games.push(action.payload);
      })
      .addCase(removeGameFromLibrary.fulfilled, (state, action) => {
        state.games = state.games.filter((g) => g.gameId !== action.payload);
      })
      .addCase(updateGameStatus.fulfilled, (state, action) => {
        const idx = state.games.findIndex((g) => g.gameId === action.payload.gameId);
        if (idx !== -1) state.games[idx] = action.payload;
      });
  },
});

export const { clearLibrary } = librarySlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectLibrary        = (state) => state.library.games;
export const selectLibraryLoading = (state) => state.library.loading;
export const selectLibraryError   = (state) => state.library.error;
export const selectIsInLibrary    = (gameId) => (state) =>
  state.library.games.some((g) => g.gameId === gameId || g._id === gameId);

export default librarySlice.reducer;
