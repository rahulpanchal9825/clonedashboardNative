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
import LoadingSpinner from '../components/Spinner';
import { convertDate ,getGapBetweenDates} from '../global/globalFunctions';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import ConfimModal from "../global/Modals/ConfimModal"
import CustomizedSnackbars from '../global/Snackbar/CustomSnackbar';
import Iconify from 'src/components/Iconify';
import palette from 'src/theme/palette';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Order from "./Orders";
import Deliveryandpaymentintegration from "../pages/SettingTabs/Delivery_And_PaymentIntegration"
import InvoiceDetails from "../pages/SettingTabs/InvoiceDetails"
import AboutPhone from './SettingTabs/AboutPhone';
import AppSigning from './SettingTabs/AppSigning';
import SocialLinks from './SettingTabs/SocialLinks';
import VideoModal from 'src/global/Modals/VideoModal';
import { editable_config } from 'src/editable_config';
import Configuration from './SettingTabs/Configuration';




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
  const {authState} = UseContextState()
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [snackbarOpen,setSnackbarOpen ] = useState(false);
  const [settingDetails,setSettingDetails ] = useState({delivery_charges:'0',
                                                cash_on_delivery:true,
                                                razorpay_key_id:'',                             
                                                razorpay_key_secret:''});
const [value, setValue] = React.useState(0);

const handleChange = (event: React.SyntheticEvent, newValue: number) => {
                                                  setValue(newValue);
                                                };
                                              
                                              






  // handle close video modal
  function handleCloseVideoModal(){
    setOpenVideoModal(false)
  }
  
  
  // handle open video modal
  function handleOpenVideoModal(){
    // setOpenVideoModal(true)
    const url ="https://google.com/"
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  

  return (
    <>
    <LoadingSpinner loading={loading} />
    <div className='custom-conatiner'>
    
    </div>

                      {/* ------------------ */}
                      <div >
    <div className='custom-conatiner'>
    <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}>

      <Box sx={{ maxWidth: {  sm: 480 }, bgcolor: 'background.paper' }}>
        <div className='setting_page_items' >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        <Tab label="Invoice Setting" />
        <Tab label="Delivery & Shipping" ></Tab>
        <Tab label="Social Media" />
        {/* <Tab label="App Signing" /> */}
        <Tab label="About Your App" />
        <Tab label="Configuration" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InvoiceDetails />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Deliveryandpaymentintegration />
      </TabPanel>
      <TabPanel value={value} index={2}>
      <SocialLinks/>
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
      <AppSigning/>
      </TabPanel> */}
      <TabPanel value={value} index={3}>
      <AboutPhone/>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Configuration/>
      </TabPanel>
      </div>
    </Box>
    </Paper>
    </div>
    </div>

                      {/* ----------------- */}

    </>
  );
}
