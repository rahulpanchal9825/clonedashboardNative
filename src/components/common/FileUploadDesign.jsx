import React,{useState} from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Button } from '@mui/material';
import palette from '../../theme/palette';
import Iconify from '../Iconify';
import uploadImage from "../../assests/uploadimage.gif"
import "../../index.css"
import Avatar from '@mui/material/Avatar';
import { editable_config } from 'src/editable_config';
import PopupModal from 'src/global/Modals/PopupModal';
import ImageGuidelines from 'src/global/Modals/ImageGuidelines';
import { useNavigate } from 'react-router-dom';

function FileUploadDesign({fileUpload,handleFileUpload}) {
  const [ openPopupModal, setOpenPopupModal ] = useState(false)
  const navigate = useNavigate()

  const goToImageCompressor=()=>{
    navigate('/dashboard/tools-and-services/imagecompressor')
  }

  //############################# IMAGE GUIDE MODAL FUNCTION #############################
  const handleClosePopupModal=()=>{
    setOpenPopupModal(false); 
    // setIsOpen2(false)
    onYesFunction()
  }
const handleOpenPopupModal=()=>{
    setOpenPopupModal(true); 
    // setIsOpen2(false)
  }

const onYesFunction=()=>{
    // fetchAuthuser()
    // navigate('/dashboard/manage')
}
  //############################# IMAGE GUIDE MODAL FUNCTION #############################

  return (
    <div>
       {/*===== Popup Modal ====== */}
 <PopupModal handleClose={handleClosePopupModal}open={openPopupModal} data={<ImageGuidelines handleClose={handleClosePopupModal} onYes={onYesFunction}  confirmBtnName='Image Compress Now' title='Reduce Image Size!! ' message='Thanks, your plan has been upgraded succesfully!!'  />} />
        {/*===== Popup Modal ====== */}

         <div className="file-upload" >
              <div className="file-upload-box" >
                 <div className="file-upload-sub-box">
                <img className='upload-image' src={uploadImage} alt="" />
                 <p style={{marginTop:-10}} >Upload your image here </p>
                 <p style={{fontSize:13,color:'gray',paddingBottom:0,fontWeight:'500'}} >Recommended Size: 459 x 612 pixels.</p>
                 <p style={{fontSize:13,color:'gray',paddingBottom:2,fontWeight:'500'}} >(Up to 4 Images)</p>
                 {/* <span>or</span> */}
                 {/* <CloudUploadOutlinedIcon style={{color:palette.primary.main}} /> */}
                 <Button variant="contained" component="label" startIcon={<Iconify icon="ant-design:cloud-upload-outlined" />}>
                      Upload Image
                      <input hidden accept="image/*" onChange={handleFileUpload} multiple type="file" />
                  </Button>
                 {/* <Button variant='contained'  > Browse </Button> */}
                 
                 </div>
              </div>
                 <div className='image-guideline-box'  > 
                 <Button onClick={handleOpenPopupModal} variant="text" className='image-guide-btn-text' startIcon={<Iconify icon="eva:image-fill" />}>Image Guidelines</Button>
                 {/* <Button onClick={goToImageCompressor} variant="text" className='image-guide-btn-text' startIcon={<Iconify icon="fluent:resize-image-20-filled" />}>Image Compressor</Button> */}
                 <a href={editable_config?.ImageCompressorLink} target="_blank"><Button variant="text" className='image-guide-btn-text' startIcon={<Iconify icon="fluent:resize-image-20-filled" />}>Image Compressor</Button></a>
                 </div>

          </div>

          {/* <div className='fileupload_avtar'>
          <Avatar sx={{ width: 70, height: 70 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </div> */}
    </div>
  )
}

export default FileUploadDesign