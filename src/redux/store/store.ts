import { configureStore } from '@reduxjs/toolkit';
import userDataReducer from '../user/userDataReducer'; 
import customerChildReducer from '../customer/customerChildReducer';
const store = configureStore({
  reducer: {
    userData: userDataReducer,
    customerChildData: customerChildReducer,
  },
});

export default store;
