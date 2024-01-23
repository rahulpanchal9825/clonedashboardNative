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
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // bgcolor: 'white',
  border: 'none',
  boxShadow: 4,
  borderRadius:1,
  p: 3,
};



function UpgradeAccount() {
  const navigate = useNavigate()
  const handleNavigate=()=>{
    navigate("/dashboard/plandetails")
    props.handleClose()
  }
  return (
    <div>
         <Backdrop
    sx={{ color: 'white',background:'none',backdropFilter:'blur(2px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={true}
    // onClick={handleClose}
  >
      <Modal
        open={true}
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
            <img src={upgradePlanImage} alt="upgradePlanImage" />
          <Typography id="modal-modal-title" style={{fontSize:35,textAlign:'center'}} variant="h6" component="h2">
            Get Premium
          </Typography>
          <Typography id="modal-modal-description" sx={{ fontSize:16,textAlign:'center',fontWeight:'500',mt: 1 }}>
          Upgrade Your Plan ₹999/month
          </Typography>
         <div style={{paddingTop:20,paddingBottom:50,display:'flex',justifyContent:"center"}} >

            <Button onClick={handleNavigate}  className='product-btn' variant="contained" startIcon={<Iconify icon="fa-brands:telegram-plane" />}> 
            Upgrade Plan
            </Button>

         </div>

        </Box>

      </Modal>
  </Backdrop>
    </div>
  )
}

export default UpgradeAccount