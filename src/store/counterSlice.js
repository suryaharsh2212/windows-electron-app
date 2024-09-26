import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showQr: false,
  connector: '',
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {

    toggleShowQr: (state) => {
      state.showQr = !state.showQr;
    },
    // Set connector value
    setConnector: (state, action) => {
      state.connector = action.payload;
    },
  },
});

// Export the actions
export const { toggleShowQr, setConnector } = counterSlice.actions;

// Export the reducer to be used in the store
export default counterSlice.reducer;

