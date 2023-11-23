import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDataState {
  id: number | null;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_staff: boolean;
  job: string | null;
  phone_number: string;
}

const initialState: UserDataState = {
  id: null,
  email: '',
  first_name: '',
  last_name: '',
  date_joined: '',
  is_staff: false,
  job: null,
  phone_number: '',
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
