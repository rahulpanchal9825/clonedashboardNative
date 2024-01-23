import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import PropTypes from 'prop-types';
import {useParams,useNavigate } from 'react-router-dom';
import { InputAdornment,Container,TextField,Button,Box,Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../../components/Iconify';
import {uploadFileToFirebase,returnFileName,deleteImageFromFirebase,splitString} from "../../../global/globalFunctions"
import noImage from '../../../assests/No_image.svg'
import palette from '../../../theme/palette';
import ConfimModal from "../../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import EditMainCategory from './EditMainCategory';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import VideoModal from 'src/global/Modals/VideoModal';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

function CategoryEditPage({handleClose}) {

  const [value, setValue] = React.useState(0);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const {main_category_id} = useParams(); 
  const navigate = useNavigate(); 


const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // handle close video modal
  function handleCloseVideoModal(){
    setOpenVideoModal(false)
  }
  

  // handle open video modal
  function handleOpenVideoModal(){
    setOpenVideoModal(true)
  }
  
  
  return (
    <>
    <VideoModal title='Learn how to edit category ?' video_url="https://www.youtube.com/embed/USccSZnS8MQ" isOpen={openVideoModal} handleClose={handleCloseVideoModal} /> 

     <div className="banner-image-guide-box order_page_video ">
    <Button onClick={handleOpenVideoModal} variant="text" className='image-guide-btn-text' startIcon={<Iconify icon="logos:youtube-icon" />}>Learn How it Works</Button>
   </div>
     <div className='custom-conatiner'>


   {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
<Paper elevation={4} >
        {/* <Container maxWidth="lg"> */}
        <div className='add-category-main-box' >
        <div className='inner-page-heading-box' >
        <IconButton sx={{color:'black'}}  onClick={()=>navigate(-1)} >
        <Iconify icon="material-symbols:arrow-back-rounded" />
        </IconButton>
     <div>
     <h2>  View or Edit Category</h2>
      {/* <p>  View and Edit category necessary information from here</p> */}
     </div>
      </div>
      <Box sx={{ maxWidth: {  sm: 480 }, bgcolor: 'background.paper' }} >
        <EditCategory  mainCategoryId={main_category_id} />
    </Box>
   
      
  
   {/* </Container> */}
   </div>
</Paper>

</div>

   </>
  )
}

export default CategoryEditPage