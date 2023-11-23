import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChildData {
  child_first_name: string;
  child_last_name: string;
  parent_full_name: string;
  child_birth_date_child: string;
  child_gender_child: string;
}

interface CustomerChildDataState {
  childrenSubmitted: {
    last_name: string;
    first_name: string;
    number: string;
    children: ChildData[] | null;
  }[];
}

const initialState: CustomerChildDataState = {
  childrenSubmitted: [],
};

const customerChildDataSlice = createSlice({
  name: "customerChildData",
  initialState,
  reducers: {
    setCustomerChildData: (
      state,
      action: PayloadAction<{ last_name: string; first_name: string; number: string; children: ChildData[] }>
    ) => {
      const updatedChildrenSubmitted = [action.payload];
      return { ...state, childrenSubmitted: updatedChildrenSubmitted, childrenTable: action.payload?.children };
    },
  },
});

export const { setCustomerChildData } = customerChildDataSlice.actions;

export default customerChildDataSlice.reducer;
