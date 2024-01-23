import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Iconify from 'src/components/Iconify';
import LoadingSpinner from 'src/components/Spinner';
import { LoadingButton } from '@mui/lab';


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

export default function SaveAndCancelModal(props) {
  const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  return (
    <div>
    <LoadingSpinner  />
      <Modal
        open={props.open}
        onClose={props.handleClose}
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
          <Typography id="modal-modal-title" style={{fontSize:20}} variant="h6" component="h2">
             {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ fontSize:16,fontWeight:'500',mt: 1 }}>
          {props.message}
          </Typography>
         <div style={{paddingTop:20,display:'flex',justifyContent:"end"}} >
          <Button variant='text' onClick={props.handleClose}  >{props.cancelBtnName}</Button>
          <LoadingButton
          onClick={props.onYes}
         loading={props.loading}
         loadingPosition="start"
         startIcon={<Iconify icon="material-symbols:check-circle" />} 
         variant="contained"
         style={{marginLeft:"10px"}}
       >
         <span>{props.saveBtnName}</span>
       </LoadingButton>
         {/* <Button style={{marginLeft:"10px"}} variant='contained' onClick={props.onYes} startIcon={<Iconify icon="material-symbols:check-circle" />}  >{props.saveBtnName}</Button> */}
         </div>

        </Box>

      </Modal>
    </div>
  );
}