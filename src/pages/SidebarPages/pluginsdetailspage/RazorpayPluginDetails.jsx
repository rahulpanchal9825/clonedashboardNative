
import React,{useState,useEffect,useRef} from 'react'
import {MenuItem,OutlinedInput,Chip,InputLabel,Checkbox,ListItemText,FormControl,Select, InputAdornment, Tooltip, TextField, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import Iconify from 'src/components/Iconify';
import {Button,IconButton} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import { editable_config } from 'src/editable_config';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import imageImport from 'src/utils/imageImport';
import LoadingSpinner from 'src/components/Spinner';

function RazorpayPluginDetails() {
    const [ openDeleteConfimModal, setOpenDeleteConfimModal ] = useState(false)
    const [message ,setMessage] = useState({type:"",message:""})
    const [ isInstalled, setIsInstalled  ] =useState(false)
    const [ razorpayKeyId, setrazorpayKeyId  ] =useState('')
    const [ razorpayKeySecret, setrazorpayKeySecret  ] = useState('')
    const [ pageLoading, setPageLoading  ] =useState(false)
    const [ loading, setLoading  ] =useState(false)
    const [ btnUninstallLoading, setbtnUninstallLoading  ] =useState(false)
    const [snackbarOpen,setSnackbarOpen ] = useState(false)
    const [ render, setRender ] = useState(false)
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const {authState} = UseContextState()
    const navigate = useNavigate()

    useEffect(()=>{
      setPageLoading(true)
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/plugin/razorpay/detail/${authState?.user?.app_id}`,{headers: {
        'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
      },withCredentials:true})
      .then(res=>{
        console.log('plugin deatils',res?.data)
        setIsInstalled(res?.data?.plugin_details?.razorpay_is_installed)
        setrazorpayKeyId(res?.data?.plugin_details?.razorpay_key_id)
        setrazorpayKeySecret(res?.data?.plugin_details?.razorpay_key_secret)
      setPageLoading(false)

      })
      .catch(err=>{
        console.log(err)
      })
    },[render])

    // ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

    // handle close video modal
    function handleCloseVideoModal(){
        setOpenVideoModal(false)
      }
      
    
      // handle open video modal
      function handleOpenVideoModal(){
        setOpenVideoModal(true)
      }
  



  const activePluginBtn = async(e)=>{
    e.preventDefault()
    const plugin_detail={
      razorpay_is_installed:isInstalled,
      razorpay_key_id:razorpayKeyId?.trim(),
      razorpay_key_secret:razorpayKeySecret?.trim()
    }
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/plugin/razorpay/details/${authState?.user?.app_id}`
    ,{...plugin_detail}
    ,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log("Plugin Detail=>",res?.data)
      setSnackbarOpen(true);
      setMessage((prev)=>({...prev,type:'success',message:'Plugin Updated Successfully !!'}))
      setRender(prev=>!prev)
    })
    .catch(err=>{
      console.log(err)
      setSnackbarOpen(true);
      setMessage((prev)=>({...prev,type:'error',message:'Unknown error occurred !!'}))
    })
  }


  return (
    <div className='custom-conatiner'>
<LoadingSpinner loading={pageLoading} />


        {/* #################### SANCKBAR MESSAGE ######################## */}
        <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
 {/* #################### SANCKBAR MESSAGE ######################## */}
<Paper elevation={4} >
<div className='product-conatiner'>
<div className='inner-page-heading-box' >
        <IconButton sx={{color:'black'}}  onClick={()=>navigate(-1)} >
        <Iconify icon="material-symbols:arrow-back-rounded" />
        </IconButton>
     <div>
     <h2>Payments </h2>
     </div>
      </div>
     <div className="plugin_detail_main_container">
     <div className='plugin-details-box-style plugin-video-main-box' >
     <div className="plugin_detail_card_main_box">
          <div className='plugin_card_box' >
              <img src={imageImport.plugin_2}
              className='plugin_icon'
              />
             <div className='flex-columns' >
            <Typography variant="h4" sx={{paddingBottom:0.5,textTransform:'capitalize'}} >Razorpay Payments</Typography>
              <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
              Razorpay is the top payments solution in India that allows businesses to accept online payments. You get access to all payment modes including credit & debit card, netbanking, UPI and popular wallets.
              </Typography>
             </div>
            </div>
         
              <div className='key_feature_box' >
              <Typography variant="h6" sx={{textTransform:'capitalize'}} >Key Features</Typography>
                <ul className='key_feature_list' >
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                 Simple to setup
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Accept online payments
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Secured with razorypay security
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Accept credit & debit card, netbanking, UPI and popular wallets payments
                  </Typography>
                    </li>
                    <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Assign attributes to products within the product information page
                  </Typography>
                    </li>
          
                </ul>
              </div>


<form onSubmit={activePluginBtn} className='plugin_config_box' >
<Typography variant="h4" sx={{paddingBottom:0.5,textTransform:'capitalize'}} > Configure Razorpay</Typography>

     <div className='add_product_label_input' style={{width:'100%'}} >
      <label htmlFor=""> Razorpay Key ID </label>
      <TextField required fullWidth
      value={razorpayKeyId}
      onChange={(e)=>setrazorpayKeyId(e.target.value)}
       className='product_form_input' id="outlined-basic" 
       name="shiprocket_razorpayKeyId"  placeholder="Enter You Razorpay Key ID " variant="outlined" />
      </div>
     <div className='add_product_label_input' style={{width:'100%'}} >
      <label htmlFor=""> Razorpay Key Secret </label>
      <TextField required fullWidth 
        value={razorpayKeySecret}
        onChange={(e)=>setrazorpayKeySecret(e.target.value)}
      className='product_form_input' id="outlined-basic" 
      name="shiprocket_user_password"  placeholder="Enter Your Razorpay Key Secret " variant="outlined" />
      </div>
      <div className='plugin_config_active_btn' >
      <Button  variant='text' style={{marginRight:"10px"}} onClick={()=>navigate(-1)}  startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} > Go Back  </Button>
      <Button  type='submit' endIcon={<Iconify icon="material-symbols:check-circle-rounded" />}  variant='contained' > Update </Button>
      </div>
</form>

          </div>
            </div>
     <div className='plugin-details-box-style plugin-video-main-box' >
                <div className='plugin-video-box' >
            <iframe className='app_plugin_video' width="100%" height="517" style={{borderRadius:'20px'}}  src="https://www.youtube.com/embed/aTZ_XW2NaQ8" allowFullScreen  title="YouTube video player" frameborder="0" ></iframe>
                </div>
            </div>
     </div>
</div>
</Paper>
        
    </div>
  )
}

export default RazorpayPluginDetails