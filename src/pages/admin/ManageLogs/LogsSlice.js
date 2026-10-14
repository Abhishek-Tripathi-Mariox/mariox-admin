// src/redux/slices/specializationCityLogsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData, getDataForDetails } from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  error: null,

  logsList: [],
  logDetails: null,
  total: 0,

  filters: {
    page: 1,
    limit: 10,
    serviceCityId: "", // filter by serviceCityId
    startDate: "",
    endDate: "",
  },
};

// ---------------- Thunks ----------------

// 🔹 Fetch logs list
export const fetchSpecializationCityLogs = createAsyncThunk(
  "specializationCityLogs/list",
  async (params, { rejectWithValue }) => {
    try {
      const response = await getData("admin/specializationCity/logs", params);
      if (response && response.code === 1) {
        const payload = response.data;

        const list =
          (payload && payload.logs) ||
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) ? payload : []) ||
          [];

        const total =
          (payload && payload.total) || (payload && payload.totalLogs) || 0;

        return { list, total };
      }
      return rejectWithValue({
        message: response?.message || "Failed to load logs",
      });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

// 🔹 Fetch single log details
export const fetchSpecializationCityLogDetails = createAsyncThunk(
  "specializationCityLogs/details",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getDataForDetails(
        "admin/specializationCity/logs",
        { id }
      );
      if (response && response.code === 1) return response.data;
      return rejectWithValue({
        message: response?.message || "Failed to load log details",
      });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

// ---------------- Slice ----------------

const specializationCityLogsSlice = createSlice({
  name: "specializationCityLogs",
  initialState,
  reducers: {
    storeLogFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    // list
    builder
      .addCase(fetchSpecializationCityLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecializationCityLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logsList = action.payload?.list || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(fetchSpecializationCityLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load logs";
        state.logsList = [];
        state.total = 0;
      });

    // details
    builder
      .addCase(fetchSpecializationCityLogDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecializationCityLogDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logDetails = action.payload;
      })
      .addCase(fetchSpecializationCityLogDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load log details";
      });
  },
});

export const { storeLogFilters } = specializationCityLogsSlice.actions;
export default specializationCityLogsSlice.reducer;
