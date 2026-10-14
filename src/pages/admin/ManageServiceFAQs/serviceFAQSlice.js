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
  serviceFAQsList: [],
  serviceFAQsDetails: null,
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

export const addServiceFAQs = createAsyncThunk(
  "serviceFAQs/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/serviceFAQs", params);
    if (response && response.code === 1) {
      dispatch(serviceFAQsList());
      return response;
    }
  }
);

export const updateServiceFAQs = createAsyncThunk(
  "updateServiceFAQs",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/serviceFAQs", object);
    if (response && response.code === 1) {
      dispatch(serviceFAQsList());
      return response;
    }
  }
);

export const toggleServiceFAQs = createAsyncThunk(
  "toggleServiceFAQs",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/serviceFAQs", { id });
    if (response && response.code === 1) {
      dispatch(serviceFAQsList(filters));
      return response;
    }
  }
);

export const deleteServiceFAQs = createAsyncThunk(
  "ServiceFAQs/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/serviceFAQs", { id });
    if (response && response.code === 1) {
      dispatch(serviceFAQsList(filters));
      return response;
    }
  }
);

export const serviceFAQsDetails = createAsyncThunk(
  "serviceFAQs/id",
  async (object) => {
    let response = await getDataForDetails("admin/serviceFAQs", object);
    if (response && response.code === 1) {
      // dispatch(serviceFAQsList());
      return response.data;
    }
  }
);

export const serviceFAQsList = createAsyncThunk(
  "serviceFAQsList",
  async (object) => {
    let response = await getData("admin/serviceFAQs", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const serviceFAQsSlice = createSlice({
  name: "serviceFAQs",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addServiceFAQs.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [serviceFAQsList.fulfilled]: (state, action) => {
      state.serviceFAQsList = action.payload?.serviceFAQs;
      state.total = action.payload?.total_ServiceFAQs;
      state.isLoading = false;
    },
    [serviceFAQsDetails.fulfilled]: (state, action) => {
      state.serviceFAQsDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = serviceFAQsSlice.actions;

export default serviceFAQsSlice.reducer;
