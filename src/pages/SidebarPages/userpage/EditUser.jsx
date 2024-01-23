import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import {useParams,useNavigate } from 'react-router-dom';
import { InputAdornment,Container,TextField,Button, Backdrop, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../../components/Iconify';
import {uploadFileToFirebase,returnFileName,deleteImageFromFirebase,splitString} from "../../../global/globalFunctions"
import noImage from '../../../assests/No_image.svg'
import palette from '../../../theme/palette';
import ConfimModal from "../../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import { editable_config } from 'src/editable_config';
import VideoModal from 'src/global/Modals/VideoModal';

function EditUser({handleClose}) {
    const [ render, setRender ] = useState(false);
    const [ loading, setLoading] = useState(false)
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [openConfimModal ,setOpenConfimModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [ userData, setUserData ] = useState([])
  const [message ,setMessage] = useState({type:"",message:""})
  const {user_id} = useParams(); 
  const navigate = useNavigate(); 
  const userId = user_id;

  console.log("userId",userId)
  console.log("USER DATA",userData)

  //##################### GET USER BY ID #####################
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/get/${userId}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res);
      setUserData(res?.data);
    setLoading(false)


    })
  },[render])
  //##################### GET USER BY ID #####################

  // #####################  handle Change #####################
  const handleChange=(e)=>{
    setUserData((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  // #####################  handle Change #####################

   // ##################### handle form submit  #####################
   const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true);
    const data={
      username:userData?.username?.toLowerCase(),
      email:userData?.email?.toLowerCase(),
      phone_number:userData?.phone_number,
      state:userData?.state?.toLowerCase(),
      pincode:userData?.pincode,
      address:userData?.address?.toLowerCase(),
    }
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/user/edit/${userId}`,{...data},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
    .then(res=>{
        console.log(res)
        setLoading(false);
        setMessage((prev)=>({...prev,type:'success',message:'Customer Updated Successfully !!'}))
        setSnackbarOpen(true);
        setRender(prev=>!prev);
  
    })
    .catch(err=>{
        console.log(err);
        setLoading(false);
    })
    setLoading(false);
}
   // ##################### handle form submit  #####################
 

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
  
  return (
    <>
     <div className='custom-conatiner'>
      {/* #################### SANCKBAR MESSAGE ######################## */}
       <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 {/* #################### SANCKBAR MESSAGE ######################## */}

      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    {/* #################### LOADING SPINNER ######################## */}


   {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
<Paper elevation={4}  >
        {/* <Container maxWidth="lg"> */}
        <div className='edit-user-main-box' >
        <div className='inner-page-heading-box' >
        <IconButton sx={{color:'black'}}  onClick={()=>navigate(-1)} >
        <Iconify icon="material-symbols:arrow-back-rounded" />
        </IconButton>
     <div>
     <h2>  View or Edit Customer</h2>
      {/* <p>   View and Edit Customer necessary information from here</p> */}
     </div>
      </div>
    <form onSubmit={handleSubmit} className='edit-user-input-field-box' >
                    <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Customer Name  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="username"  onChange={handleChange} value={userData?.username} placeholder="Customer Name " variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor=""> Customer Email </label>
                    <TextField required type='email' fullWidth className='product_form_input' id="outlined-basic" name="email" onChange={handleChange} value={userData?.email} placeholder="Customer Email" variant="outlined" />
                    </div>
                    
                    </div>
                   
                    {/* <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor=""> User Email </label>
                    <TextField required type='email' fullWidth className='product_form_input' id="outlined-basic" name="email" onChange={handleChange} value={userData?.email} placeholder="User Email" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Gst No. </label>
                    <TextField required fullWidth  className='product_form_input' id="outlined-basic" style={{textTransform:'uppercase'}} name="gst_number" onChange={handleChange} value={userData?.gst_number}  placeholder="Gst No." variant="outlined" />
                    </div>
                    </div> */}
                    <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor=""> Phone Number  </label>
                    <TextField required fullWidth type='number' className='product_form_input' id="outlined-basic" name="phone_number" onChange={handleChange} value={userData?.phone_number}  placeholder="Phone Number" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">State </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="state" onChange={handleChange} value={userData?.state} placeholder="State" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Pincode </label>
                    <TextField required type='number' fullWidth className='product_form_input' id="outlined-basic" name="pincode" onChange={handleChange} value={userData?.pincode}  placeholder="Pincode" variant="outlined" />
                    </div>
                    {/* <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Transport Details </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="transport_detail"  onChange={handleChange} value={userData?.transport_detail} placeholder="Transport Details" variant="outlined" />
                    </div> */}
                    </div>
                    <div className='add_product_label_input'>
                    <label htmlFor=""> Customer Address  </label>
                    <TextField multiline rows={4} required fullWidth className='product_form_input' name='address' onChange={handleChange} value={userData?.address} id="outlined-basic" placeholder="Enter Customer Address " variant="outlined" />
                    </div>
                    <div style={{paddingTop:20}} >

<Button  variant='text' style={{marginRight:"10px"}} onClick={()=>navigate(-1)}  startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} > Go Back  </Button>

 <Button   variant='contained' type='submit'  startIcon={<Iconify icon="bxs:check-circle" />} > Save Changes </Button>

</div>
                    </form>
      
  
   {/* </Container> */}
   </div>
</Paper>

</div>

   </>
  )
}

export default EditUser