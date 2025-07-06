import { configureStore } from '@reduxjs/toolkit';

import app from './reducers/app';
import modal from './reducers/modal';
import sidebar from './reducers/sidebar';

export const store = configureStore({
  reducer: {
    app,
    modal,
    sidebar
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;