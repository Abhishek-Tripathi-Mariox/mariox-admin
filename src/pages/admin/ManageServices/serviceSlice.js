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
  specializationList: [],
  specializationDetails: null,
  total: 0,
  filters: localStorage.getItem("filters")
    ? JSON.parse(localStorage.getItem("filters"))
    : {
        page: 1,
        limit: 10,
        isActive: true,
        search: "",
        startDate: "",
        endDate: "",
      },
};

export const addSpecialization = createAsyncThunk(
  "specialization/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/specialization", params);
    if (response && response.code === 1) {
      dispatch(specializationList());
      return response;
    }
  }
);

export const updateSpecialization = createAsyncThunk(
  "updateSpecialization",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/specialization", object);
    if (response && response.code === 1) {
      dispatch(specializationList());
      return response;
    }
  }
);

export const toggleSpecialization = createAsyncThunk(
  "toggleSpecialization",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    console.log(object, "object");
    let response = await patchEncodedInUrl("admin/specialization", { id });
    if (response && response.code === 1) {
      dispatch(specializationList(filters));
      return response;
    }
  }
);

export const deleteSpecialization = createAsyncThunk(
  "specialization/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/specialization", { id });
    if (response && response.code === 1) {
      dispatch(specializationList(filters));
      return response;
    }
  }
);

export const specializationDetails = createAsyncThunk(
  "specialization/id",
  async (object) => {
    let response = await getDataForDetails("admin/specialization", object);
    if (response && response.code === 1) {
      // dispatch(specializationList());
      return response.data;
    }
  }
);

export const specializationList = createAsyncThunk(
  "specializationList",
  async (object) => {
    let response = await getData("admin/specialization", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const specializationSlice = createSlice({
  name: "specialization",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: {
    [addSpecialization.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [specializationList.fulfilled]: (state, action) => {
      state.specializationList = action.payload?.countries;
      state.total = action.payload?.total_Specialization;
      state.isLoading = false;
    },
    [specializationDetails.fulfilled]: (state, action) => {
      state.specializationDetails = action.payload;
      state.isLoading = false;
    },
  },
});
export const { storeFilters } = specializationSlice.actions;

export default specializationSlice.reducer;
