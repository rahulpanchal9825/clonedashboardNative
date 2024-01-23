import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper } from '@mui/material';

function LoadingSpinner(props) {
  return (
    <>
     {/* #################### LOADING SPINNER ######################## */}
    <Backdrop
       sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
       open={props.loading}
      //  onClick={handleClose}
     >
      {/* <Paper elevation={4} sx={{ borderRadius:40,py:2.5,px:3 }}  > */}
       <CircularProgress color="inherit" />
       {/* </Paper> */}
     </Backdrop>
   {/* #################### LOADING SPINNER ######################## */}
   </>
  )
}

export default LoadingSpinner