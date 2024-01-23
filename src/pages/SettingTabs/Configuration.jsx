import React, { useEffect, useState } from 'react'
import { Toolbar,FormControlLabel, Tooltip,Menu,Switch, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, Stack } from '@mui/material';
import Iconify from '../../components/Iconify';
import { editable_config } from '../../editable_config';
import { convertDateForOrder } from '../../global/globalFunctions';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import CustomizedSnackbars from '../../global/Snackbar/CustomSnackbar';
import axios from 'axios';
import LoadingSpinner from 'src/components/Spinner';


function Configuration({orderDetail}) {
    const [message ,setMessage] = useState({type:"",message:""})
    const [snackbarOpen,setSnackbarOpen ] = useState(false);
    const [ pageLoading, setPageLoading  ] =useState(false)
    const [render,setRender ] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [error , setError ] = useState("")
    const {authState,fetchAuthuser} = UseContextState()

// console.log("authState",authState,);
// console.log("passwords",password,confirmPassword,);
// handle submit 
const handleSubmit=async(e)=>{
    e.preventDefault()
    if(password != confirmPassword){
      setError("Password Did Not Match !!")
      return
    }
    setPageLoading(true)
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/edit/password/${authState?.user?._id}`,{password},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
    .then(res=>{
        console.log(res?.data)
        if(res?.data?.status === true){
          setPassword('')
          setConfirmPassword('')
          setMessage((prev)=>({...prev,type:'success',message:'Password Changed Successfully !!'}))
          setSnackbarOpen(true);
          setRender(prev=>!prev)
          setPageLoading(false)
      }
      if(res?.data?.status === false){
          setMessage((prev)=>({...prev,type:'error',message:'An Error Occured !!'}))
          setSnackbarOpen(true);
          setRender(prev=>!prev)
          setPageLoading(false)
      }
    })
    .catch(err=>{
        console.log(err)
        setPageLoading(false)

    })
}

// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################
    

  return (
    <>
    <LoadingSpinner loading={pageLoading} />

         {/* #################### SANCKBAR MESSAGE ######################## */}
 <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
 {/* #################### SANCKBAR MESSAGE ######################## */}
        <div className='invoice_details_form'  >
            <form onSubmit={handleSubmit} className='about_phone_fields' style={{boxShadow:'none'}} >
                <h2>Change Password</h2>
                {error && (<p className='show-error-login' style={{textAlign:'left'}} >{error}</p>)}
                <div className="configruration_input__main">
                <div >
               <label className='invoice_input_label'>Password</label>
                <TextField  placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                className='invoice_input_fields' 
                id="outlined-basic" 
                fullWidth
                required
                value={password}
                onChange={(e)=>{setPassword(e.target.value);setError('')}}
                InputProps={{
                  endAdornment:  <InputAdornment position="end">
                         <IconButton onClick={() => setShowPassword(!showPassword)} >
                           <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                         </IconButton>
                       </InputAdornment>
                }}
                 variant="outlined" 
                 />
               </div>
                <div >
               <label className='invoice_input_label'>Confirm Password</label>
                <TextField  placeholder='Confirm Password'
                  type={showPassword ? 'text' : 'password'}
                className='invoice_input_fields' 
                required
                id="outlined-basic" 
                fullWidth
                value={confirmPassword}
                onChange={(e)=>{setConfirmPassword(e.target.value);setError('')}}
                InputProps={{
                  endAdornment:  <InputAdornment position="end">
                         <IconButton onClick={() => setShowPassword(!showPassword)} >
                           <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                         </IconButton>
                       </InputAdornment>
                }}
                 variant="outlined" 
                 />
               </div>
                </div>
                <div className='invoice_btn'>
                <Button type='submit'  variant="contained"  startIcon={<Iconify icon="material-symbols:check-circle-rounded" />}>Save Changes</Button>
                </div>
            </form>
            <div className='app_signing_note' ><strong>Note :</strong> Change Password will not work in demo for security reasons.</div>
                </div>
    </>
  )
}
export default Configuration