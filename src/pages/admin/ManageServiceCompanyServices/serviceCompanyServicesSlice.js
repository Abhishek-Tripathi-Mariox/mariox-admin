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
  serviceCompanyServicesList: [],
  serviceCompanyServicesDetails: null,
  total: 0,
  filters: localStorage.getItem("serviceCompanyServicesFilters")
    ? JSON.parse(localStorage.getItem("serviceCompanyServicesFilters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      },
};

// ✅ ADD / UPDATE Service Company Services
export const addServiceCompanyServices = createAsyncThunk(
  "serviceCompanyServices/add",
  async (params, { dispatch }) => {
    const response = await postRawData(
      "admin/service-company-services",
      params
    );
    if (response?.code === 1) {
      dispatch(serviceCompanyServicesList());
      return response;
    }
  }
);

// ✅ GET ALL (List)
export const serviceCompanyServicesList = createAsyncThunk(
  "serviceCompanyServices/list",
  async (object) => {
    const response = await getData("admin/service-company-services", object);
    if (response?.code === 1) {
      return response.data;
    }
  }
);

// ✅ GET DETAILS BY ID
export const serviceCompanyServicesDetails = createAsyncThunk(
  "serviceCompanyServices/details",
  async (object) => {
    const response = await getDataForDetails(
      "admin/service-company-services",
      object
    );
    if (response?.code === 1) {
      return response.data;
    }
  }
);

// ✅ TOGGLE STATUS (Active/Inactive)
export const toggleServiceCompanyServices = createAsyncThunk(
  "serviceCompanyServices/toggle",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    const response = await patchEncodedInUrl("admin/service-company-services", {
      id,
    });
    if (response?.code === 1) {
      dispatch(serviceCompanyServicesList(filters));
      return response;
    }
  }
);

// ✅ DELETE SINGLE
export const deleteServiceCompanyServices = createAsyncThunk(
  "serviceCompanyServices/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    const response = await deleteDataInUrl("admin/service-company-services", {
      id,
    });
    if (response?.code === 1) {
      dispatch(serviceCompanyServicesList(filters));
      return response;
    }
  }
);

// ✅ BULK DELETE
export const deleteMultipleServiceCompanyServices = createAsyncThunk(
  "serviceCompanyServices/bulkDelete",
  async ({ ids, filters }, { dispatch }) => {
    const response = await postRawData(
      "admin/service-company-services/bulk-delete",
      { ids }
    );
    if (response?.code === 1) {
      dispatch(serviceCompanyServicesList(filters));
      return response;
    }
  }
);

const serviceCompanyServicesSlice = createSlice({
  name: "serviceCompanyServices",
  initialState,
  reducers: {
    storeCompanyServicesFilters: (state, action) => {
      state.filters = action.payload;
      localStorage.setItem(
        "serviceCompanyServicesFilters",
        JSON.stringify(action.payload)
      );
    },
    clearCompanyServicesFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      };
      localStorage.removeItem("serviceCompanyServicesFilters");
    },
  },
  extraReducers: {
    [addServiceCompanyServices.pending]: (state) => {
      state.isLoading = true;
    },
    [addServiceCompanyServices.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [addServiceCompanyServices.rejected]: (state) => {
      state.isLoading = false;
    },

    [serviceCompanyServicesList.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceCompanyServicesList.fulfilled]: (state, action) => {
      state.serviceCompanyServicesList =
        action.payload?.ServiceCompanyServices || [];
      state.total = action.payload?.total_ServiceCompanyServices || 0;
      state.isLoading = false;
    },
    [serviceCompanyServicesList.rejected]: (state) => {
      state.isLoading = false;
    },

    [serviceCompanyServicesDetails.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceCompanyServicesDetails.fulfilled]: (state, action) => {
      state.serviceCompanyServicesDetails = action.payload;
      state.isLoading = false;
    },
    [serviceCompanyServicesDetails.rejected]: (state) => {
      state.isLoading = false;
    },

    [toggleServiceCompanyServices.pending]: (state) => {
      state.isLoading = true;
    },
    [toggleServiceCompanyServices.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [toggleServiceCompanyServices.rejected]: (state) => {
      state.isLoading = false;
    },

    [deleteServiceCompanyServices.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteServiceCompanyServices.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [deleteServiceCompanyServices.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { storeCompanyServicesFilters, clearCompanyServicesFilters } =
  serviceCompanyServicesSlice.actions;

export default serviceCompanyServicesSlice.reducer;
