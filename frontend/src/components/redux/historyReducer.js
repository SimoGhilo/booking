import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  previousPage: null,
  searchTerm: null
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setPreviousPage: (state, action) => {
      state.previousPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setPreviousPage, setSearchTerm } = historySlice.actions;
export default historySlice.reducer;
