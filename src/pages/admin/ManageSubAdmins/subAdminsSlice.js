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
  subAdminList: [],
  subAdminDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        subAdminId: "",
        subCategoryId: "",
        startDate: "",
        endDate: "",
      },
};

export const addSubAdmin = createAsyncThunk(
  "subAdmin/add",
  async (params, { dispatch }) => {
    let response = await postFormDataWithToken("admin/subAdmins", params);
    if (response && response.code === 1) {
      dispatch(subAdminList());
      return response;
    }
  }
);

export const updateSubAdmin = createAsyncThunk(
  "updateSubAdmin",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/subAdmins", object);
    if (response && response.code === 1) {
      dispatch(subAdminList());
      return response;
    }
  }
);

export const toggleSubAdmin = createAsyncThunk(
  "toggleSubAdmin",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/subAdmins", { id });
    if (response && response.code === 1) {
      dispatch(subAdminList(filters));
      return response;
    }
  }
);

export const deleteSubAdmin = createAsyncThunk(
  "SubAdmin/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/subAdmins", { id });
    if (response && response.code === 1) {
      dispatch(subAdminList(filters));
      return response;
    }
  }
);

export const subAdminDetails = createAsyncThunk(
  "subAdmin/id",
  async (object) => {
    let response = await getDataForDetails("admin/subAdmins", object);
    if (response && response.code === 1) {
      // dispatch(subAdminList());
      return response.data;
    }
  }
);

export const subAdminList = createAsyncThunk("subAdminList", async (object) => {
  let response = await getData("admin/subAdmins", object);
  if (response && response.code === 1) {
    return response.data;
  }
});

const subAdminSlice = createSlice({
  name: "subAdmin",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addSubAdmin.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [subAdminList.fulfilled]: (state, action) => {
      state.subAdminList = action.payload?.subAdmins;
      state.total = action.payload?.total_SubAdmin;
      state.isLoading = false;
    },
    [subAdminDetails.fulfilled]: (state, action) => {
      state.subAdminDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = subAdminSlice.actions;

export default subAdminSlice.reducer;
