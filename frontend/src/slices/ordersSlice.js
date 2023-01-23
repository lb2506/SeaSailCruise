import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";


const initialState = {
    list: [],
    status: null,
    createStatus: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
    try {
        const response = await axios.get(`${url}/orders`, setHeaders());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
);



export const ordersCreate = createAsyncThunk("orders/ordersCreate", async (value) => {
    try {
        const response = await axios.post(`${url}/orders`, value, setHeaders());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
)


export const ordersEditStatusOrder = createAsyncThunk("orders/ordersEditStatusOrder", async (values, { getState }) => {
    const state = getState();



    let currentOrder = state.orders.list.filter(
        (order) => order._id === values.id
    );

    const newOrder = {
        ...currentOrder[0],
        order_status: values.order_status,
    };

    try {
        const response = await axios.put(
            `${url}/orders/${values.id}`,
            newOrder,
            setHeaders()
        );

        return response.data;
    } catch (err) {
        console.log(err)
    }
});

export const ordersEditStatusPayment = createAsyncThunk("orders/ordersEditStatusPayment", async (values, { getState }) => {
    const state = getState();

    let currentOrder = state.orders.list.filter(
        (order) => order._id === values.id
    );

    const newOrder = {
        ...currentOrder[0],
        payment_status: values.payment_status,
    };

    try {
        const response = await axios.put(
            `${url}/orders/${values.id}`,
            newOrder,
            setHeaders()
        );

        return response.data;
    } catch (err) {
        console.log(err)
    }
});


const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: {
        [ordersFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [ordersFetch.fulfilled]: (state, action) => {
            state.list = action.payload;
            state.status = "success";
        },
        [ordersFetch.rejected]: (state, action) => {
            state.status = "rejected";
        },
        [ordersCreate.pending]: (state, action) => {
            state.createStatus = "pending";
        },
        [ordersCreate.fulfilled]: (state, action) => {
            state.list.push(action.payload);
            state.createStatus = "success";
            toast.success("Réservation ajoutée !");
        },
        [ordersCreate.rejected]: (state, action) => {
            state.createStatus = "rejected";
        },
        [ordersEditStatusOrder.pending]: (state, action) => {
            state.status = "pending";
        },
        [ordersEditStatusOrder.fulfilled]: (state, action) => {
            const updatedOrders = state.list.map((order) =>
                order._id === action.payload._id ? action.payload : order
            );
            state.list = updatedOrders;
            state.status = "success";
        },
        [ordersEditStatusOrder.rejected]: (state, action) => {
            state.status = "rejected";
        },
        [ordersEditStatusPayment.pending]: (state, action) => {
            state.status = "pending";
        },
        [ordersEditStatusPayment.fulfilled]: (state, action) => {
            const updatedOrders = state.list.map((order) =>
                order._id === action.payload._id ? action.payload : order
            );
            state.list = updatedOrders;
            state.status = "success";
        },
        [ordersEditStatusPayment.rejected]: (state, action) => {
            state.status = "rejected";
        }
    }
})

export default ordersSlice.reducer;