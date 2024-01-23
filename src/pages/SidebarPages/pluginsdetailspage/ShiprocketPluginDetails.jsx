
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

function ShiprocketPluginDetails() {
    const [ openDeleteConfimModal, setOpenDeleteConfimModal ] = useState(false)
    const [message ,setMessage] = useState({type:"",message:""})
    const [ isInstalled, setIsInstalled  ] =useState(false)
    const [ useremail, setUseremail  ] =useState('')
    const [ userPassword, setUserPassword  ] = useState('')
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
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/plugin/shiprocket/detail/${authState?.user?.app_id}`,{headers: {
        'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
      },withCredentials:true})
      .then(res=>{
        console.log('plugin deatils',res?.data)
        setIsInstalled(res?.data?.plugin_details?.shiprocket_plugin?.is_installed)
        setUseremail(res?.data?.plugin_details?.shiprocket_plugin?.user_email)
        setUserPassword(res?.data?.plugin_details?.shiprocket_plugin?.user_password)
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
      is_installed:isInstalled,
      user_email:useremail?.trim(),
      user_password:userPassword?.trim()
    }
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/plugin/shiprocket/details/${authState?.user?.app_id}`
    ,{plugin_detail}
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
     <h2>Shipping</h2>
      {/* <p>  Add your products for your app</p> */}
     </div>
      </div>
     <div className="plugin_detail_main_container">
     <div className='plugin-details-box-style plugin-video-main-box' >
     <div className="plugin_detail_card_main_box">
          <div className='plugin_card_box' >
              <img src={imageImport.plugin_1}
              className='plugin_icon'
              />
             <div className='flex-columns' >
            <Typography variant="h4" sx={{paddingBottom:0.5,textTransform:'capitalize'}} >Shiprocket</Typography>
              <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
              Ship your orders faster and cheaper with the best ecommerce shipping solution in India. Choose from 17+ courier partners including EcomExpress, BlueDart, Delhivery, XpressBees, Shadowfax, and more.

              </Typography>
            
            
             </div>
            </div>
           
              <div className='key_feature_box' >
              <Typography variant="h6" sx={{textTransform:'capitalize'}} >Key Features</Typography>
                <ul className='key_feature_list' >
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Easy Customization
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Add multiple attributes
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Assign attributes to products within the product information page
                  </Typography>
                    </li>
                  <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Create filters on the store front for a better shopping experience
                  </Typography>
                    </li>
                    <li> <Typography variant="body2"  sx={{ color: 'text.secondary' }} >
                  Assign attributes to products within the product information page
                  </Typography>
                    </li>
          
                </ul>
              </div>


<form onSubmit={activePluginBtn} className='plugin_config_box' >
<Typography variant="h4" sx={{paddingBottom:0.5,textTransform:'capitalize'}} > Configure Shiprocket</Typography>

     <div className='add_product_label_input' style={{width:'100%'}} >
      <label htmlFor=""> Shiprocket User Email </label>
      <TextField required fullWidth
      value={useremail}
      onChange={(e)=>setUseremail(e.target.value)}
       className='product_form_input' id="outlined-basic" 
       type='email'
       name="shiprocket_useremail"  placeholder="Shiprocket User Email " variant="outlined" />
      </div>
     <div className='add_product_label_input' style={{width:'100%'}} >
      <label htmlFor=""> Shiprocket User Password </label>
      <TextField required fullWidth 
        value={userPassword}
        onChange={(e)=>setUserPassword(e.target.value)}
      className='product_form_input' id="outlined-basic" 
      name="shiprocket_user_password"  placeholder="Shiprocket User Password " variant="outlined" />
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
            <iframe className='app_plugin_video' width="100%" height="517" style={{borderRadius:'20px'}}  src="https://www.youtube.com/embed/NttMC4TtTj8" allowFullScreen  title="YouTube video player" frameborder="0" ></iframe>
                </div>
            </div>
     </div>
</div>
</Paper>
        
    </div>
  )
}

export default ShiprocketPluginDetails