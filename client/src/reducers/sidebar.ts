import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the sidebar state interface
export interface SidebarState {
  collapsed: boolean;
}

// Define action payload interface
interface SetCollapsePayload {
  collapsed: boolean;
}

const initialState: SidebarState = {
  collapsed: true,
};

const sidebar = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setCollapse: (state, action: PayloadAction<SetCollapsePayload>) => {
      state.collapsed = action.payload.collapsed;
    }
  }
});

export const { setCollapse } = sidebar.actions;

export default sidebar.reducer;