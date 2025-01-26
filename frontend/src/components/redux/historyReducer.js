import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  previousPage: null,
  searchTerm: null,
  previousDate: null
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
    setPreviousDate: (state, action) => {
      state.previousDate = action.payload;
    }
  },
});

export const { setPreviousPage, setSearchTerm, setPreviousDate } = historySlice.actions;
export default historySlice.reducer;
