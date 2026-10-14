import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getData,
  getDataForDetails,
  patchEncodedInUrl,
  deleteDataInUrl,
  postFormDataWithToken,
  // putFormData,
  putFormDataFile,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  serviceImageList: [],
  serviceImageDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
      },
};

export const addServiceImage = createAsyncThunk(
  "serviceImage/add",
  async (formData) => {
    return await postFormDataWithToken("admin/service-images", formData);
  }
);

export const updateServiceImage = createAsyncThunk(
  "serviceImage/update",
  async ({ id, formData }) => {
    return await putFormDataFile(`admin/service-images/${id}`, formData);
  }
);

export const serviceImageList = createAsyncThunk(
  "serviceImage/list",
  async (object) => {
    let response = await getData("admin/service-images", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

export const serviceImageDetails = createAsyncThunk(
  "serviceImage/details",
  async ({ id }) => {
    return await getDataForDetails("admin/service-images", { id });
  }
);

export const deleteServiceImage = createAsyncThunk(
  "serviceImage/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/service-images", { id });
    if (response && response.code === 1) {
      dispatch(serviceImageList(filters));
      return response;
    }
  }
);

export const toggleServiceImage = createAsyncThunk(
  "serviceImage/toggle",
  async ({ id }) => {
    return await patchEncodedInUrl(`admin/service-images/${id}`);
  }
);

export const fetchServiceContentByServiceId = createAsyncThunk(
  "serviceImage/fetchByServiceId",
  async ({ serviceId, page = 1, limit = 10 }) => {
    // The endpoint paginates server-side and answers with
    // { page, limit, total_ServiceImage, ServiceImage: [...] }.
    const response = await getData("admin/service-images/by-service", {
      serviceId,
      page,
      limit,
    });
    return response?.data || {};
  }
);

export const updateMultipleServiceContent = createAsyncThunk(
  "serviceImage/updateMultiple",
  async (contentList) => {
    const response = await putFormDataFile("admin/service-images/bulk-update", {
      contentList,
    });
    return response;
  }
);

const serviceImageSlice = createSlice({
  name: "serviceImage",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addServiceImage.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [serviceImageList.fulfilled]: (state, action) => {
      state.serviceImageList = action.payload?.ServiceImage;
      state.total = action.payload?.total_ServiceImage;
      state.isLoading = false;
    },
    [serviceImageDetails.fulfilled]: (state, action) => {
      state.serviceImageDetails = action.payload;
      state.isLoading = false;
    },
  },
});

export const { storeFilters } = serviceImageSlice.actions;
export default serviceImageSlice.reducer;
