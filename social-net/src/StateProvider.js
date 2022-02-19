import React,{Children, createContext,useContext,useReducer} from "React";
import "./index.js"
import {actionTypes} from "./reducer";

export const StateContext=createContext();

export const StateProvider=({reducer,initialState,children}) => (
    <StateContext value ={useReducer (reducer,initialState),actionTypes}>
        {Children}

    </StateContext>


)

export const useStateValue =()=> useContext
(StateContext);