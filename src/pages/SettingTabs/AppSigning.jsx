import React, { useEffect, useState } from 'react'
import { Toolbar,FormControlLabel, Tooltip,Menu,Switch, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';
// import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import Iconify from '../../components/Iconify';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { editable_config } from '../../editable_config';
import { convertDateForOrder } from '../../global/globalFunctions';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import CustomizedSnackbars from '../../global/Snackbar/CustomSnackbar';
import axios from 'axios';
import LoadingSpinner from 'src/components/Spinner';
// import { useState } from 'react';

function AppSigning({orderDetail}) {
    const [appSigningDetails, setAppSigningDetails] = useState({app_sha_1:'',app_sha_256:''});
    const [message ,setMessage] = useState({type:"",message:""})
    const [snackbarOpen,setSnackbarOpen ] = useState(false);
    const [ pageLoading, setPageLoading  ] =useState(false)
    const [render,setRender ] = useState(false);
    const {authState,fetchAuthuser} = UseContextState()
    console.log("appSigningDetails-----------",appSigningDetails)

    let sub_total = 0
    for(let i=0;i<orderDetail?.products?.length;i++){
        sub_total = sub_total + (orderDetail?.products[i]?.product_sale_price * orderDetail?.products[i]?.product_quantity)
    }

    useEffect(()=>{
      setPageLoading(true)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/users/app/signing/details/${authState?.user?.app_id}`,{headers: {
            'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
          },withCredentials:true})
        .then(res=>{
            setAppSigningDetails(res?.data?.details?.app_signing)
          console.log("details",res?.data);
          setPageLoading(false)
        })
        .catch(err=>{
            console.log(err);

        })
      },[render])
   

// handle submit invoice details
const handleSubmitAboutPhone=async(e)=>{
    e.preventDefault()
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/edit/app/signing/details/for/app/${authState?.user?.app_id}`,{...appSigningDetails},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
    .then(res=>{
        console.log(res?.data)
        if(res?.data?.status === true){
            setAppSigningDetails(prev=>({...prev,
                app_sha_1:'',
                app_sha_256:'',
            }))
            setMessage((prev)=>({...prev,type:'success',message:'App Signing Details Updated Successfully !!'}))
            setSnackbarOpen(true);
            fetchAuthuser()
            setRender(prev=>!prev)
        }
        if(res?.data?.status === false){
            setMessage((prev)=>({...prev,type:'error',message:'App Signing Details Updated Failed !!'}))
            setSnackbarOpen(true);
            setRender(prev=>!prev)

        }
    })
    .catch(err=>{
        console.log(err)
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
            <form onSubmit={handleSubmitAboutPhone} className='about_phone_fields' style={{boxShadow:'none'}} >
               <div style={{paddingBottom:10}} >
               <h2>App Signing Key Certificate</h2>
                {/* <span>This is the public certificate for the app signing key that Google uses to sign each of your releases.</span> */}
               </div>
                <div className="about_phone_field_row">
                <div >
               <label className='invoice_input_label'>SHA-1 certificate fingerprint</label>
                <TextField   label='' type='text'   className='invoice_input_fields' variant="outlined" value={appSigningDetails?.app_sha_1} onChange={(e)=>setAppSigningDetails(prev=>({...prev,app_sha_1:e.target.value}))} placeholder='SHA-1 certificate fingerprint' />
               </div>
                <div >
               <label className='invoice_input_label'>SHA-256 certificate fingerprint</label>
                <TextField   label='' type='text'   className='invoice_input_fields' variant="outlined" value={appSigningDetails?.app_sha_256} onChange={(e)=>setAppSigningDetails(prev=>({...prev,app_sha_256:e.target.value}))} placeholder='SHA-256 certificate fingerprint'/>
               </div>
                </div>

                <div className=''  >
                <Button  type='submit'  variant="contained"  startIcon={<Iconify icon="material-symbols:check-circle-rounded" />}>Save Changes</Button>
                </div>
                {/* <div className='app_signing_note' ><strong>Note :</strong> After submission of app signing keys your app will be update within 24 working hours.</div> */}
                <div className='app_signing_note' ><strong>Note :</strong> Paste your App signing certificate's from your google play console account.</div>
            </form>
                </div>
    </>
  )
}
export default AppSigning