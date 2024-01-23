import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Iconify from 'src/components/Iconify';
import LoadingSpinner from 'src/components/Spinner';
import { LoadingButton } from '@mui/lab';
import imageImport from 'src/utils/imageImport';

function SuccessPayment(props) {
  return (
   <div >
    <div className='text-algin-center'  >
    <Typography id="modal-modal-title" style={{fontSize:20}} variant="h6" component="h2">
             {props.title}
          </Typography>
    </div>
    <div className='payment-success-image' >
    <img   src={imageImport?.paymentSuccessImage} alt="paymentSuccessImage"  />

    </div>
          <div className="text-algin-center">
          <Typography id="modal-modal-description" sx={{color:'text.secondary', fontSize:16,fontWeight:'500',mt: -2 }}>
          {props.message}
          </Typography>
          </div>
         <div className='text-algin-center confirm-button-popup ' >
          {/* <Button variant='text' onClick={props.handleClose}  >{props.cancelBtnName}</Button> */}
          <LoadingButton
          onClick={props.onYes}
         loading={props.loading}
         loadingPosition="start"
         startIcon={<Iconify icon="material-symbols:check-circle" />} 
         variant="contained"
         style={{padding:"10px 20px"}}
       >
         <span>{props.confirmBtnName}</span>
       </LoadingButton>
         </div>
   </div>
  )
}

export default SuccessPayment