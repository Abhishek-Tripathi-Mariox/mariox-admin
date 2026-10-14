import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getData,
  postRawData,
  postFormDataWithToken,
  deleteDataInUrl,
  patchEncodedInUrl,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  list: [],
  total: 0,
  filters: localStorage.getItem("serviceCityCompanyFilters")
    ? JSON.parse(localStorage.getItem("serviceCityCompanyFilters"))
    : {
        page: 1,
        limit: 10,
        search: "",
      },
};

// ✅ ADD / UPLOAD — supports both JSON and Multipart Upload (FormData)
export const addServiceCityCompany = createAsyncThunk(
  "serviceCityCompany/add",
  async (params, { dispatch }) => {
    let response;

    // If it's FormData (file upload mode)
    if (params instanceof FormData) {
      response = await postFormDataWithToken(
        "admin/service-city-companies",
        params
      );
    } else {
      // Normal add request
      response = await postRawData("admin/service-city-companies", params);
    }

    if (response?.code === 1) {
      dispatch(getServiceCityCompanyList());
    }
    return response;
  }
);

// ✅ GET LIST with persisted filters
export const getServiceCityCompanyList = createAsyncThunk(
  "serviceCityCompany/list",
  async (filters, { getState }) => {
    const savedFilters = filters || getState().serviceCityCompany.filters || {};

    const response = await getData(
      "admin/service-city-companies",
      savedFilters
    );

    if (response?.code === 1) return response.data;
  }
);

// ✅ TOGGLE ACTIVE STATUS
export const toggleServiceCityCompany = createAsyncThunk(
  "serviceCityCompany/toggle",
  async ({ id, filters }, { dispatch }) => {
    const response = await patchEncodedInUrl("admin/service-city-companies", {
      id,
    });
    if (response?.code === 1) {
      dispatch(getServiceCityCompanyList(filters));
    }
    return response;
  }
);

// ✅ DELETE
export const deleteServiceCityCompany = createAsyncThunk(
  "serviceCityCompany/delete",
  async ({ id, filters }, { dispatch }) => {
    const response = await deleteDataInUrl("admin/service-city-companies", {
      id,
    });
    if (response?.code === 1) {
      dispatch(getServiceCityCompanyList(filters));
    }
    return response;
  }
);

export const deleteMultipleServiceCityCompanies = createAsyncThunk(
  "serviceCityCompany/deleteMultiple",
  async ({ ids, filters }, { dispatch }) => {
    const response = await postRawData(
      "admin/service-city-companies/bulk-delete",
      { ids }
    );
    if (response?.code === 1) {
      dispatch(getServiceCityCompanyList(filters));
    }
    return response;
  }
);

const serviceCityCompaniesSlice = createSlice({
  name: "serviceCityCompany",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
      localStorage.setItem(
        "serviceCityCompanyFilters",
        JSON.stringify(action.payload)
      );
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        search: "",
      };
      localStorage.removeItem("serviceCityCompanyFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServiceCityCompanyList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServiceCityCompanyList.fulfilled, (state, action) => {
        state.list = action.payload?.services || [];
        state.total = action.payload?.total || 0;
        state.isLoading = false;
      })
      .addCase(getServiceCityCompanyList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { storeFilters, clearFilters } = serviceCityCompaniesSlice.actions;
export default serviceCityCompaniesSlice.reducer;
