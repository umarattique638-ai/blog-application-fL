import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice.js";
import userReducer from "../feature/userSlice.js";
import categoryReducer from "../feature/catigorySlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  catigory: categoryReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["auth"], // Only persist auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable to avoid redux-persist warnings
    }),
});

export const persistor = persistStore(store);
