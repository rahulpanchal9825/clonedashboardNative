import * as React from 'react';
import { useState,useRef } from 'react';

import { Toolbar, Tooltip,Menu, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Backdrop from '@mui/material/Backdrop';
import { visuallyHidden } from '@mui/utils';
import { Link, useNavigate } from 'react-router-dom';
import { deleteImageFromFirebase, returnFileName, splitString, uploadFileToFirebase } from 'src/global/globalFunctions';
import Iconify from '../components/Iconify';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedSnackbars from '../global/Snackbar/CustomSnackbar';
import ConfimModal from "../global/Modals/ConfimModal"
import { convertDate ,getGapBetweenDates} from '../global/globalFunctions';
import { useEffect } from 'react';
import axios from 'axios';
import searchNotFound from "../assests/searchnotfound.gif"
import noImage from '../assests/No_image.svg'
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import { editable_config } from 'src/editable_config';
import PopupModal from 'src/global/Modals/PopupModal';
import ImageError from 'src/global/Modals/ImageError';
import ImageGuidelines from 'src/global/Modals/ImageGuidelines';
import VideoModal from 'src/global/Modals/VideoModal';

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, "pending", 4.3,),
  createData('Donut', 452, 25.0, "verified", 4.9,),
  createData('Eclair', 262, 16.0, "pending", 6.0,),
  createData('Frozen yoghurt', 159, 6.0, "verified", 4.0,),
  createData('Gingerbread', 356, 16.0, "not verified", 3.9,),
  createData('Honeycomb', 408, 3.2, "not verified", 6.5,),
  createData('Ice cream sandwich', 237, 9.0, "not verified", 4.3,),
  createData('Jelly Bean', 375, 0.0, "pending", 0.0,),
  createData('KitKat', 518, 26.0, "verified", 7.0,),
  createData('Lollipop', 392, 0.2, "not verified", 0.0,),
  createData('Marshmallow', 318, 0, "verified", 2.0,),
  createData('Nougat', 360, 19.0, "not verified", 37.0,),
  createData('Oreo', 437, 18.0, "not verified", 4.0,),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'shop_name',
    numeric: false,
    disablePadding: true,
    label: '',
  },
//   {
//     id: 'shop_id',
//     numeric: false,
//     disablePadding: true,
//     label: '',
//   },

  {
    id: 'banner_name',
    numeric: false,
    disablePadding: false,
    label: 'Banner Name',
  },

  {
    id: 'publish_date',
    numeric: true,
    disablePadding: false,
    label: 'Publish date ',
  },

  // {
  //   id: 'total_products',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Total Products',
  // },
  
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Link Category',
  },

  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },

];

function EnhancedTableHead(props) {
  const { onSelectAllClick,order, orderBy, numSelected, rowCount, onRequestSort , countVendor } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow  >
      <TableCell padding="2">
          {/* <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          /> */}
          #
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'none'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{textTransform:"uppercase"}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected,countVendor} = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { authState} = UseContextState();
  

  return (
    <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && {
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }),
    }}
  >


{numSelected > 0 ? (
      <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>
    ) : 
      (<div className='flex-justify-between ' style={{width:'100%',paddingTop:6,paddingRight:6}}  >
        <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {`All Banners (${props.countVendor})`}
      </Typography>
        <Button className='add_banner_btn' variant="contained" style={{width:'20%'}} component="label" startIcon={<Iconify icon="eva:plus-fill" />}>
        Add Banner
               <input hidden accept="image/*" onChange={props.addNewBanner}  type="file" />
           </Button>
              
      </div>
    )
      } 

      <Tooltip title="Filter list">
          <>
      
        {numSelected > 0 && (
      <Tooltip title="More">
        <IconButton>
       


      
          <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref} onClick={() => setIsOpen(true)} fontSize='medium' />
    {/* <Menu
      open={isOpen}
      anchorEl={ref.current}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: { width: 200, maxWidth: '100%' },
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
       <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}>
        <ListItemIcon>
          <Iconify icon="eva:edit-fill" width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>
      <MenuItem sx={{ color: 'text.secondary' }}>
        <ListItemIcon>
          <Iconify icon="eva:trash-2-outline" width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>

     
    </Menu> */}

        </IconButton>
      </Tooltip>
    ) }
  </>

      </Tooltip>
    
  </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Banners() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filterName, setFilterName] = useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [ data, setData ] = useState([])
  const [ categoryForLinkBanner, setCategoryForLinkBanner ] = useState([])
  const [ selectedBannerCategory, setSelectedBannerCategory ] = useState()
  const [ updateCategoryBtn, setUpdateCategoryBtn ] = useState()
  const [ countVendor, setCountVendor ] = useState(0)
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [message ,setMessage] = useState({type:"",message:""})
  const [render , setRender ] = useState(false)
  const [ openRemoveImageModal , setOpenRemoveImageModal ] =useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ openPopupModal, setOpenPopupModal ] = useState(false)
  const [ openImageGuidePopupModal, setOpenImageGuidePopupModal ] = useState(false)
  const [fileUpload , setFileUpload ] = useState()
  const [openBannerLimitModal, setOpenBannerLimitModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [ loading, setLoading  ] =useState(false);
  const [ addBannerFileUpload , setaddBannerFileUpload ] = useState()
  const open = Boolean(anchorEl);
  const {authState} = UseContextState()
  console.log("all Banners===",data)
  const navigate = useNavigate()

  const goToImageCompressor=()=>{
    navigate('/dashboard/tools-and-services/imagecompressor')
  }

  // ================== GET ALL Banners ==============
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/banners`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res?.data);
      // setData(res?.data);
      setData(res?.data?.allbanners);
      setCategoryForLinkBanner(res?.data?.category);
      setCountVendor(res?.data?.allbanners?.length)
      setLoading(false)
      
    })
    .catch(err=>{
      console.log(err)
      setLoading(false)
    })
  },[render])
  // ================== GET ALL Banners ==============



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const handleCloseSubCateConfirmModal=(i)=>{
  console.log("CLOSE MODAL",i)
  let closeModalState=[...openRemoveImageModal]
  closeModalState[i] = false
  setOpenRemoveImageModal(closeModalState)
}

const handleOpenRemoveImageModal=(i,value)=>{
    console.log("openModal ==",i ,"-==",value)
    let newModalState=[...openRemoveImageModal]
    newModalState[i] = value 
    setOpenRemoveImageModal(newModalState)
  
  }
// REMOVE BANNER IMAGE
const handleRemoveBannerImage=async(i,bannerId,image_name,image_path)=>{
    console.log(" DELETE BANNER ==",bannerId,image_name,image_path)
      let closeModalState=[...openRemoveImageModal]
      closeModalState[i] = false
      setOpenRemoveImageModal(closeModalState);
      deleteImageFromFirebase(image_path,image_name)
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/delete/banner/by/id/${bannerId}`,{},{headers: {
        'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
      },withCredentials:true})
      .then(res=>{
        console.log(res)
       if(res?.data?.status === true){
        setMessage((prev)=>({...prev,type:"success",message:"Banner Deleted Successfully !"}))
        setSnackbarOpen(true)
        setRender(prev=>!prev)
        
       }
       else{
        setMessage((prev)=>({...prev,type:"error",message:"Banner Deleted Failed !"}))
        setSnackbarOpen(true)
        setRender(prev=>!prev)
       }
      
      })
      .catch(err=>{
        let closeModalState=[...openRemoveImageModal]
        closeModalState[i] = false
        setOpenRemoveImageModal(closeModalState);
        setMessage((prev)=>({...prev,type:"error",message:"Banner Deleted Failed !"}))
        console.log(err)
      })    
  }

// add new banner
const addNewBanner = async(e)=>{
    console.log("e.target.files e.target.files e.target.files ==========>>>>>>>>",e.target.files )
    if(e.target.files?.length == 0 ) {
      setLoading(false)
      return 
    }
    if(e.target.files){
      for(let i=0;i<e.target.files?.length;i++){
        if(e.target.files[i]?.size > editable_config?.BannerUploadSize){
          console.log("e.target.files[i]?.size----",e.target.files[i]?.size);
          setFileUpload(null)
          setLoading(false)
          setOpenPopupModal(true); 
          return
        }else{ setLoading(false);setFileUpload(null)}
      }
    }
    if(e.target.files?.length > 1) {
      setLoading(false)
      return alert("You can only select 1 images");
    }
    setLoading(true)
    // console.log(e.target.files[0])
    let allImages = [...e.target.files]
    setaddBannerFileUpload(allImages)
   const bannersToFirebase = await uploadFileToFirebase(`/${process.env.REACT_APP_IMAGES_FOLDER_NAME}/users/${authState?.user?.app_id}/banners/${e.target?.files[0]?.name}/`,e.target.files[0]);
//    console.log("IMAGES AFTER FIREBASE",bannersToFirebase);
    if(bannersToFirebase.image_url){
     await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add/new/banner`,{...bannersToFirebase},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
        .then(res=>{
            console.log(res?.data);
            setMessage((prev)=>({...prev,type:"success",message:"Banner Added Successfully !"}))
            setSnackbarOpen(true)
            setRender(prev=>!prev);
            setLoading(false)
        })
        .catch(err=>{
            console.log(err);
            setMessage((prev)=>({...prev,type:"error",message:"Banner Not Uploaded !"}))
            setSnackbarOpen(true)
            setRender(prev=>!prev);
            setLoading(false)
        })
    }
}


// CHANGE BANNER 
const handleFileUpload =async(bannerId,e)=>{
    // console.log(e)
    if(e.target.files){
      for(let i=0;i<e.target.files?.length;i++){
        if(e.target.files[i]?.size > editable_config?.BannerUploadSize){
          console.log("e.target.files[i]?.size----",e.target.files[i]?.size);
          setFileUpload(null)
          setLoading(false)
          setOpenPopupModal(true); 
          return
        }else{ setLoading(false);setFileUpload(null)}
      }
    }
    if(e.target.files?.length > 1){
      alert("You can only select 1 images");
      setLoading(false)
      return
    }
    setLoading(true)
    // console.log(e.target.files[0])
    let allImages = [...e.target.files]
    setaddBannerFileUpload(allImages)
   const bannersToFirebase = await uploadFileToFirebase(`/${process.env.REACT_APP_IMAGES_FOLDER_NAME}/users/${authState?.user?.app_id}/banners/${e.target?.files[0]?.name}/`,e.target.files[0]);
//    console.log("IMAGES AFTER FIREBASE",bannersToFirebase);
    if(bannersToFirebase.image_url){
     await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/change/banner/by/id/${bannerId}`,{...bannersToFirebase},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
        .then(res=>{
            console.log(res?.data);
            if(res?.data?.status){
                deleteImageFromFirebase(res?.data?.previous?.path,res?.data?.previous?.image_name)
                setMessage((prev)=>({...prev,type:"success",message:"Banner Change Successfully !"}))
                setSnackbarOpen(true)
                setRender(prev=>!prev);
                setLoading(false)
            }
        })
        .catch(err=>{
            console.log(err);
            setMessage((prev)=>({...prev,type:"error",message:"Banner Not Changed !!"}))
            setSnackbarOpen(true)
            setRender(prev=>!prev);
            setLoading(false)
        })
    }


  }
  // console.log(fileUpload)

    // ===== HANDLE CHANGE BANNER BANNER CATEGORY ========
    const handleChangeBannerCategory = (_id,value,index)=>{
      setSelectedBannerCategory((prev)=>({bannerId:_id,select_category:value,}))
      let updateBannerCate=data
      for(let i=0;i<updateBannerCate?.length;i++){
        if(updateBannerCate[i]._id == _id){
          updateBannerCate[i].selected_category =value
        }
      }
      setData(updateBannerCate)
      setUpdateCategoryBtn((prev)=>({index:index,status:true}))
  
    }
    // ===== HANDLE CHANGE BANNER BANNER CATEGORY ========

    //========= CHANGE BANNER CATEGORY LINK ===========
    const handleUpdateBannerCategory = async(banner_id,category)=>{
      console.log("handleUpdateBannerCategory ",banner_id,category)
      setLoading(true)
  await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/link/banner/to/category/by/id/${banner_id}`,{selected_category:category},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
  .then(res=>{
      console.log(res?.data);
      if(res?.data?.status){
          setMessage((prev)=>({...prev,type:"success",message:"Banner Link Change Successfully !"}))
          setSnackbarOpen(true)
          setRender(prev=>!prev);
          setLoading(false)
          setUpdateCategoryBtn()
      }
  })
  .catch(err=>{
      console.log(err);
      setMessage((prev)=>({...prev,type:"error",message:"Banner Link Not Changed !!"}))
      setSnackbarOpen(true)
      setRender(prev=>!prev);
      setLoading(false)
  })
  
    }
  
    //========= CHANGE BANNER CATEGORY LINK ===========

      //############################# IMAGE SIZE ERROR MODAL FUNCTION #############################
  const handleClosePopupModal=()=>{
    setOpenPopupModal(false); 
    setLoading(false)
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
  //############################# IMAGE SIZE ERROR MODAL FUNCTION #############################

   //############################# IMAGE GUIDE LINE MODAL FUNCTION #############################
   const handleCloseImageGuidelinePopupModal=()=>{
    setOpenImageGuidePopupModal(false); 
    // setIsOpen2(false)
  }
const handleOpenImageGuidelinePopupModal=()=>{
    setOpenImageGuidePopupModal(true); 
    // setIsOpen2(false)
  }

  //############################# IMAGE GUIDE LINE MODAL FUNCTION #############################


  //############################# BANNER LIMIT MODAL FUNCTION #############################
  const handleCloseBannerLimitModal=()=>{
    setOpenBannerLimitModal(false)
  }
  
  const handleOpenBannerLimitModal=()=>{
    setOpenBannerLimitModal(true)
  }
  //############################# BANNER LIMIT MODAL FUNCTION #############################
 
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
      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    {/* #################### LOADING SPINNER ######################## */}

      

     {/*===== IMAGE SIZE ERROR Popup  Modal ====== */}
 <PopupModal handleClose={handleClosePopupModal}open={openPopupModal} data={<ImageError handleClose={handleClosePopupModal} onYes={onYesFunction}  confirmBtnName='Image Compress Now' title='Reduce Image Size!! ' message='Max banner upload size is 1 MB.  For more read our image upload guidelines.'  />} />
        {/*===== IMAGE SIZE ERROR Popup Modal ====== */}
       {/*===== Popup Modal ====== */}
       <PopupModal handleClose={handleCloseImageGuidelinePopupModal}open={openImageGuidePopupModal} data={<ImageGuidelines handleClose={handleCloseImageGuidelinePopupModal}  />} />
        {/*===== Popup Modal ====== */}
    <div className='custom-conatiner'>
         {/* #################### SANCKBAR MESSAGE ######################## */}
    <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
    {/* #################### SANCKBAR MESSAGE ######################## */}

    <Box sx={{ width: '100%' }}>
  
      <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}>
     
      {/* <VendorListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
      {/* <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
        <EnhancedTableToolbar numSelected={selected.length} countVendor={countVendor} addNewBanner={addNewBanner} />
        <TableContainer  >
          <Table
          
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.length}
              
            />
           
              <TableBody className='banner_table_body'>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(data, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <>
           <ConfimModal open={openRemoveImageModal[index]} title="Delete Banner" onYes={()=>handleRemoveBannerImage(index,row?._id,row?.image_name,row?.path)} message="Are you sure you want to delete banner?" handleClose={()=>handleCloseSubCateConfirmModal(index)}  />

                    <TableRow
                      hover
                     
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="2">
                        {/* <Checkbox
                          color="primary"
                          onClick={(event) => handleClick(event, row._id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        /> */}
                        #
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                         style={{textTransform:'capitalize'}} 
                      >
                         {/* <a target='_blank' href={row?.image_url} > */}
                        <img className='banner-table-image' alt="product" src={row?.image_url ? `${row?.image_url}` : noImage  } />
                        {/* </a> */}
                        {/* <img className='banner-table-image' alt="product" src='https://firebasestorage.googleapis.com/v0/b/shop-daba0.appspot.com/o/banner.webp?alt=media&token=31da54ac-d9e6-4b1a-ae43-49b3c0c89744' /> */}
                      </TableCell>
                      <TableCell style={{textTransform:'capitalize'}} align="left">{returnFileName(row?.image_name)?.slice(0,15)}</TableCell>

                      <TableCell align="center"><p>{convertDate(row?.updatedAt)}</p></TableCell>
                      {/* <TableCell align="right">{row.total_products}</TableCell> */}
                      {/* <TableCell align="right">{''}</TableCell> */}
                      <TableCell align="center">
                      <div   style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
                    <TextField  style={{textTransform:'capitalize',width:140}} 
                    labelId="demo-select-small" id="demo-select-small" className='select_field'
                    value={row?.selected_category}
                    onChange={(e)=>handleChangeBannerCategory(row?._id,e.target?.value,index)}
                     name='product_subcategory'    
                     label="Select Category"
                     size='small'
                      select
                      SelectProps={{
                        isNative:true,
                      }
                      }
                      >
                    {categoryForLinkBanner?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?._id}>{value?._id}</MenuItem>

                    ))}
                    </TextField>
                    <Button disabled={updateCategoryBtn?.index == index ? false: true} sx={{marginLeft:2}}  onClick={()=>handleUpdateBannerCategory(row?._id,selectedBannerCategory.select_category)}
                     variant="contained" startIcon={<Iconify icon="material-symbols:check-circle-outline-rounded" />} > Update</Button>
                    </div>
                      </TableCell>
                      <TableCell align="center">
                        {/* <EditOutlinedIcon fontSize='small' /> */}
                         {/* <VisibilityOutlinedIcon fontSize='small' /> */}
                         {/* <Button variant="contained" style={{boxShadow:'none'}}  startIcon={<Iconify icon="eva:plus-fill" />}> 
          
               </Button> */}
               <Button variant="text" style={{boxShadow:'none'}} component="label" startIcon={<Iconify icon="akar-icons:edit" />}>
               Change
                      <input hidden accept="image/*" onChange={(e)=>handleFileUpload(row?._id,e)} multiple type="file" />
                  </Button>

               <Button onClick={()=>handleOpenRemoveImageModal(index,true)} variant="text" style={{color:'#de040c',marginLeft:8,boxShadow:'none'}} className='banner_delete_btn'  startIcon={<Iconify icon="eva:trash-2-outline" />}> 
           Delete
               </Button>
                          </TableCell>
                    </TableRow></>
                  );
                })}
                 {!data.length >0 &&   <TableCell colSpan={12}> <div className='search-not-found' >
                  <img className='search-not-found-img' src={searchNotFound} alt="searchNotFound" />
                  <Typography
          
          variant="h6"
          id="tableTitle"
          component="div"
          sx={{color:'#ababab'}}
        >
          No Banners Found!! 
        </Typography>
                </div> </TableCell> }
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          // rowsPerPageOptions={[5, 10, 25]}
          rowsPerPageOptions={[25]}
          component="div"
          count={countVendor}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    </div>
    </>
  );
}
