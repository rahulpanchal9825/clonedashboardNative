import React, { useState,useRef, useEffect } from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { alpha } from '@mui/material/styles';
import { addDays } from 'date-fns';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import LoadingSpinner from '../../../components/Spinner';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../../components/Iconify';
import ReorderIcon from '@mui/icons-material/Reorder';
import {convertDateForOrder} from "../../../global/globalFunctions"
import noImage from '../../../assests/No_image.svg'
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import palette from '../../../theme/palette';
import ConfimModal from "../../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DateRangePicker } from 'react-date-range';
import searchNotFound from "../../../assests/searchnotfound.gif"
import CsvDownloadButton from 'react-json-to-csv'
import emailjs from '@emailjs/browser';
import { config } from 'src/global/globalConfig';
import { editable_config } from 'src/editable_config';
import SideDrawer from 'src/global/Drawer';
import InvoicePreview from './InvoicePreview';
import VideoModal from 'src/global/Modals/VideoModal';





function createData(name, calories, fat, carbs, protein,amount,status) {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
      amount,
      status
    };
  }
  

const rows = [
    createData('Cupcake', 305, 3.7, 67, "COD", 40,"pending"),
    createData('Donut', 452, 25.0, 51, "COD", 100,"cancel"),
    createData('Eclair', 262, 16.0, 24, "COD", 100,"delivered"),
    createData('Frozen yoghurt', 159, 6.0, 24, "COD", 100,"delivered"),
    createData('Gingerbread', 356, 16.0, 49, "COD", 10,"pending"),
    createData('Honeycomb', 408, 3.2, 87, "COD", 100,"pending"),
    createData('Ice cream sandwich', 237, 9.0, 37, "COD", 100,"pending"),
    createData('Jelly Bean', 375, 0.0, 94, "COD", 100,"processing"),
    createData('KitKat', 518, 26.0, 65, "COD", 20,"processing"),
    createData('Lollipop', 392, 0.2, 98, "COD", 100,"processing"),
    createData('Marshmallow', 318, 0, 81, "COD", 100,"pending"),
    createData('Nougat', 360, 19.0, 9,"COD", 100,"cancel"),
    createData('Oreo', 437, 18.0, 63, "COD", 100,"cancel"),
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
    stabilizedThis?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
  }
  
  const headCells = [
    

    {
      id: 'product',
      numeric: false,
      disablePadding: true,
      label: 'Product',
    },
    {
      id: 'Product Code',
      numeric: true,
      disablePadding: false,
      label: 'Product Code',
    },
  
    {
      id: 'quantity',
      numeric: true,
      disablePadding: false,
      label: 'Quantity',
    },
    {
      id: 'price',
      numeric: true,
      disablePadding: false,
      label: 'Price',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'amount',
      numeric: true,
      disablePadding: false,
      label: 'Amount',
    },
   
  ];
  
  
  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
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
    const { numSelected,handleChangeProductDelivery } = props;
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const ref2 = useRef(null);
    const [isOpen2, setIsOpen2] = useState(false);
    

  
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
            {`All Ordered Products (${props.orderCount})` }
          </Typography>
        )
          } 
   
          <Tooltip title="Filter list">
              <>
          
            {numSelected > 0 && (
          <>
            <IconButton>
           
  
  
          
              <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref2} onClick={() => setIsOpen2(true)} fontSize='medium' />
        <Menu
          open={isOpen2}
          anchorEl={ref2.current}
          onClose={() => setIsOpen2(false)}
          PaperProps={{
            sx: { width: 230, maxWidth: '100%' },
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
           <MenuItem onClick={()=>handleChangeProductDelivery(true)} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="mdi:truck-check" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Marked as Shipped" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          <MenuItem onClick={()=>handleChangeProductDelivery(false)} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="mdi:truck-remove-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Un-Marked as Shipped" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
  
         
        </Menu>
  
            </IconButton>
          </>
        ) }
      </>
  
          </Tooltip>
        
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

function ViewOrder({handleClose}) {
    const [ render, setRender ] = useState(false);
    const [ loading, setLoading] = useState(false)
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [openConfimModal ,setOpenConfimModal] = useState(false);
  const [ userData, setUserData ] = useState([])
  const [message ,setMessage] = useState({type:"",message:""})
  const [ orderDetail, setOrderDetail ] = useState({});
  const [ orderStatus , setOrderStatus ] = useState([]);
  const [  updateBtn ,   setUpdateBtn] = useState(false)
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
    const [filterName, setFilterName] = useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ ordersCount ,setOrdersCount ] =useState(0);
  const [ shippedProductsCount ,setShippedProductsCount ] =useState(0);
  const [ allOrders , setAllOrders ] = useState()
  const [ invoiceLoading , setInvoiceLoading ] = useState(false)
  const [filters , setFilters ] = useState({by_status:'all',recentDays:'All'})
  const [age, setAge] = React.useState('');
  const [drawerEditOrders, setDrawerEditOrders] = React.useState(false);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const {order_id} = useParams(); 
  const navigate = useNavigate(); 
  const orderId = order_id

  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      startDate: '',
      endDate: '',
      key: 'selection'
    }
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const currentDate = new Date().toLocaleString();

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };





  console.log("shippedProductsCount = = =>",shippedProductsCount)
  // console.log("selected = = =>",selected)
  // console.log("orderId",orderId)
  // console.log("USER DATA",orderDetail)

  //##################### GET ORDER BY ID #####################
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/order/by/id/${orderId}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log("ORDER",res);
      setOrderDetail(res?.data?.result);
      setOrderStatus(res?.data?.order_status);
      setOrdersCount(res?.data?.result?.products?.length)
      setLoading(false);
    })
    .catch(err=>{
        console.log(err);
        setLoading(false)
    })
  },[render])
  //##################### GET ORDER BY ID #####################


  //##################### Handle order status change #####################
  const handleOrderStatusChange=(e)=>{
    setOrderDetail((prev)=>({...prev,order_status:e.target.value}));
    setUpdateBtn(true)
}



  //##################### Handle submit  #####################

  const handleSubmit=async(e)=>{
    // if(shippedProductsCount > 0 && orderDetail?.order_status === 'partial shipped' ){
    //   sendEmailWhenOrderPartialShipped(orderDetail)
    // }
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/change/order/status/${orderId}`,{...orderDetail},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        console.log(res);
        if(res?.data?.status === true){
            setMessage((prev)=>({...prev,type:"success",message:"Order Status Updated Successfully !!"}))
            setSnackbarOpen(true)
            setRender(prev=>!prev)
            
           }
           else{
            setMessage((prev)=>({...prev,type:"error",message:"Unexcepted Error Occur !!"}))
            setSnackbarOpen(true)
            setRender(prev=>!prev)
           }
        
    })
    .catch(err=>{
        console.log(err);
    })
  }

  //##################### Handle submit  #####################


  // ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderDetail?.products?.map((n,) => n?._id);
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


    // DECREASE QUANTITY FUNCTION
    const decreaseQuantity=async(product_id)=>{
      let updateProduct = orderDetail?.products;
      orderDetail?.products?.map((value,index)=>{
        if(value._id == product_id ){
          if(value.product_quantity > 0){
            // console.log("FIND>>>>")
            updateProduct[index] ={...value,product_quantity:value.product_quantity - 1}
            setOrderDetail((prev)=>({...prev,products:updateProduct}))
            console.log(updateProduct,'updated products quantity')
            setUpdateBtn(true)
          }
        
        }
      })
      return;
     }
    
  // INCREASE QUANTITY FUNCTION
  const increaseQuantity=async(product_id)=>{
    let updateProduct = orderDetail?.products;
    orderDetail?.products?.map((value,index)=>{
      if(value._id == product_id ){
        // console.log("FIND>>>>")
        updateProduct[index] ={...value,product_quantity:value.product_quantity + 1}
        setOrderDetail((prev)=>({...prev,products:updateProduct}))
        console.log(updateProduct,'updated products quantity')
        setUpdateBtn(true)
      }
    })
  }

  // handle transportion field 
  const handleTransportDetails = async(e)=>{
    setOrderDetail((prev)=>({...prev,ordered_products_transport_detail:e.target.value}))
    setUpdateBtn(true)
  }

  // handle change product delivery status 
  const handleChangeProductDeliveryStatus = async(productStatus)=>{
    console.log("FUNC RUNS")
    // for sending email to shipped products
    if(productStatus === true){
      console.log("RUNS SHIPPED ")
      orderDetail?.products?.map(product=>{
        if(product?.product_delivery_status === true){
          console.log("ALREADY TRUE")
          return;
        }
        else{
          console.log("SHIPPED-----")
          setShippedProductsCount(selected?.length)
        }
      })
    }
    // for sending email to shipped products
    let updateProductStatus = orderDetail?.products;
    orderDetail?.products?.map((value,index)=>{
      console.log("FUNC RUNS 2")
      selected?.map(product_id=>{
        console.log("FUNC RUNS 3",product_id," ==== ",productStatus,"-----",value)
        if(value._id == product_id ){
          console.log("FIND TRUE")
          // console.log("FIND>>>>")
          updateProductStatus[index] ={...value,product_delivery_status:productStatus}
          setOrderDetail((prev)=>({...prev,products:updateProductStatus}))
          console.log(updateProductStatus,'updated products Status')
          setUpdateBtn(true)
        }
      })
     

    })
    
  }


  // const pdfExportComponent = useRef(null);

  // const handleExportWithComponent = event => {
  //   pdfExportComponent.current.save();
  // };



  //############################# INVOICE PREVIEW SIDE BAR DRAWER FUNCTION #############################
  const handleOpenEditOrderSidebar=()=>{
    setDrawerEditOrders(true)
  }
  
  const  handleCloseEditOrderSideBar =()=>{
      setDrawerEditOrders(false)
      setRender(prev=>!prev)
    }
  //############################# INVOICE PREVIEW SIDE BAR DRAWER FUNCTION #############################

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
     <VideoModal title='Learn how to work with your order?' video_url="https://www.youtube.com/embed/USccSZnS8MQ" isOpen={openVideoModal} handleClose={handleCloseVideoModal} /> 

     <div className='custom-conatiner'>
     <LoadingSpinner loading={loading} />
      {/* #################### SANCKBAR MESSAGE ######################## */}
    
       <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
     
 
 {/* #################### SANCKBAR MESSAGE ######################## */}
 

   {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
    <Paper elevation={4} >
        <Container maxWidth="xl">
    <div className='add-category-pad-top-bot flex-justify-between order_details_and_viwe_invoic_btn'>
      <div>
      {/* <Button  className='product-btn' variant="outlined" startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />}> 
          Back
          </Button> */}
      <div className='inner-page-heading-box' >
        <IconButton sx={{color:'black'}}  onClick={()=>navigate(-1)} >
        <Iconify icon="material-symbols:arrow-back-rounded" />
        </IconButton>
     <div>
     <h2> Order Details</h2>
      {/* <p>  View order and proccess futher </p> */}
     </div>
      </div>
       
      </div>
     <div>
    
     </div>
      <div className='view-order-invoice-export-btn-box' >
      {/* <LoadingButton
         
          onClick={downloadInvoice}
          loading={invoiceLoading}
          loadingPosition="start"
          startIcon={<Iconify icon="basil:invoice-solid" />}
          variant="contained"
        >
          <span>Get Invoice</span>
        </LoadingButton> */}
         
                {/* <Button onClick={handleExportWithComponent}  variant="contained"  startIcon={<Iconify icon="basil:invoice-solid" />}>  
                Get Invoice
                    </Button> */}
                    <CsvDownloadButton className='download-table-xls-button'  data={[orderDetail]} filename="orders" > 
                <Button  variant="text"  startIcon={<Iconify icon="akar-icons:download" />}> 
                Export
                    </Button>
                </CsvDownloadButton>
                 {/*################ INVOICE PREVIEW SIDEBAR  ################*/}
   <SideDrawer state={drawerEditOrders} toggleDrawerClose={handleCloseEditOrderSideBar} toggleDrawerOpen={handleOpenEditOrderSidebar}
           ComponentData={<InvoicePreview orderDetail={orderDetail} handleClose={handleCloseEditOrderSideBar}  />}
           ComponentButton={<Button  className='product-btn' variant="contained" startIcon={<Iconify icon="basil:invoice-solid" />}> 
           View Invoice
          </Button>}
            />
                 {/*################ INVOICE PREVIEW SIDEBAR  ################*/}
               
      </div>
    </div>     
    <div>
    <div className='order-details-main' >
    <div className='flex-justify-between order_date_and_order_price'  >
        <div>
        <h4 className='flex' > <DateRangeIcon /> " {convertDateForOrder(orderDetail?.createdAt)}</h4>
        <p className='order_id_details' style={{fontSize:13,color:'gray',fontWeight:'500',paddingLeft:23,display:'flex',alignItems:'center' }} > Order-ID : {orderDetail?.order_id} 
        {convertDateForOrder(orderDetail?.createdAt)?.split(',')[0] == currentDate?.split(',')[0] && <p className='new_tag_order_list' >New</p> }
         </p>
        {orderDetail?.razorpay_payment_id &&  <p style={{fontSize:13,color:'gray',fontWeight:'500',paddingLeft:23}} > Payment-ID : {orderDetail?.razorpay_payment_id}</p> }
        {orderDetail?.payment_mode &&  <p className='flex payment_mode_and_payment_title' style={{fontSize:13,color:'gray',fontWeight:'500',paddingLeft:23}} > Payment Mode : <p className='payment_mode_style' style={{marginLeft:8,textTransform:'uppercase'}} >{orderDetail?.payment_mode} </p></p> }
       
        </div>
        <div className='flex order_total_and_order_status_changer' >
    {/* {orderDetail?.order_status} */}
        <div className=''  >
          <div className='flex order_total_div' >
        <p style={{color:'#1e1e1e',fontSize:22,fontWeight:'600'}} className="order_total_price" > Order Total = <p style={{color:palette.primary.main,fontSize:22,paddingRight:22,paddingLeft:8,fontWeight:'600'}} > ₹ {orderDetail?.delivery_charges + parseInt(orderDetail?.order_total)}</p> </p> 
        {/* <p style={{color:palette.primary.main,fontSize:22,paddingRight:22,paddingLeft:8,fontWeight:'600'}} > ₹ {orderDetail?.delivery_charges + parseInt(orderDetail?.order_total)}</p> */}
          </div>
         {orderDetail?.delivery_charges > 0 &&   <p style={{fontSize:12,marginTop:-2,color:palette.primary.main,paddingLeft:2,fontWeight:'500'}} > Including ₹{orderDetail?.delivery_charges} Delivery Charges </p>  }
         
        </div>
      {/* <label htmlFor=""> Select Category  </label> */}
                    <TextField style={{textTransform:'capitalize',width:240,paddingRight:10}} className="view_order_select_input_box select_field select_status_of_order"  labelId="demo-select-small" id="demo-select-small"
                     name='order_status' value={`${orderDetail?.order_status}`} onChange={(e)=>handleOrderStatusChange(e)} 
                       select
                       SelectProps={{
                        isNative:true,
                        MenuProps:{PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },}
                      }
                      }
                       >
                   
                    {orderStatus?.map((order,index)=>(
            <MenuItem style={{textTransform:'capitalize'}} key={order?.name} value={order?.name}>{order?.name}</MenuItem>

        ))}  
                    </TextField>

      <Button className='view_order_update_btn' disabled={updateBtn ? false:true} sx={{mx:0,height:54,px:5}} variant="contained" onClick={handleSubmit} >
        Update
      </Button>
        </div>
    </div>
   <div style={{padding:'30px 0px 20px 0px'}} >
   <Divider /> 
   </div>
   <div className='order-detail-table-container' >
   <div  className="order_Details_And_additional_details">
   <div className='customer-order-detail'  >
       <div style={{display:'flex',justifyContent:'flex-start'}} >
       {/* <AccountCircleIcon style={{color:palette.primary.main}} fontSize='large' /> */}
      <div style={{paddingLeft:8,paddingTop:4,}} >
      <h4 style={{letterSpacing:1}} >Customer Details</h4>
     <div style={{fontSize:14,fontWeight:'500',color:'gray',overflow:'scroll'}} >
     {/* <p style={{fontSize:12}} >#{orderDetail?.customer_id}</p> */}
     {/* <p style={{textTransform:'capitalize',fontSize:12}} >Customer-ID : {orderDetail?.customer_id}</p> */}
     <p style={{textTransform:'capitalize'}} >Name : {orderDetail?.customer_name}</p>
     <p>Email :  {orderDetail?.customer_email}</p>
      <p>Mobile-No : +91-{orderDetail?.customer_phone_number}</p>
      {/* <p>Transport Detail :  {orderDetail?.transport_detail}</p> */}
      <p style={{textTransform:'capitalize'}} >Address : {orderDetail?.shipping_address}</p>
      <div className='flex state_and_pincode' >
        <p style={{textTransform:'capitalize',paddingRight:18}} >State : {orderDetail?.state}</p>
        <p style={{textTransform:'capitalize'}} >Pincode : {orderDetail?.pincode}</p>
      </div>
     </div>
      </div>
       
       </div>
   </div>
   {/* TRANSPORTAION DETAILS */}
   <div className='customer-order-detail' style={{marginTop:20}} >
       <div style={{display:'flex',justifyContent:'flex-start'}} >
       <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Additional Details </label>
                    <TextField style={{paddingTop:6}} multiline rows={3} fullWidth
                     className='product_form_input' id="outlined-basic"
                      name="transport_detail"  placeholder="Enter Additional Details (Optional)"
                      value={orderDetail?.ordered_products_transport_detail}
                      onChange={(e)=>handleTransportDetails(e)}
                      variant="outlined" />
                    </div>
       
       </div>
   </div>
   {/* TRANSPORTAION DETAILS */}
   </div>
    <div className='customer-order-detail ' style={{width:'100%'}} >
    <EnhancedTableToolbar orderCount={ordersCount} numSelected={selected.length} handleChangeProductDelivery={handleChangeProductDeliveryStatus} />
    <TableContainer>
          <Table
            sx={{ minWidth: 800 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              
              rowCount={orderDetail?.products?.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(orderDetail?.products, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row?._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?._id}
                      selected={isItemSelected}

                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row._id)}

                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                               <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="2"
                         style={{textTransform:'capitalize',display:'flex',alignItems:'center',gap:'5px'}} 
                      >
                        <img className='product-table-image' alt="product" src={row?.product_images[0]?.image_url ? `${row?.product_images[0]?.image_url}` :noImage } />
                        <div style={{display:'flex',flexDirection:'column'}} >
                          <p style={{fontWeight:'500'}} >
                          {row?.product_name?.slice(0,25) }{row?.product_name?.length > 25 && "..."}
                          </p>
                       <div >
                        {/* {row?.product_color &&  <p className='flex order_product_color' style={{fontSize:12}} >COLOR : <p style={{padding:'10px 10px',borderRadius:3,margin:'0px 5px',backgroundColor:`${row?.product_color}`}} ></p> {row?.product_color}</p>} */}
                        {/* {row?.product_size &&  <p style={{fontSize:12}} >SIZE : {row?.product_size}</p>}
                        {row?.product_weight &&  <p style={{fontSize:12}} >WEIGHT : {row?.product_weight}</p>} */}
                        {(row?.selected_variation && row?.selected_variation[0]) &&  <p style={{fontSize:12}} >{row?.selected_variation[0]}</p>}
                        {(row?.selected_variation && row?.selected_variation[1]) &&  <p style={{fontSize:12}} >{row?.selected_variation[1]}</p>}
                       </div>

                        </div>

                      </TableCell>
                      <TableCell align="center">{row.product_code}</TableCell>
                      {/* <TableCell align="right">{row.fat}</TableCell> */}
                      <TableCell align="center"  >
                      {/* <Button   variant="outline" sx={{px:2,mr:2}} onClick={()=>decreaseQuantity(row?._id)}   >
                      <Iconify icon="ic:round-minus" />
                      </Button> */}
                        {row?.product_quantity}
                        {/* <Button   variant="outline" sx={{px:2,ml:2}} onClick={()=>increaseQuantity(row?._id)}   >
                        <Iconify icon="eva:plus-fill" />
                      </Button> */}
                        </TableCell>
                        <TableCell align="left"> 
                      <p style={{textDecorationLine:'line-through',fontSize:12,color:'#ff0000ab',fontWeight:'500'}} > ₹{ row?.product_regular_price}</p>
                    <p style={{color:palette.primary.main,fontWeight:'600'}} > ₹{ row?.product_sale_price}</p>
                        </TableCell>
                      {/* <TableCell align="center"  >
                      <p className={row?.product_quantity_by == 'cartoon' ? "order_delivered" : row?.product_quantity_by =='piece' ? 'order_pending': '' }  >
                          
                          {row?.product_quantity_by} 
                          </p>
                        </TableCell> */}
                        {row?.product_delivery_status ? 
                        <TableCell align="center" sx={{fontSize:26,color:palette.primary.main}} > <Iconify   icon="mdi:truck-check" /> </TableCell>
                        :
                        <TableCell align="center" sx={{fontSize:26,color:'#e8e6e6'}} > <Iconify   icon="mdi:truck-check" /> </TableCell>  
                      }
                       <TableCell align="center"> 
                      <p style={{color:palette.primary.main,fontWeight:'600'}} > ₹ {row?.product_sale_price * row?.product_quantity}  </p>
                        </TableCell>
                      
                    </TableRow>
                  );
                })}
                {!orderDetail?.products?.length >0 &&   <TableCell colSpan={9}> <div className='search-not-found' >
                  <img className='search-not-found-img' src={searchNotFound} alt="searchNotFound" />
                  <Typography
          
          variant="h6"
          id="tableTitle"
          component="div"
        >
          No Products Found!!
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
   </div>
   </div>
    </div>
   <div style={{paddingBottom:70}} ></div>
    </div>
 {/* <PDFExport scale={0.6} ref={pdfExportComponent}  margin={10} paperSize='a4'  >
    <Invoice orderDetail={orderDetail} />
  </PDFExport> */}
  
   </Container>
   </Paper>


   </div>
   </>
  )
}

export default ViewOrder