import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define User interface - customize based on your user object structure
export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  // Add other user properties as needed
}

// Define the app state interface
export interface AppState {
  token: string | null;
  user: User | null;
}

// Define action payload interfaces
interface LoginPayload {
  token: string;
  user: User;
}

const initialState: AppState = {
  token: null,
  user: null,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    doLogin: (state, action: PayloadAction<LoginPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    doLogout: (state) => {
      state.token = null;
      state.user = null;
    }
  }
});

export const { doLogin, doLogout } = app.actions;

export default app.reducer;