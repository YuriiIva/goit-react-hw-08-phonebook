import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import contactsReducer from "./contacts/contactsSlice";
import authSliceReducer from "./auth/authSlice";

const persistContactsConfig = {
  key: "items",
  storage,
  whitelist: ["items"],
  blacklist: ["filter"],
};
const persistAuthConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
  timestamp: false,
});

const store = configureStore({
  reducer: {
    auth: persistReducer(persistAuthConfig, authSliceReducer),
    contacts: persistReducer(persistContactsConfig, contactsReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
  // preloadedState,
  // enhancers: [reduxBatch],
});

const persistor = persistStore(store);

export { persistor, store };
