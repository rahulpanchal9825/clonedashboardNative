import React from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Button } from '@mui/material';
import palette from '../../theme/palette';
import Iconify from '../Iconify';
import uploadImage from "../../assests/uploadimage.gif"
import "../../index.css"
import storelogo2 from "src/assests/uploadlogo.png"
import Avatar from '@mui/material/Avatar';

function LogoFileUploadDesgin({fileUpload,uploadedImage,handleFileUpload}) {
  return (
    <div>
        <div className='upload_logo_here'>
                    <img src={uploadedImage}  width={64} height={64} alt="" />
                    {/* <Button variant="text" component="label" > */}
                      <input hidden accept="image/*"  multiple type="file" />
                  {/* </Button> */}
                  <p>  Upload your app logo here*</p>
                    <span>Supports: JPG, JPEG, PNG</span>
                </div>
    </div>
  )
}

export default LogoFileUploadDesgin