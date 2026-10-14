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
  serviceCityImageList: [],
  serviceCityImageDetail: null,
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
    return await postFormDataWithToken("admin/service-city-images", formData);
  }
);

export const updateServiceImage = createAsyncThunk(
  "serviceImage/update",
  async ({ id, formData }) => {
    return await putFormDataFile(`admin/service-city-images/${id}`, formData);
  }
);

export const serviceCityImageList = createAsyncThunk(
  "serviceImage/list",
  async (object) => {
    let response = await getData("admin/service-city-images", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

export const serviceCityImageDetail = createAsyncThunk(
  "serviceImage/details",
  async ({ id }) => {
    return await getDataForDetails("admin/service-city-images", { id });
  }
);

export const deleteServiceImage = createAsyncThunk(
  "serviceImage/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/service-city-images", { id });
    if (response && response.code === 1) {
      dispatch(serviceCityImageList(filters));
      return response;
    }
  }
);

export const toggleServiceImage = createAsyncThunk(
  "serviceImage/toggle",
  async ({ id }) => {
    return await patchEncodedInUrl(`admin/service-city-images/${id}`);
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
    [serviceCityImageList.fulfilled]: (state, action) => {
      state.serviceCityImageList = action.payload?.ServiceCitiesImage;
      state.total = action.payload?.total_ServiceCitiesImage;
      state.isLoading = false;
    },
    [serviceCityImageDetail.fulfilled]: (state, action) => {
      state.serviceCityImageDetail = action.payload;
      state.isLoading = false;
    },
  },
});

export const { storeFilters } = serviceImageSlice.actions;
export default serviceImageSlice.reducer;
