import React,{useReducer,useEffect,useContext} from "react";
import axios from "axios";
import {config} from "../globalConfig"
import { AuthReducer } from "./reducer/AuthReducer";
import { editable_config } from "src/editable_config";

const initialState = {
    user:null,
    users_customers_count:null,
    announcements_count:null,
    plan_details:null,
    stepper_details:null,
    resubmittion_credit_plan_details:null,
    error:null,
    isAuthenticated:false,
    loading:false
}

// creating global context 
const Global = React.createContext(initialState);
export const UseContextState = ()=>useContext(Global);

function GlobalContext({children}) {
    const [authState , dispatch ] = useReducer(AuthReducer,initialState)

// --===========================

// --===========================


    // getting authenticated user
    const fetchAuthuser = async()=>{
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/user`,{headers: {
            'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
          },withCredentials:true})
        .then(res=>{
            // console.log(res)
            if(res?.data?.status === true){
                dispatch({type:"LOG_IN",payload:res.data?.result})
                // dispatch({type:"USER_CUSTOMERS_COUNT",payload:res.data?.users_customers_count})
            }
            else{
                dispatch({type:"ERROR",payload:res?.data?.message})
            }
            
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:"ERROR",payload:"Not Authenticated"})
        })
    }


    const logoutAuthUser = async()=>{
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/logout`,{headers: {
            'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
        },withCredentials:true})
        .then(res=>{
            console.log(res)
            dispatch({type:"LOG_OUT"})
            // document.getElementById("recaptcha-container").remove();
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:"ERROR",error:err})
        })
        
    }
    


    useEffect(()=>{
        fetchAuthuser();
        // getPlanDetails();
    },[])

    const value = {authState,dispatch,fetchAuthuser,logoutAuthUser}

  return <Global.Provider value={value} >{children}</Global.Provider>
  
  
}

export default GlobalContext

