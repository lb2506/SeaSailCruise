import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
  users: [],
  status: null,
  deleteStatus: null,
  createStatus: null,
};

export const usersFetch = createAsyncThunk("users/usersFetch", async () => {
  try {
    const response = await axios.get(`${url}/users`, setHeaders());
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const userDelete = createAsyncThunk("users/userDelete", async (id) => {
  try {
    const response = await axios.delete(`${url}/users/${id}`, setHeaders());

    return response.data;
  } catch (error) {
    console.log(error.response.data);
    toast.error(error.response?.data, {
      position: "bottom-left",
    });
  }
});

export const ownersCreate = createAsyncThunk("users/ownersCreate", async (data) => {
  try {
    const response = await axios.post(`${url}/users`, data, setHeaders());
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    toast.error(error.response?.data, {
      position: "bottom-left",
    });
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [usersFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [usersFetch.fulfilled]: (state, action) => {
      state.users = action.payload;
      state.status = "success";
    },
    [usersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [userDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [userDelete.fulfilled]: (state, action) => {
      const newList = state.users.filter(
        (user) => user._id !== action.payload._id
      );
      state.users = newList;
      state.deleteStatus = "success";
      toast.error("Utilisateur supprimé !", {
        position: "bottom-left",
      });
    },
    [userDelete.rejected]: (state, action) => {
      state.deleteStatus = "rejected";
    },
    [ownersCreate.pending]: (state, action) => {
      state.createStatus = "pending";
    },
    [ownersCreate.fulfilled]: (state, action) => {
      state.users.push(action.payload);
      state.createStatus = "success";
    },
    [ownersCreate.rejected]: (state, action) => {
      state.createStatus = "rejected";
    }
  },
});

export default usersSlice.reducer;
