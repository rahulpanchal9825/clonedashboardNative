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
import { convertDate } from 'src/global/globalFunctions';
import { IconButton } from '@mui/material';

function EnquiryPreview(props) {
  
  return (
   <div >
    <div className='image-guide-heading'  >
      <p>Enquiry Preview</p>
      {/* <IconButton onClick={props.handleClose} size='small'  style={{color:'text.secondary'}} >
    <Iconify className='image-guide-line-close'  icon="ic:twotone-close" />
      </IconButton> */}
    </div>
    <div className='enquiry-content-box' > 
    <p className='enquiry-preview-detail' >Order ID : <span className='enquiry-details-preview-content' >{props?.data?.order_id}</span> </p>
    <p className='enquiry-preview-detail' >Name : <span className='enquiry-details-preview-content font-capitalize-case ' >{props?.data?.username}</span> </p>
    <p className='enquiry-preview-detail' >Phone Number : <span className='enquiry-details-preview-content' >{props?.data?.phone_number}</span> </p>
    <p className='enquiry-preview-detail' >Date : <span className='enquiry-details-preview-content' >{convertDate(props?.data?.createdAt)}</span> </p>
    <p className='enquiry-preview-detail' >Message : </p>
   <div className='enquiry-message-box' > <p className='enquiry-details-preview-content font-capitalize-case ' >{props.data?.message}</p></div>

         <div className='text-algin-center confirm-button-popup ' >
          {/* <Button variant='text' onClick={props.handleClose}  >{props.cancelBtnName}</Button> */}
         </div>
    </div>
        
   </div>
  )
}

export default EnquiryPreview;