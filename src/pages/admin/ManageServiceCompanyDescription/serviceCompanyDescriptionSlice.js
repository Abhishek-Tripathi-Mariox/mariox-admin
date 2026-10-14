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
  serviceCompanyDescriptionList: [],
  serviceCompanyDescriptionDetails: null,
  total: 0,
  filters: localStorage.getItem("serviceCompanyDescriptionFilters")
    ? JSON.parse(localStorage.getItem("serviceCompanyDescriptionFilters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      },
};

export const addServiceCompanyDescription = createAsyncThunk(
  "serviceCompanyDescription/add",
  async (params, { dispatch }) => {
    let response = await postRawData(
      "admin/service-company-description",
      params
    );
    if (response && response.code === 1) {
      dispatch(serviceCompanyDescriptionList());
      return response;
    }
  }
);

export const updateServiceCompanyDescription = createAsyncThunk(
  "updateServiceCompanyDescription",
  async (object, { dispatch }) => {
    let response = await postRawData(
      "admin/service-company-description",
      object
    );
    if (response && response.code === 1) {
      dispatch(serviceCompanyDescriptionList());
      return response;
    }
  }
);

export const toggleServiceCompanyDescription = createAsyncThunk(
  "toggleServiceCompanyDescription",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl(
      "admin/service-company-description",
      { id }
    );
    if (response && response.code === 1) {
      dispatch(serviceCompanyDescriptionList(filters));
      return response;
    }
  }
);

export const deleteServiceCompanyDescription = createAsyncThunk(
  "ServiceCompanyDescription/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/service-company-description", {
      id,
    });
    if (response && response.code === 1) {
      dispatch(serviceCompanyDescriptionList(filters));
      return response;
    }
  }
);

export const serviceCompanyDescriptionDetails = createAsyncThunk(
  "serviceCompanyDescription/id",
  async (object) => {
    let response = await getDataForDetails(
      "admin/service-company-description",
      object
    );
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

export const serviceCompanyDescriptionList = createAsyncThunk(
  "serviceCompanyDescriptionList",
  async (object) => {
    let response = await getData("admin/service-company-description", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const serviceCompanyDescriptionSlice = createSlice({
  name: "serviceCompanyDescription",
  initialState,
  reducers: {
    storeCompanyDescriptionFilters: (state, action) => {
      state.filters = action.payload;
      localStorage.setItem(
        "serviceCompanyDescriptionFilters",
        JSON.stringify(action.payload)
      );
    },
    clearCompanyDescriptionFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      };
      localStorage.removeItem("serviceCompanyDescriptionFilters");
    },
  },
  extraReducers: {
    [addServiceCompanyDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [addServiceCompanyDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [addServiceCompanyDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [updateServiceCompanyDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [updateServiceCompanyDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [updateServiceCompanyDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [serviceCompanyDescriptionList.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceCompanyDescriptionList.fulfilled]: (state, action) => {
      state.serviceCompanyDescriptionList =
        action.payload?.ServiceCompanyDescription || [];
      state.total = action.payload?.total_ServiceCompanyDescription || 0;
      state.isLoading = false;
    },
    [serviceCompanyDescriptionList.rejected]: (state) => {
      state.isLoading = false;
    },
    [serviceCompanyDescriptionDetails.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceCompanyDescriptionDetails.fulfilled]: (state, action) => {
      state.serviceCompanyDescriptionDetails = action.payload;
      state.isLoading = false;
    },
    [serviceCompanyDescriptionDetails.rejected]: (state) => {
      state.isLoading = false;
    },
    [toggleServiceCompanyDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [toggleServiceCompanyDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [toggleServiceCompanyDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [deleteServiceCompanyDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteServiceCompanyDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [deleteServiceCompanyDescription.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  storeCompanyDescriptionFilters,
  clearCompanyDescriptionFilters,
} = serviceCompanyDescriptionSlice.actions;

export default serviceCompanyDescriptionSlice.reducer;
