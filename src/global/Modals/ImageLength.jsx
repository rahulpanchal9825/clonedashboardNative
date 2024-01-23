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
import palette from 'src/theme/palette';
import { editable_config } from 'src/editable_config';
import { IconButton } from '@mui/material';

function ImageLength(props) {
  return (
   <div >
    <div className='text-algin-center'  >
    {/* <IconButton className='modal-close-btn' onClick={props.handleClose}   style={{color:'text.secondary'}} >
    <Iconify  icon="ic:twotone-close" />
      </IconButton> */}
    <Typography id="modal-modal-title" style={{fontSize:20}} variant="h6" component="h2">
             {props.title}
          </Typography>
    </div>
    <div className='payment-success-image' >
    <img   src={imageImport?.errorLogoGif} alt="paymentSuccessImage"  />

    </div>
          <div className="text-algin-center">
          <Typography id="modal-modal-description" sx={{ fontSize:15,mt: -3,fontWeight:500 }}>{props.message}<a href="#" target='_blank' > <span style={{color:palette.primary.main,fontSize:13}} > Learn more</span></a> </Typography>
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

export default ImageLength;