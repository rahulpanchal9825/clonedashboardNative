import * as React from 'react';
import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import { Toolbar,FormControlLabel, Tooltip,Menu,Switch, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';
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
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import LoadingSpinner from '../../components/Spinner';
import { convertDate ,getGapBetweenDates} from '../../global/globalFunctions';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import ConfimModal from "../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../global/Snackbar/CustomSnackbar';
import Iconify from 'src/components/Iconify';
import palette from 'src/theme/palette';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Order from ".././Orders";
import { editable_config } from 'src/editable_config';
import imageImport from 'src/utils/imageImport';




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

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


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
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  // {
  //   id: 'cust_id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Cust ID',
  // },
  {
    id: 'name',
    numeric: true,
    disablePadding: true,
    label: ' Name',
  },
  {
    id: 'joining_date',
    numeric: false,
    disablePadding: true,
    label: 'Registered Date',
  },

  // {
  //   id: 'email',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Email',
  // },

  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'user_mail',
    numeric: true,
    disablePadding: false,
    label: 'Mail',
  },
  // {
  //   id: 'orders',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Orders',
  // },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'State',
  },
  
  {
    id: 'View',
    numeric: false,
    disablePadding: false,
    label: 'View',
  },
  

];

function EnhancedTableHead(props) {
  const { onSelectAllClick,order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow  >
      <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'normal' : 'normal'}
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
  const { numSelected } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  

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
        (<Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          All Settings {`(${props.usersCount})`} 
        </Typography>
      )
        } 
 
        <Tooltip title="Filter list">
            <>
        
          {/* {numSelected > 0 && (
        <Tooltip title="More">
          <IconButton>
            <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref} onClick={() => setIsOpen(true)} fontSize='medium' />
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={()=>props.setOpenDeleteConfimModal(true)} >
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete User"  primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

       
      </Menu>

          </IconButton>
        </Tooltip>
      )} */}
     

    </>

        </Tooltip>
      
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [selected, setSelected] = React.useState([]);
  const [isOpen2, setIsOpen2] = useState(false);
  const [loading, setLoading ] = useState(false);
  const [ openDeleteConfimModal, setOpenDeleteConfimModal ] = useState(false)
  const [render , setRender ] = useState(false)
  const [filters , setFilters ] = useState({by_status:'all',recentDays:'All'})
  const [message ,setMessage] = useState({type:"",message:""})
  const [snackbarOpen,setSnackbarOpen ] = useState(false);
  const {authState} = UseContextState()
  const [settingDetails,setSettingDetails ] = useState({delivery_charges:'0',
                                                cash_on_delivery:true,
                                                razorpay_key_id:'',                             
                                                razorpay_key_secret:''});
const [value, setValue] = React.useState(0);

const handleChange = (event: React.SyntheticEvent, newValue: number) => {
                                                  setValue(newValue);
                                                };
                                              
                                              

console.log("settingDetails --------->>>>>>",settingDetails)


// ======================== GET SETTINGS DETAILS ===============
useEffect(()=>{
  setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/deliverycharges/and/paymentsdetails/by/id/${authState?.user?.app_id}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        console.log(res);
        setSettingDetails(res?.data?.data)
        setLoading(false)

    })
    .catch(err=>{
        console.log(err)
    })
},[render])
// ======================== GET SETTINGS DETAILS ===============



// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};
// ##################### SNACK BAR FUNCTIONs ##################

//############################# CLOSE DELETE CONFIRM MODAL FUNCTION #############################
const handleCloseConfimModal=()=>{
  setOpenDeleteConfimModal(false); 
  setIsOpen2(false)
}
//############################# CLOSE DELETE CONFIM MODAL FUNCTION #############################

// ====================== UPDATE SETTINGS ==================================
const handleUpdateSettings = async(setingsData)=>{
    const data = {delivery_charges:setingsData?.delivery_charges != "" && settingDetails?.delivery_charges != '0' ? setingsData?.delivery_charges : '0',
    cash_on_delivery:setingsData?.cash_on_delivery,
    // razorpay_key_id:setingsData?.razorpay_key_id?.length ? setingsData?.razorpay_key_id : '',                             
    // razorpay_key_secret:setingsData?.razorpay_key_secret?.length ? setingsData?.razorpay_key_secret : '',
  }
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/edit/deliverycharges/and/paymentsdetails/${authState?.user?.app_id}`,{...data},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        // console.log(res)
        if(res?.data?.status === true){
            setMessage((prev)=>({...prev,type:'success',message:'Settings Updated Successfully !!'}))
            setSnackbarOpen(true);
            setRender(prev=>!prev)
        }
        if(res?.data?.status === false){
            setMessage((prev)=>({...prev,type:'error',message:'Settings Updated Failed !!'}))
            setSnackbarOpen(true);
            setRender(prev=>!prev)

        }
    })
    .catch(err=>{
        console.log(err)
        setMessage((prev)=>({...prev,type:'error',message:'Settings Updated Failed !!'}))
        setSnackbarOpen(true);
    })
}
// ====================== UPDATE SETTINGS ==================================






  return (
    <>
    <LoadingSpinner loading={loading} />
   
     {/* #################### SANCKBAR MESSAGE ######################## */}
 <CustomizedSnackbars style={{padding:'0px !important'}} onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
 {/* #################### SANCKBAR MESSAGE ######################## */}
    <div className=''>
    <Box sx={{ width: '100%' }}>

    {/* <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}> */}
   <div className='product-topbar-box vendor-topbar-box ' >
    <h2 className='flex' > Delivery</h2>
     {/* CONFIRM MODAL */}
     <ConfimModal open={openDeleteConfimModal} title="Delete" message="Do you want to delete?" handleClose={handleCloseConfimModal}  />
       {/* CONFIRM MODAL */}
   {/* <div className='category-topbar-btn' >
   <CsvDownloadButton className='download-table-xls-button'  data={data} filename="users" >
   <Button className='hide-mobile' variant="outlined"  startIcon={<Iconify icon="akar-icons:download" />}> 
                  Export
                     </Button>
   </CsvDownloadButton>
   </div> */}
         </div>
         <div className=' settings-container ' >
   <div className='flex delivery_charge_and_field' >
   <div>
   <h4>Delivery & Shipping Charges</h4>
<span style={{color:palette.primary.main,fontSize:12,fontWeight:'600'}} >Default will be 0</span>
   </div>
   
   <div className='settings_label_input'>
                    {/* <label htmlFor=""> De </label> */}
                    <TextField 
                    label='Delivery & Shipping Charges'
                      type='number'
                      fullWidth 
                     className='product_form_input' 
                     id="outlined-basic" 
                     placeholder='0'
                     value={settingDetails?.delivery_charges}
                     onChange={(e)=>setSettingDetails(prev=>({...prev,delivery_charges:e.target.value}))}
                     name="email"
                    variant="outlined"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                         />
                    </div>
   </div>
   <div className="flex">
   <h4>Cash on Delivery</h4>
   <div className='settings_label_input'>
   
   <FormControlLabel control={<Switch 
     checked={settingDetails?.cash_on_delivery}
     onChange={(e)=>setSettingDetails(prev=>({...prev,cash_on_delivery:e.target.checked}))}
   />} label="ON/OFF" />
                    </div>
   </div>
  {/* <div className='payment-setting-box' >
  <h2 style={{paddingBottom:15}} >Payment Settings</h2>
 

   <img className='razoryPay_Logo' src={imageImport.razoryPay_Logo} alt="razoryPay_Logo" srcset="" />
   <div className='flex' >
   <h4>Razorpay Key ID</h4>
   <div className='settings_label_input' style={{width:'40%'}} >

                    <TextField 
                    label='Razorpay Key ID'
                    type='text'
                      fullWidth 
                     className='product_form_input' 
                     id="outlined-basic" 
                     placeholder='Your Razorpay Key ID.'
                     name="email"
                    variant="outlined"
                    value={settingDetails?.razorpay_key_id}
                    onChange={(e)=>setSettingDetails(prev=>({...prev,razorpay_key_id:e.target.value}))}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Iconify icon="mingcute:key-1-line"/></InputAdornment>,
                      }}
                         />

                    </div>
   </div>
   <div className='flex' >
   <h4>Razorpay Key Secret</h4>
   <div className='settings_label_input' style={{width:'40%'}} >
                    <TextField 
                    label='Razorpay Key Secret'
                      type='text'
                      fullWidth 
                     className='product_form_input' 
                     id="outlined-basic" 
                     name="email"
                     placeholder='Your Razorpay Key Secret.'
                    variant="outlined"
                    value={settingDetails?.razorpay_key_secret}
                    onChange={(e)=>setSettingDetails(prev=>({...prev,razorpay_key_secret:e.target.value}))}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Iconify icon="mingcute:key-1-line" /> </InputAdornment>,
                      }}
                         />

                    </div>
   </div>
  </div> */}


  
   <div></div>
   <div style={{paddingTop:20}} >

{/* <Button  variant='text' style={{marginRight:"10px"}}  startIcon={<Iconify icon="akar-icons:arrow-back" />} > Go Back  </Button> */}

 <Button   variant='contained'  onClick={()=>handleUpdateSettings(settingDetails)}  startIcon={<Iconify icon="bxs:check-circle" />} >Save Changes </Button>

</div>
   </div>
 
    {/* </Paper> */}
    </Box>
    </div>

                      

    </>
  );
}
