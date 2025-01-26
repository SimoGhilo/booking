import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  previousPage: null,
  searchTerm: null,
  previousDate: null,
  previousGuests: null,
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
    },
    setPreviousGuests: (state, action) => {
      state.previousGuests = action.payload;
    }
  },
});

export const { setPreviousPage, setSearchTerm, setPreviousDate, setPreviousGuests } = historySlice.actions;
export default historySlice.reducer;
