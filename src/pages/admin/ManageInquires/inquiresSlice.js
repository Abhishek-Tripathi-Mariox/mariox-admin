// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   deleteDataInUrl,
//   getData,
//   getDataForDetails,
//   patchEncodedInUrl,
//   postRawData,
// } from "../../../services/httphandler";

// const initialState = {
//   isLoading: false,
//   inquiresList: [],
//   inquiresDetails: null,
//   total: 0,
//   filters: localStorage.getItem("filters")
//     ? JSON.parse(localStorage.getItem("filters"))
//     : {
//         page: 1,
//         limit: 10,
//         isActive: true,
//         search: "",
//         startDate: "",
//         endDate: "",
//         campaignId: "",
//       },
// };

// export const fetchCampaignIds = createAsyncThunk(
//   "inquires/campaignIds",
//   async (_, { rejectWithValue }) => {
//     try {
//       // your endpoint: GET admin/getUniqueCampaignIds
//       const res = await getData("admin/getUniqueCampaignIds");
//       if (res && res.code === 1) return res.data || [];
//       return rejectWithValue({
//         message: res?.message || "Failed to load campaign IDs",
//       });
//     } catch (err) {
//       return rejectWithValue({ message: "Network error" });
//     }
//   }
// );

// export const addInquires = createAsyncThunk(
//   "inquires/add",
//   async (params, { dispatch }) => {
//     let response = await postRawData("admin/inquires", params);
//     if (response && response.code === 1) {
//       dispatch(inquiresList());
//       return response;
//     }
//   }
// );

// export const updateInquires = createAsyncThunk(
//   "updateInquires",
//   async (object, { dispatch }) => {
//     let response = await postRawData("admin/inquires", object);
//     if (response && response.code === 1) {
//       dispatch(inquiresList());
//       return response;
//     }
//   }
// );

// export const toggleInquires = createAsyncThunk(
//   "toggleInquires",
//   async (object, { dispatch }) => {
//     const { id, filters } = object;
//     console.log(object, "object");
//     let response = await patchEncodedInUrl("admin/inquires", { id });
//     if (response && response.code === 1) {
//       dispatch(inquiresList(filters));
//       return response;
//     }
//   }
// );

// export const deleteInquires = createAsyncThunk(
//   "Inquires/delete",
//   async (object, { dispatch }) => {
//     const { id, filters } = object;
//     let response = await deleteDataInUrl("admin/inquires", { id });
//     if (response && response.code === 1) {
//       dispatch(inquiresList(filters));
//       return response;
//     }
//   }
// );

// export const inquiresDetails = createAsyncThunk(
//   "inquires/id",
//   async (object) => {
//     let response = await getDataForDetails("admin/inquires", object);
//     if (response && response.code === 1) {
//       // dispatch(inquiresList());
//       return response.data;
//     }
//   }
// );

// export const inquiresList = createAsyncThunk("inquiresList", async (object) => {
//   let response = await getData("admin/inquires", object);
//   if (response && response.code === 1) {
//     return response.data;
//   }
// });

// const inquiresSlice = createSlice({
//   name: "inquires",
//   initialState,
//   reducers: {
//     storeFilters: (state, action) => {
//       state.filters = action.payload;
//     },
//   },
//   extraReducers: {
//     [addInquires.fulfilled]: (state) => {
//       state.isLoading = false;
//     },
//     [inquiresList.fulfilled]: (state, action) => {
//       state.inquiresList = action.payload?.inquires;
//       state.total = action.payload?.total_Inquire;
//       state.isLoading = false;
//     },
//     [inquiresDetails.fulfilled]: (state, action) => {
//       state.inquiresDetails = action.payload;
//       state.isLoading = false;
//     },
//     [fetchCampaignIds.pending]: (state) => {
//       state.campaignIdsLoading = true;
//       state.campaignIdsError = null;
//     },
//     [fetchCampaignIds.fulfilled]: (state, action) => {
//       state.campaignIdsLoading = false;
//       // sort for nicer UX (string sort; change if numeric)
//       state.campaignIds = (action.payload || []).sort();
//     },
//     [fetchCampaignIds.rejected]: (state, action) => {
//       state.campaignIdsLoading = false;
//       state.campaignIdsError =
//         action.payload?.message || "Failed to load campaign IDs";
//     },
//   },
// });
// export const { storeFilters } = inquiresSlice.actions;

// export default inquiresSlice.reducer;

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
  error: null,

  inquiresList: [],
  inquiresDetails: null,
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
        campaignId: "", // 👈 include in persisted filters
      },

  // 👇 add these (you were using them but not initializing)
  campaignIds: [],
  campaignIdsLoading: false,
  campaignIdsError: null,
};

// ---------------- Thunks ----------------

export const fetchCampaignIds = createAsyncThunk(
  "inquires/campaignIds",
  async (_, { rejectWithValue }) => {
    try {
      // add cache-buster to avoid 304 body-less responses from some clients
      const res = await getData("admin/getUniqueCampaignIds", {
        _ts: Date.now(),
      });

      if (res?.code === 1) {
        // API shape: { code, message, data: { inquires: [...] } }
        const raw = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.inquires)
          ? res.data.inquires
          : [];

        // sanitize & normalize
        const ids = raw
          .filter(Boolean)
          .map(String)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        return ids;
      }
      return rejectWithValue({
        message: res?.message || "Failed to load campaign IDs",
      });
    } catch (err) {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const addInquires = createAsyncThunk(
  "inquires/add",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await postRawData("admin/inquires", params);
      if (response && response.code === 1) {
        dispatch(inquiresList());
        return response;
      }
      return rejectWithValue({ message: response?.message || "Add failed" });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const updateInquires = createAsyncThunk(
  "updateInquires",
  async (object, { dispatch, rejectWithValue }) => {
    try {
      const response = await postRawData("admin/inquires", object);
      if (response && response.code === 1) {
        dispatch(inquiresList());
        return response;
      }
      return rejectWithValue({ message: response?.message || "Update failed" });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const toggleInquires = createAsyncThunk(
  "toggleInquires",
  async (object, { dispatch, rejectWithValue }) => {
    try {
      const { id, filters } = object;
      const response = await patchEncodedInUrl("admin/inquires", { id });
      if (response && response.code === 1) {
        dispatch(inquiresList(filters));
        return response;
      }
      return rejectWithValue({ message: response?.message || "Toggle failed" });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const deleteInquires = createAsyncThunk(
  "Inquires/delete",
  async (object, { dispatch, rejectWithValue }) => {
    try {
      const { id, filters } = object;
      const response = await deleteDataInUrl("admin/inquires", { id });
      if (response && response.code === 1) {
        dispatch(inquiresList(filters));
        return response;
      }
      return rejectWithValue({ message: response?.message || "Delete failed" });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const inquiresDetails = createAsyncThunk(
  "inquires/id",
  async (object, { rejectWithValue }) => {
    try {
      const response = await getDataForDetails("admin/inquires", object);
      if (response && response.code === 1) return response.data;
      return rejectWithValue({
        message: response?.message || "Details failed",
      });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

// 🔥 Normalize any API shape → { list, total }
export const inquiresList = createAsyncThunk(
  "inquiresList",
  async (object, { rejectWithValue }) => {
    try {
      // Ensure correct key casing — UI sends { campaignId }, backend should read req.query.campaignId
      const response = await getData("admin/inquires", object);

      if (response && response.code === 1) {
        const payload = response.data;

        // Common server shapes handled here:
        // A) { data: { inquires, total_Inquire } }
        // B) { data: { data: [], total } }
        // C) { data: [], total }
        // D) { inquires: [], total_Inquire }

        const list =
          (payload && payload.inquires) ||
          (payload &&
            payload.data &&
            Array.isArray(payload.data) &&
            payload.data) ||
          (Array.isArray(payload) ? payload : []) ||
          [];

        const total =
          (payload &&
            typeof payload.total_Inquire === "number" &&
            payload.total_Inquire) ||
          (payload && typeof payload.total === "number" && payload.total) ||
          (typeof response.total === "number" ? response.total : 0);

        // Debug (temporary): uncomment if needed
        // console.log("Normalized list/total:", { list, total }, "raw:", response);

        return { list, total };
      }
      return rejectWithValue({
        message: response?.message || "Failed to load",
      });
    } catch {
      return rejectWithValue({ message: "Network error" });
    }
  }
);

// ---------------- Slice ----------------

const inquiresSlice = createSlice({
  name: "inquires",
  initialState,
  reducers: {
    storeFilters: (state, action) => {
      state.filters = action.payload;
      localStorage.setItem("filters", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    // list
    builder
      .addCase(inquiresList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(inquiresList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiresList = action.payload?.list || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(inquiresList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load";
        state.inquiresList = [];
        state.total = 0;
      });

    // details
    builder
      .addCase(inquiresDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(inquiresDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiresDetails = action.payload;
      })
      .addCase(inquiresDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load details";
      });

    // add / update / toggle / delete — just clear loading on settle
    builder
      .addCase(addInquires.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(addInquires.fulfilled, (s) => {
        s.isLoading = false;
      })
      .addCase(addInquires.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload?.message || "Add failed";
      })

      .addCase(updateInquires.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(updateInquires.fulfilled, (s) => {
        s.isLoading = false;
      })
      .addCase(updateInquires.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload?.message || "Update failed";
      })

      .addCase(toggleInquires.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(toggleInquires.fulfilled, (s) => {
        s.isLoading = false;
      })
      .addCase(toggleInquires.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload?.message || "Toggle failed";
      })

      .addCase(deleteInquires.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(deleteInquires.fulfilled, (s) => {
        s.isLoading = false;
      })
      .addCase(deleteInquires.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload?.message || "Delete failed";
      });

    // campaignIds
    builder
      .addCase(fetchCampaignIds.pending, (state) => {
        state.campaignIdsLoading = true;
        state.campaignIdsError = null;
      })
      .addCase(fetchCampaignIds.fulfilled, (state, action) => {
        state.campaignIdsLoading = false;
        state.campaignIds = (action.payload || []).sort(); // string sort; change if numeric
      })
      .addCase(fetchCampaignIds.rejected, (state, action) => {
        state.campaignIdsLoading = false;
        state.campaignIdsError =
          action.payload?.message || "Failed to load campaign IDs";
      });
  },
});

export const { storeFilters } = inquiresSlice.actions;
export default inquiresSlice.reducer;
