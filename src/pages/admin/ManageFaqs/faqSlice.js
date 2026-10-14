import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDataInUrl,
  getData,
  getDataForDetails,
  postRawData,
} from "../../../services/httphandler";

const initialState = {
  isLoading: false,
  faqs: "",
  faqDetails: "",
  total: 0,
};

export const faq = (state) => state.faq.faqs;
export const totalFaq = (state) => state.faq.total;

export const AddFaqs = createAsyncThunk(
  "faqs/add",
  async (params, { dispatch }) => {
    let response = await postRawData("admin/faqs", params);

    if (response && response.code === 1) {
      dispatch(getFaqs());
    }
    return response;
  }
);

export const UpdateFaq = createAsyncThunk(
  "faq/update",
  async (object, { dispatch }) => {
    let response = await postRawData("admin/faqs", object);
    if (response && response.code === 1) {
      dispatch(getFaqs());
    }
    return response;
  }
);

export const deleteFaqs = createAsyncThunk(
  "faqs/delete",
  async (object, { dispatch }) => {
    const { id, filters } = object;
    let response = await deleteDataInUrl("admin/faqs", { id });
    if (response && response.code === 1) {
      dispatch(getFaqs(filters));
      return response;
    }
  }
);

export const faqDetails = createAsyncThunk(
  "faq/details",
  async (object, { dispatch }) => {
    let response = await getDataForDetails("admin/faqs", object);
    console.log(response, "Rwa");
    if (response && response.code === 1) {
      dispatch(getFaqs());
      return response.data;
    }
  }
);

export const getFaqs = createAsyncThunk(
  "getFaqs",
  async (
    object = {
      page: 1,
      limit: 10,
      isActive: true,
      search: "",
    }
  ) => {
    let response = await getData("admin/faqs", object);
    if (response && response.code === 1) {
      return response.data;
    }
  }
);

const FaqSlice = createSlice({
  name: "faq",
  initialState,
  extraReducers: {
    [getFaqs.fulfilled]: (state, action) => {
      state.faqs = action.payload.faqs;
      state.total = action.payload.total;
      state.isLoading = false;
    },
  },
});

export default FaqSlice.reducer;
