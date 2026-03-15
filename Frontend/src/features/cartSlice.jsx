import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        CartProduct:[]
    },
    reducers: {
        addcartRedux: (state,action) => {
            state.CartProduct = action.payload
        }
    }
})
export const { addcartRedux } = cartSlice.actions;
export default cartSlice.reducer;