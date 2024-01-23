import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Iconify from 'src/components/Iconify';
import { editable_config } from 'src/editable_config';
import upgradePlanImage from "src/assests/upgradepremium.gif"
import { IconButton, useMediaQuery } from '@mui/material';
import imageImport from 'src/utils/imageImport';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  // bgcolor: 'white',
  border: 'none',
  boxShadow: 4,
  borderRadius:1,
  p: 3,
};



function MobileViewPopup(props) {
    const [open, setOpen] = useState(true);
    const matches = useMediaQuery('(max-width:426px)');
  return (
    <div  >
      {matches && 
       <Backdrop
       sx={{ color: 'white',background:'none',backdropFilter:'blur(2px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
       open={open}
   
       // onClick={handleClose}
     >
         <Modal
           open={open}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
           disableAutoFocus
           className='mobile_view_expirence_modal'
               
               // BackdropComponent={Backdrop}
               // BackdropProps={{
               // timeout: 500,
               //  }}
           // disableEscapeKeyDown={false}
         >
            
           <Box sx={style}>
             {/* <p style={{textAlign:'right',fontSize:20}} onClick={props.handleClose} > X</p> */}
             <IconButton onClick={()=>setOpen(false)} style={{color:'text.secondary'}} className='close-upgrade-icon' >
             <Iconify icon="material-symbols:close" />
             </IconButton>
             <div className='upgrade-premeium-img' >
               <img  src={imageImport.uiGif} alt="upgradePlanImage" />
   
             </div>
             <Typography className='phone_video_popup_for_better_experience' id="modal-modal-title " style={{fontSize:26,textAlign:'center'}} variant="h6" component="h2">
             For Better User Experience <br/>Please Use Web!!
             </Typography>


   
           </Box>
   
         </Modal>
     </Backdrop>
      }
        
    </div>
  )
}

export default MobileViewPopup