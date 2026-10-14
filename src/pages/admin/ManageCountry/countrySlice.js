import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDataInUrl,
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  postFormDataWithToken,
  postRawData,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  countryList: [],
  countryDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        categoryId: "",
        subCategoryId: "",
        startDate: "",
        endDate: "",
      },
};

export const addCountry = createAsyncThunk(
  "category/add",
  async (params, { dispatch }) => {
    let response = await postFormDataWithToken("admin/countries", params);
    if (response && response.code === 1) {
      dispatch(countryList());
      return response;
    }
  }
);

export const updateCountry = createAsyncThunk(
  "updateCountry",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/countries", object);
    if (response && response.code === 1) {
      dispatch(countryList());
      return response;
    }
  }
);

export const toggleCountry = createAsyncThunk(
  "toggleCountry",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/countries", { id });
    if (response && response.code === 1) {
      dispatch(countryList(filters));
      return response;
    }
  }
);

export const deleteCountry = createAsyncThunk(
  "Country/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/countries", { id });
    if (response && response.code === 1) {
      dispatch(countryList(filters));
      return response;
    }
  }
);

export const countryDetails = createAsyncThunk("country/id", async (object) => {
  let response = await getDataForDetails("admin/countries", object);
  if (response && response.code === 1) {
    // dispatch(countryList());
    return response.data;
  }
});

export const countryList = createAsyncThunk("countryList", async (object) => {
  let response = await getData("admin/countries", object);
  if (response && response.code === 1) {
    return response.data;
  }
});

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addCountry.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [countryList.fulfilled]: (state, action) => {
      state.countryList = action.payload?.countries;
      state.total = action.payload?.total_Country;
      state.isLoading = false;
    },
    [countryDetails.fulfilled]: (state, action) => {
      state.countryDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = countrySlice.actions;

export default countrySlice.reducer;
