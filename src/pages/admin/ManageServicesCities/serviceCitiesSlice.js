import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDataInUrl,
  downloadFile,
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  postRawData,
  putRawData,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  specializationCityList: [],
  specializationCityDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        specializationId: "",
        startDate: "",
        endDate: "",
      },
};

// ✅ Bulk create
export const addSpecializationCityBulk = createAsyncThunk(
  "specializationCity/addBulk",
  async (params) => {
    const response = await postRawData("admin/specializationCity", params);
    return response;
  }
);

// ✅ Update one
export const updateSpecializationCity = createAsyncThunk(
  "specializationCity/update",
  async ({ id, data }) => {
    const response = await putRawData(`admin/specializationCity/${id}`, data);
    return response;
  }
);

// ✅ Toggle status
export const toggleSpecializationCity = createAsyncThunk(
  "specializationCity/toggle",
  async ({ id, filters }, { dispatch }) => {
    const response = await patchEncodedInUrl(
      `admin/specializationCity/toggle/${id}`
    );
    if (response?.code === 1) {
      dispatch(specializationCityList(filters));
    }
    return response;
  }
);

// ✅ Delete one
export const deleteSpecializationCity = createAsyncThunk(
  "specializationCity/delete",
  async ({ id, filters }, { dispatch }) => {
    const response = await deleteDataInUrl(`admin/specializationCity/${id}`);
    if (response?.code === 1) {
      dispatch(specializationCityList(filters));
    }
    return response;
  }
);

// ✅ Fetch details
export const specializationCityDetails = createAsyncThunk(
  "specializationCity/details",
  async (id) => {
    const response = await getDataForDetails(`admin/specializationCity`, id);
    return response?.data;
  }
);

// ✅ List all
export const specializationCityList = createAsyncThunk(
  "specializationCity/list",
  async (filters) => {
    const response = await getData("admin/specializationCity", filters);
    return response?.data;
  }
);

export const downloadSpecializationCityList = createAsyncThunk(
  "downloadCityList",
  async (filters) => {
    await downloadFile(
      "admin/specializationCity/download",
      filters,
      "cities.xlsx"
    );
    return true;
  }
);

const specializationCitySlice = createSlice({
  name: "specializationCity",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(specializationCityList.fulfilled, (state, action) => {
        state.specializationCityList = action.payload?.serviceFAQs || [];
        state.total = action.payload?.total_SpecializationCity || 0;
        state.isLoading = false;
      })
      .addCase(specializationCityDetails.fulfilled, (state, action) => {
        state.specializationCityDetails = action.payload;
        state.isLoading = false;
      })
      .addCase(addSpecializationCityBulk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSpecializationCityBulk.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { storeFilters } = specializationCitySlice.actions;

export default specializationCitySlice.reducer;
