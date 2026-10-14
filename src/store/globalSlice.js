import { createSlice } from "@reduxjs/toolkit";
import { postFormData } from "../services/httphandler";

export const UploadFilesHandler = async (params) => {
  let response = await postFormData("admin/uploadfiles", params);
  console.log(response, "Upload file res");
  return response;
};
const globalSlice = createSlice({
  name: "global",
  initialState: {},
  reducers: {},
});

// Extract the action creators object and the reducer
const { actions, reducer } = globalSlice;
// Extract and export each action creator by name
export const { createPost } = actions;
// Export the reducer, either as a default or named export
export default reducer;
