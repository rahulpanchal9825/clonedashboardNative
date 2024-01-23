export const AuthReducer = (state,action)=>{
    switch (action.type) {
        case "LOG_IN":
            return {
                ...state,
                isAuthenticated:true,
                user:action.payload,
                error:false
            }
        case "LOG_OUT":
            return {
                ...state,
                isAuthenticated:false,
                user:null,
                error:false
            }
        case "PLAN_DETAILS":
            return {
                ...state,
                plan_details:action.payload
            }
        case "STEPPER_DETAILS":
            return {
                ...state,
                stepper_details:action.payload
            }
        case "RESUBMITTION_CREDIT_PLAN_DETAILS":
            return {
                ...state,
                resubmittion_credit_plan_details:action.payload
            }
        case "USER_CUSTOMERS_COUNT":
            return {
                ...state,
                users_customers_count:action.payload
            }
        case "ANNOUNCEMENT_COUNT":
            return {
                ...state,
                announcements_count:action.payload
            }
        case "DASHBOARD_NOTIFY":
            return {
                ...state,
                dashboard_notify:action.payload
            }
        case "ERROR":
            return {
                ...state,
                error:action.error,
                isAuthenticated:false,
                user:null,

            }
    
        default:
         return state;
    }
}

