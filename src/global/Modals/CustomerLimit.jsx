import React from 'react'
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
import imageImport from 'src/utils/imageImport';
import { useNavigate } from 'react-router-dom';


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



function CustomerLimitExpire(props) {
  const navigate = useNavigate()
  const handleNavigate=()=>{
    navigate("/dashboard/plandetails")
    props.handleClose()
  }
  return (
    <div>
         <Backdrop
    sx={{ color: 'white',background:'none',backdropFilter:'blur(2px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={props.isOpen}
    // onClick={handleClose}
  >
      <Modal
        open={props.isOpen}
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
          <IconButton onClick={props.handleClose} style={{color:'text.secondary'}} className='close-upgrade-icon' >
          <Iconify icon="material-symbols:close" />
          </IconButton>
          <div className='upgrade-premeium-img' >
            <img  src={imageImport.warningGif} alt="upgradePlanImage" />

          </div>
          <Typography id="modal-modal-title" style={{fontSize:26,textAlign:'center'}} variant="h6" component="h2">
          {/* You Have Reaching To Your {props?.customerCount} <br/> Users Limit!! */}
          You Have Reaching To Your <br/> Customers Limit!!
          </Typography>
          <Typography id="modal-modal-description" sx={{color:'text.secondary' ,fontSize:16,textAlign:'center',fontWeight:'500',mt: 1 }}>
          To keep using Adiogent without interruption,<br/> Please upgrade you plan from free
          </Typography>
         <div style={{paddingTop:20,paddingBottom:10,display:'flex',justifyContent:"center"}} >

            <Button onClick={handleNavigate} className='product-btn' variant="contained" style={{padding:'14px 30px'}} startIcon={<Iconify icon="fa-brands:telegram-plane" />}> 
            Upgrade Plan
            </Button>

         </div>

        </Box>

      </Modal>
  </Backdrop>
    </div>
  )
}

export default CustomerLimitExpire