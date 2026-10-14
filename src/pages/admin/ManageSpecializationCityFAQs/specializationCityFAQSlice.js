import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDataInUrl,
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  postRawData,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  specializationCityFAQList: [],
  specializationCityFAQDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      },
};

export const addSpecializationCityFAQs = createAsyncThunk(
  "specializationCityFAQs/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/specializationCityFAQs", params);
    if (response && response.code === 1) {
      dispatch(specializationCityFAQList());
      return response;
    }
  }
);

export const updateSpecializationCityFAQs = createAsyncThunk(
  "updateCityFAQs",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/specializationCityFAQs", object);
    if (response && response.code === 1) {
      dispatch(specializationCityFAQList());
      return response;
    }
  }
);

export const toggleSpecializationCityFAQs = createAsyncThunk(
  "toggleCityFAQs",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/specializationCityFAQs", {
      id,
    });
    if (response && response.code === 1) {
      dispatch(specializationCityFAQList(filters));
      return response;
    }
  }
);

export const deleteSpecializationCityFAQs = createAsyncThunk(
  "SpecializationCityFAQs/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/specializationCityFAQs", {
      id,
    });
    if (response && response.code === 1) {
      dispatch(specializationCityFAQList(filters));
      return response;
    }
  }
);

export const specializationCityFAQDetails = createAsyncThunk(
  "specializationCityFAQ/id",
  async (object) => {
    let response = await getDataForDetails(
      "admin/specializationCityFAQs",
      object
    );
    if (response && response.code === 1) {
      // dispatch(specializationCityFAQList());
      return response.data;
    }
  }
);

export const specializationCityFAQList = createAsyncThunk(
  "specializationCityFAQList",
  async (object) => {
    let response = await getData("admin/specializationCityFAQs", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const specializationCityFAQSlice = createSlice({
  name: "specializationCityFAQ",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addSpecializationCityFAQs.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [specializationCityFAQList.fulfilled]: (state, action) => {
      state.specializationCityFAQList = action.payload?.cityFAQs;
      state.total = action.payload?.total_SpecializationCityFAQs;
      state.isLoading = false;
    },
    [specializationCityFAQDetails.fulfilled]: (state, action) => {
      state.specializationCityFAQDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = specializationCityFAQSlice.actions;

export default specializationCityFAQSlice.reducer;
