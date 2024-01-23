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
import { IconButton } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 950,
  bgcolor: 'background.paper',
  // bgcolor: 'white',
  border: 'none',
  boxShadow: 4,
  borderRadius:1,
  p: 2.5,
  pt: 2,
  pb: 2,
};



function VideoModal(props) {
  return (
    <div  >
         <Backdrop
    sx={{ color: 'white',background:'none',backdropFilter:'blur(2px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={props?.isOpen}
    onClick={props?.handleClose}
  >
      <Modal
        open={props?.isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
            
            // BackdropComponent={Backdrop}
            // BackdropProps={{
            // timeout: 500,
            //  }}
        // disableEscapeKeyDown={false}
      >
         
        <Box sx={style}>
          {/* <p style={{textAlign:'right',fontSize:20}} onClick={props.handleClose} > X</p> */}
          <IconButton onClick={props?.handleClose} style={{color:'text.secondary'}} className='close-upgrade-icon' >
          <Iconify icon="material-symbols:close" />
          </IconButton>
          {/* style={{fontSize:22,paddingBottom:10,textAlign:'left'}} */}
          <Typography id="modal-modal-title" className='video-modal-haeding'  variant="h6">
        {props.title}
          </Typography>
          {/* style={{borderRadius:'8px',height:"517px"}} */}
          {/* <div className='video-box' > */}
          <div  >
                <iframe width="100%"  height='100%'  className='video-tutorial-iframe-2'  allowFullScreen  src={props?.video_url}  title="YouTube video player" frameborder="0" ></iframe>
                </div>
 

        </Box>

      </Modal>
  </Backdrop>
    </div>
  )
}

export default VideoModal