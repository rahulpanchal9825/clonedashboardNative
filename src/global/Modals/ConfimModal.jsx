import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Iconify from 'src/components/Iconify';
import { IconButton } from '@mui/material';

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

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  return (
    <div>
    
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
        <IconButton onClick={props.handleClose} style={{color:'text.secondary'}} className='close-upgrade-icon' >
             <Iconify icon="material-symbols:close" />
             </IconButton>
          <Typography id="modal-modal-title" style={{fontSize:20}} variant="h6" component="h2">
             {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ fontSize:16,fontWeight:'500',mt: 2 }}>
          {props.message}
          </Typography>
         <div style={{paddingTop:26,display:'flex',justifyContent:"end"}} >
          {/* <Button variant='contained'  onClick={props.handleClose} startIcon={<Iconify icon="material-symbols:close-rounded" />} >Cancel</Button> */}
          <Button variant='text'  onClick={props.handleClose}  >Cancel</Button>
         <Button  variant='contained' style={{marginLeft:"10px"}} onClick={props.onYes} startIcon={<Iconify icon="eva:trash-2-outline" />}  >Delete</Button>
         {/* <Button  variant='contained' style={{marginLeft:"10px",backgroundColor:'#e70000'}} onClick={props.onYes} startIcon={<Iconify icon="eva:trash-2-outline" />}  >Delete</Button> */}
         </div>

        </Box>

      </Modal>
    </div>
  );
}