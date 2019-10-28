import rootReducer from "reducers";
import thunk from "redux-thunk";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import config from "./config";
import { createStore, applyMiddleware, compose } from "redux";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reactReduxFirebase(config), // redux binding for firebase
    reduxFirestore(config) // redux bindings for firestore
  )
);

export default store;
