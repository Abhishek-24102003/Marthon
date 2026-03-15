import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isloading: true,
        allProducts:[]
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
        },
        removerUser: (state) => {
            state.user= null
        },
        setIsloading: (state) => {
            state.isloading = false;
        },
        setAllproducts: (state, action) => {
            state.allProducts = action.payload
        }
    }
})
export const { addUser, removerUser, setIsloading, setAllproducts } = authSlice.actions;
export default authSlice.reducer;