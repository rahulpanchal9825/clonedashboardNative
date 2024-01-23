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

function SocialLinks({orderDetail}) {
    const [socialMediaDetails, setsocialMediaDetails] = useState({whatsapp_link:'',facebook_link:'',instagram_link:'',linkedin_link:'',twitter_link:'',telegram_link:'',youtube_link:''});
    const [message ,setMessage] = useState({type:"",message:""})
    const [snackbarOpen,setSnackbarOpen ] = useState(false);
    const [ pageLoading, setPageLoading  ] =useState(false)
    const [render,setRender ] = useState(false);
    const {authState,fetchAuthuser} = UseContextState()
    console.log("socialMediaDetails-----------",socialMediaDetails)

    let sub_total = 0
    for(let i=0;i<orderDetail?.products?.length;i++){
        sub_total = sub_total + (orderDetail?.products[i]?.product_sale_price * orderDetail?.products[i]?.product_quantity)
    }

    useEffect(()=>{
      setPageLoading(true)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/users/social/media/links/details/${authState?.user?.app_id}`,{headers: {
            'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
          },withCredentials:true})
        .then(res=>{
          console.log("details",res?.data);
          setsocialMediaDetails(prev=>({...prev,
            whatsapp_link:res?.data?.details?.whatsapp_link,
            facebook_link:res?.data?.details?.facebook_link,
            instagram_link:res?.data?.details?.instagram_link,
            linkedin_link:res?.data?.details?.linkedin_link,
            twitter_link:res?.data?.details?.twitter_link,
            telegram_link:res?.data?.details?.telegram_link,
            youtube_link:res?.data?.details?.youtube_link,
        
        }));
      setPageLoading(false)

        })
        .catch(err=>{
            console.log(err);

        })
      },[render])
   

// handle submit invoice details
const handleSubmitAboutPhone=async(e)=>{
    e.preventDefault()
    // https://api.whatsapp.com/send/?phone=+918700885827&text=Hello
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/edit/social/media/links/details/for/app/${authState?.user?.app_id}`,{...socialMediaDetails},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
    .then(res=>{
        console.log(res?.data)
        if(res?.data?.status === true){
            // setsocialMediaDetails(prev=>({...prev,
            //     aboutus:'',
            //     term_and_condition:'',
            //     privacy_policy:'',
            // }))
            setMessage((prev)=>({...prev,type:'success',message:'Social Media Links Updated Successfully !!'}))
            setSnackbarOpen(true);
            fetchAuthuser()
            setRender(prev=>!prev)
        }
        if(res?.data?.status === false){
            setMessage((prev)=>({...prev,type:'error',message:'Social Media Links Updated Failed !!'}))
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
                <h2>Social Media Links For Your App</h2>
                <div className="about_phone_field_row">
                <div >
               <label className='invoice_input_label'>Youtube</label>
                <TextField   placeholder='https://www.youtube.com/your_youtube_channel' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.youtube_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,youtube_link:e.target.value}))}/>
               </div>
                <div >
               <label className='invoice_input_label'>WhatsApp</label>
                <TextField   placeholder='https://api.whatsapp.com/send/?phone=+919800980909' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.whatsapp_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,whatsapp_link:e.target.value}))}/>
               </div>
                </div>
                <div className="about_phone_field_row">
                <div >
               <label className='invoice_input_label'>Facebook</label>
                <TextField   placeholder='https://www.facebook.com/your_facebook_page' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.facebook_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,facebook_link:e.target.value}))}/>
               </div>
                <div >
               <label className='invoice_input_label'>Instagram</label>
                <TextField   placeholder='https://www.instagram.com/your_instagram_account' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.instagram_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,instagram_link:e.target.value}))}/>
               </div>
                </div>
                <div className="about_phone_field_row">
                <div >
               <label className='invoice_input_label'>LinkedIn</label>
                <TextField   placeholder='https://www.linkedin.com/your_linkedin_account' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.linkedin_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,linkedin_link:e.target.value}))}/>
               </div>
                <div >
               <label className='invoice_input_label'>Twitter</label>
                <TextField   placeholder='https://twitter.com/your_twitter_account' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.twitter_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,twitter_link:e.target.value}))}/>
               </div>
                </div>
                <div className="about_phone_field_row">
                <div >
               <label className='invoice_input_label'>Telegram </label>
                <TextField   placeholder='https://t.me/+wGbB30-_OkBmYsW' type='text'   className='invoice_input_fields' variant="outlined" value={socialMediaDetails?.telegram_link} onChange={(e)=>setsocialMediaDetails(prev=>({...prev,telegram_link:e.target.value}))}/>
               </div>
               <div >
              
               </div>
                </div>
                <div className='invoice_btn'>
                <Button type='submit'  variant="contained"  startIcon={<Iconify icon="material-symbols:check-circle-rounded" />}>Save Changes</Button>
                </div>
            </form>
                </div>
    </>
  )
}
export default SocialLinks