import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './historyReducer';

const store = configureStore({
  reducer: {
    history: historyReducer,
  },
});

export default store;
