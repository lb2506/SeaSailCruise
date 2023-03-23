import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url, setHeaders } from './api';
import { toast } from 'react-toastify';

const initialState = {
    contracts: [],
    status: null,
    createStatus: null,
    editStatus: null,
    deleteStatus: null,
};

export const contractsCreate = createAsyncThunk(
    'contracts/contractsCreate',
    async (value) => {
        try {
            const response = await axios.post(`${url}/contracts`, value, setHeaders());
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
)

export const contractsFetch = createAsyncThunk(
    "contracts/contracts",
    async () => {
        try {
            const response = await axios.get(`${url}/contracts`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const contractsEdit = createAsyncThunk(
    "contracts/contractsEdit",
    async (values) => {
        try {
            const response = await axios.put(
                `${url}/contracts/`,
                values,
                setHeaders()
            );

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const contractsDelete = createAsyncThunk(
    "contracts/contractsDelete",
    async (value) => {

        try {
            const response = await axios.delete(
                `${url}/contracts/${value.id}`,
                setHeaders()
            );

            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
);

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {},
    extraReducers: {
        [contractsFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [contractsFetch.fulfilled]: (state, action) => {
            state.contracts = action.payload;
            state.status = "success";
        },
        [contractsFetch.rejected]: (state, action) => {
            state.status = "rejected";
        },
        [contractsCreate.pending]: (state, action) => {
            state.createStatus = 'pending';
        },
        [contractsCreate.fulfilled]: (state, action) => {
            state.contracts.push(action.payload);
            state.createStatus = 'success';
            toast.success('Nouveau contrat enregistré', { position: 'bottom-left' });
        },
        [contractsCreate.rejected]: (state, action) => {
            state.createStatus = 'rejected';
        },
        [contractsEdit.pending]: (state, action) => {
            state.editStatus = 'pending';
        },
        [contractsEdit.fulfilled]: (state, action) => {
            const newContracts = state.contracts.map((contract) => {
                if (contract._id === action.payload._id) {
                    return action.payload;
                } else {
                    return contract;
                }
            }
            );
            state.contracts = newContracts;
            state.editStatus = 'success';
            toast.success('Contrat mis à jour', { position: 'bottom-left' });
        },
        [contractsEdit.rejected]: (state, action) => {
            state.editStatus = 'rejected';
        },
        [contractsDelete.pending]: (state, action) => {
            state.deleteStatus = 'pending';
        },
        [contractsDelete.fulfilled]: (state, action) => {
            const newContracts = state.contracts.filter((contract) => contract._id !== action.payload._id);
            state.contracts = newContracts;
            state.deleteStatus = 'success';
        },
        [contractsDelete.rejected]: (state, action) => {
            state.deleteStatus = 'rejected';
        }
    },
});

export default contractsSlice.reducer;