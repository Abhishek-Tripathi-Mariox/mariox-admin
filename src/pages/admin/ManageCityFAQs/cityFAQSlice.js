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
  cityFAQList: [],
  cityFAQDetails: null,
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

export const addCityFAQs = createAsyncThunk(
  "cityFAQs/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/cityFAQs", params);
    if (response && response.code === 1) {
      dispatch(cityFAQList());
      return response;
    }
  }
);

export const updateCityFAQs = createAsyncThunk(
  "updateCityFAQs",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/cityFAQs", object);
    if (response && response.code === 1) {
      dispatch(cityFAQList());
      return response;
    }
  }
);

export const toggleCityFAQs = createAsyncThunk(
  "toggleCityFAQs",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/cityFAQs", { id });
    if (response && response.code === 1) {
      dispatch(cityFAQList(filters));
      return response;
    }
  }
);

export const deleteCityFAQs = createAsyncThunk(
  "CityFAQs/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/cityFAQs", { id });
    if (response && response.code === 1) {
      dispatch(cityFAQList(filters));
      return response;
    }
  }
);

export const cityFAQDetails = createAsyncThunk("cityFAQ/id", async (object) => {
  let response = await getDataForDetails("admin/cityFAQs", object);
  if (response && response.code === 1) {
    // dispatch(cityFAQList());
    return response.data;
  }
});

export const cityFAQList = createAsyncThunk("cityFAQList", async (object) => {
  let response = await getData("admin/cityFAQs", object);
  if (response && response.code === 1) {
    return response.data;
  }
});

const cityFAQSlice = createSlice({
  name: "cityFAQ",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addCityFAQs.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [cityFAQList.fulfilled]: (state, action) => {
      state.cityFAQList = action.payload?.cityFAQs;
      state.total = action.payload?.total_CityFAQs;
      state.isLoading = false;
    },
    [cityFAQDetails.fulfilled]: (state, action) => {
      state.cityFAQDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = cityFAQSlice.actions;

export default cityFAQSlice.reducer;
