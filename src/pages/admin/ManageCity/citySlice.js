import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDataInUrl,
  downloadFile,
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  postFormDataWithToken,
  postRawData,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  cityList: [],
  cityDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        citiesId: "",
        countryId: "",
        startDate: "",
        endDate: "",
      },
};

export const addCity = createAsyncThunk(
  "cities/add",
  async (params, { dispatch }) => {
    let response = await postFormDataWithToken("admin/cities", params);
    if (response && response.code === 1) {
      dispatch(cityList());
      return response;
    }
  }
);

export const updateCity = createAsyncThunk(
  "updateCity",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/cities", object);
    if (response && response.code === 1) {
      dispatch(cityList());
      return response;
    }
  }
);

export const toggleCity = createAsyncThunk(
  "toggleCity",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/cities", { id });
    if (response && response.code === 1) {
      dispatch(cityList(filters));
      return response;
    }
  }
);

export const deleteCity = createAsyncThunk(
  "City/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/cities", { id });
    if (response && response.code === 1) {
      dispatch(cityList(filters));
      return response;
    }
  }
);

export const cityDetails = createAsyncThunk("city/id", async (object) => {
  let response = await getDataForDetails("admin/cities", object);
  if (response && response.code === 1) {
    // dispatch(cityList());
    return response.data;
  }
});

export const cityList = createAsyncThunk("cityList", async (object) => {
  let response = await getData("admin/cities", object);
  if (response && response.code === 1) {
    return response.data;
  }
});

// ✅ Upload Excel and get city list
export const fetchCitiesFromExcelFile = createAsyncThunk(
  "cities/fetchCitiesFromExcelFile",
  async (formData) => {
    const response = await postFormDataWithToken(
      "admin/cities/list",
      formData,
      true
    ); // 'true' indicates multipart/form-data
    return response?.data || [];
  }
);

export const downloadCityList = createAsyncThunk(
  "downloadCityList",
  async (filters) => {
    await downloadFile("admin/cities/download", filters, "cities.xlsx");
    return true;
  }
);

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addCity.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [cityList.fulfilled]: (state, action) => {
      state.cityList = action.payload?.countries;
      state.total = action.payload?.total_City;
      state.isLoading = false;
    },
    [cityDetails.fulfilled]: (state, action) => {
      state.cityDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = citySlice.actions;

export default citySlice.reducer;
