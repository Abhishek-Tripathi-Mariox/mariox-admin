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
  serviceDescriptionList: [],
  serviceDescriptionDetails: null,
  total: 0,
  filters: localStorage.getItem("serviceDescriptionFilters")
    ? JSON.parse(localStorage.getItem("serviceDescriptionFilters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      },
};

export const addServiceDescription = createAsyncThunk(
  "serviceDescription/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/service-description", params);
    if (response && response.code === 1) {
      dispatch(serviceDescriptionList());
      return response;
    }
  }
);

export const updateServiceDescription = createAsyncThunk(
  "updateServiceDescription",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/service-description", object);
    if (response && response.code === 1) {
      dispatch(serviceDescriptionList());
      return response;
    }
  }
);

export const toggleServiceDescription = createAsyncThunk(
  "toggleServiceDescription",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/service-description", { id });
    if (response && response.code === 1) {
      dispatch(serviceDescriptionList(filters));
      return response;
    }
  }
);

export const deleteServiceDescription = createAsyncThunk(
  "ServiceDescription/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/service-description", { id });
    if (response && response.code === 1) {
      dispatch(serviceDescriptionList(filters));
      return response;
    }
  }
);

export const serviceDescriptionDetails = createAsyncThunk(
  "serviceDescription/id",
  async (object) => {
    let response = await getDataForDetails("admin/service-description", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

export const serviceDescriptionList = createAsyncThunk(
  "serviceDescriptionList",
  async (object) => {
    let response = await getData("admin/service-description", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const serviceDescriptionSlice = createSlice({
  name: "serviceDescription",
  initialState,
  reducers: {
    storeDescriptionFilters: (state, action) => {
      state.filters = action.payload;
      localStorage.setItem(
        "serviceDescriptionFilters",
        JSON.stringify(action.payload)
      );
    },
    clearDescriptionFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      };
      localStorage.removeItem("serviceDescriptionFilters");
    },
  },
  extraReducers: {
    [addServiceDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [addServiceDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [addServiceDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [updateServiceDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [updateServiceDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [updateServiceDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [serviceDescriptionList.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceDescriptionList.fulfilled]: (state, action) => {
      state.serviceDescriptionList = action.payload?.ServiceDescription || [];
      state.total = action.payload?.total_ServiceDescription || 0;
      state.isLoading = false;
    },
    [serviceDescriptionList.rejected]: (state) => {
      state.isLoading = false;
    },
    [serviceDescriptionDetails.pending]: (state) => {
      state.isLoading = true;
    },
    [serviceDescriptionDetails.fulfilled]: (state, action) => {
      state.serviceDescriptionDetails = action.payload;
      state.isLoading = false;
    },
    [serviceDescriptionDetails.rejected]: (state) => {
      state.isLoading = false;
    },
    [toggleServiceDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [toggleServiceDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [toggleServiceDescription.rejected]: (state) => {
      state.isLoading = false;
    },
    [deleteServiceDescription.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteServiceDescription.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [deleteServiceDescription.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { storeDescriptionFilters, clearDescriptionFilters } =
  serviceDescriptionSlice.actions;

export default serviceDescriptionSlice.reducer;
