import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./auth/authReducer";
import { busDetailsReducer } from "./BookBus/reducer";
import { updateFilterDetailsReducer } from "./FilterAndSort/reducer";
import { routesReducer } from "./routes/routesReducer";
import { busServiceReducer } from "./busService/busServicereducer";

const rootReducer = combineReducers({
  authReducer,
  busDetailsReducer,
  updateFilterDetailsReducer,
  routesReducer,
  busServiceReducer,
});

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn("Could not load persisted state:", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({ authReducer: state.authReducer });
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.warn("Could not save state:", err);
  }
};

let composeEnhancers = compose;

if (process.env.NODE_ENV !== "production") {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
}

const enhancer = composeEnhancers(applyMiddleware(thunk));
const persistedState = loadState();

const store = createStore(rootReducer, persistedState, enhancer);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
