import { combineReducers } from "redux";
import { usersReducer } from "./users/reducer";

export const rootReducer = combineReducers({ usersReducer });
