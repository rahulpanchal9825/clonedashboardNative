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

function ImageGuidelines(props) {
  return (
   <div >
    <div className='image-guide-heading'  >
      <p> Image Guidelines</p>
      {/* <IconButton onClick={props.handleClose} size='small'  style={{color:'text.secondary'}} >
    <Iconify className='image-guide-line-close'   icon="ic:twotone-close" />
      </IconButton> */}
    </div>
    <div className='image-guide-content-box' > 
    <div className='image-guide-innerbox'  >
      <p className="image-guide-inner-head" >Image Format or Upload Size</p>
      <ul className='guidelines-content-list' >
        <li>You can upload (.png, .webp, .jpg, .jpeg) type of image.</li>
        <li>The required image size is up to 1Mb for the banners.</li>
        <li>The required image size is up to 1Mb for the products.</li>
        <li>The required image size is up to 1Mb for the categories.</li>
      </ul>
          </div>
    <div className='image-guide-innerbox'  >
      <p className="image-guide-inner-head" >Image Standards</p>
      <ul className='guidelines-content-list' >
      <li>Best dimensions for banner image is 850 x 378 pixels.</li>
      <li>Best dimensions for product image is 459 x 612 pixels.</li>
      <li>Best dimensions for category image is 64 x 64 pixels.</li>
      </ul>
          </div>
    {/* <div className='image-guide-innerbox'  >
      <p className="image-guide-inner-head" >Following Images will be rejected</p>
      <ul className='guidelines-content-list' >
        <li>Graphic/ Inverted/ Pixelated image are not accepted.</li>
        <li>Images with text/Watermark are not acceptable in primary images.</li>
        <li>Blur images and clutter images are not accepted.</li>
        <li>Product images must not be shrunk, elongated or stretched.</li>
        <li>Partial product image is not allowed.</li>
      </ul>
          </div> */}
         <div className='text-algin-center confirm-button-popup ' >
          {/* <Button variant='text' onClick={props.handleClose}  >{props.cancelBtnName}</Button> */}
         </div>
    </div>
        
   </div>
  )
}

export default ImageGuidelines;