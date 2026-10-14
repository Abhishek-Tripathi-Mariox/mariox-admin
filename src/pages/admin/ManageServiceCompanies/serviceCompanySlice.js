import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  postRawData,
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  deleteDataInUrl,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  serviceCompanyList: [],
  serviceCompanyDetails: null,
  total: 0,
  filters: {
    page: 1,
    limit: 10,
    isActive: true,
    search: "",
  },
};

export const addServiceCompany = createAsyncThunk(
  "serviceCompany/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/service-company", params);
    if (response && response.code === 1) {
      dispatch(serviceCompanyList());
      return response;
    }
  }
);

export const updateServiceCompany = createAsyncThunk(
  "serviceCompany/update",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/service-company", object);
    if (response && response.code === 1) {
      dispatch(serviceCompanyList());
      return response;
    }
  }
);

export const toggleServiceCompany = createAsyncThunk(
  "serviceCompany/toggle",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await patchEncodedInUrl("admin/service-company", { id });
    if (response && response.code === 1) {
      dispatch(serviceCompanyList(filters));
      return response;
    }
  }
);

export const deleteServiceCompany = createAsyncThunk(
  "serviceCompany/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/service-company", { id });
    if (response && response.code === 1) {
      dispatch(serviceCompanyList(filters));
      return response;
    }
  }
);

export const serviceCompanyDetails = createAsyncThunk(
  "serviceCompany/details",
  async (object) => {
    let response = await getDataForDetails("admin/service-company", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

export const serviceCompanyList = createAsyncThunk(
  "serviceCompany/list",
  async (object) => {
    let response = await getData("admin/service-company", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const serviceCompanySlice = createSlice({
  name: "serviceCompany",
  initialState,
  reducers: {
    storeCompanyFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addServiceCompany.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [serviceCompanyList.fulfilled]: (state, action) => {
      state.serviceCompanyList = action.payload?.ServiceCompany;
      state.total = action.payload?.total_ServiceCompany;
      state.isLoading = false;
    },
    [serviceCompanyDetails.fulfilled]: (state, action) => {
      state.serviceCompanyDetails = action.payload;
      state.isLoading = false;
    },
  },
});

export const { storeCompanyFilters } = serviceCompanySlice.actions;
export default serviceCompanySlice.reducer;
