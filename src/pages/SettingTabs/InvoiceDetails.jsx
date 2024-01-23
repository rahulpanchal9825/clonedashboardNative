import React, { useEffect, useState } from 'react'
import { Toolbar,FormControlLabel, Tooltip,Menu,Switch, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';
// import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import Iconify from '../../components/Iconify';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { editable_config } from '../../../src/editable_config';
import { convertDateForOrder } from '../../../src/global/globalFunctions';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import CustomizedSnackbars from '../../global/Snackbar/CustomSnackbar';
import axios from 'axios';
import LoadingSpinner from 'src/components/Spinner';
// import { useState } from 'react';

function InvoiceDetails({orderDetail}) {
    const [invoiceDetails, setInvoiceDetails] = useState({company_name:'',company_address:'',company_phone_number:'',company_state:'',company_zipcode:''});
    const [message ,setMessage] = useState({type:"",message:""})
    const [ pageLoading, setPageLoading  ] =useState(false)
    const [snackbarOpen,setSnackbarOpen ] = useState(false);
    const [render,setRender ] = useState(false);
    const {authState,fetchAuthuser} = UseContextState()
    console.log("authState-----------",authState)

    let sub_total = 0
    for(let i=0;i<orderDetail?.products?.length;i++){
        sub_total = sub_total + (orderDetail?.products[i]?.product_sale_price * orderDetail?.products[i]?.product_quantity)
    }


    useEffect(()=>{
      setPageLoading(true)
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/users/invoice/details/${authState?.user?.app_id}`,{headers: {
            'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
          },withCredentials:true})
        .then(res=>{
          console.log("details",res?.data);
          setInvoiceDetails(prev=>({...prev,
            company_name:res?.data?.details?.invoice_details?.company_name,
            company_address:res?.data?.details?.invoice_details?.company_address,
            company_phone_number:res?.data?.details?.invoice_details?.company_phone_number,
            company_state:res?.data?.details?.invoice_details?.company_state,
            company_zipcode:res?.data?.details?.invoice_details?.company_zipcode,
        
        }));
        setPageLoading(false)
        })
        .catch(err=>{
            console.log(err);

        })
      },[render])
   

// handle submit invoice details
const handleSubmitInvoice=async(e)=>{
    e.preventDefault()
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/edit/invoice/details/${authState?.user?.app_id}`,{...invoiceDetails},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
    .then(res=>{
        console.log(res?.data)
        if(res?.data?.status === true){
            setMessage((prev)=>({...prev,type:'success',message:'Invoice Updated Successfully !!'}))
            setSnackbarOpen(true);
            setRender(prev=>!prev)
        }
        if(res?.data?.status === false){
            setMessage((prev)=>({...prev,type:'error',message:'Invoice Updated Failed !!'}))
            setSnackbarOpen(true);
            setRender(prev=>!prev)

        }
    })
    .catch(err=>{
        console.log(err)
    })
}

// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################
    

  return (
    <>
    <LoadingSpinner loading={pageLoading} />
         {/* #################### SANCKBAR MESSAGE ######################## */}
 <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
 {/* #################### SANCKBAR MESSAGE ######################## */}
        <div className='invoice_details_form invoice_details_form_and_invoice_demo '>
            <form onSubmit={handleSubmitInvoice} className='invoice_fields'>
                <h2>Submit Invoice Details</h2>
                
                <label className='invoice_input_label'>Company Name*</label>
                <TextField required  placeholder='Company Name' type='text'   className='invoice_input_fields'   variant="outlined" value={invoiceDetails?.company_name} onChange={(e)=>setInvoiceDetails(prev=>({...prev,company_name:e.target.value}))}/>
                
                <label className='invoice_input_label'>Company Address*</label>
                <TextField required  placeholder='Company Address' type='text'   className='invoice_input_fields' id="outlined-basic"   variant="outlined" value={invoiceDetails?.company_address} onChange={(e)=>setInvoiceDetails(prev=>({...prev,company_address:e.target.value}))}/>                
                
                <label className='invoice_input_label'>Company State*</label>
                <TextField required  placeholder='Company State' type='text'   className='invoice_input_fields' id="outlined-basic"   variant="outlined" value={invoiceDetails?.company_state} onChange={(e)=>setInvoiceDetails(prev=>({...prev,company_state:e.target.value}))}/>
                
                <label className='invoice_input_label'>Company Zipcode*</label>
                <TextField required  placeholder='Company Zipcode' type='number'   className='invoice_input_fields' id="outlined-basic"   variant="outlined" value={invoiceDetails?.company_zipcode} onChange={(e)=>setInvoiceDetails(prev=>({...prev,company_zipcode:e.target.value}))}/>
                
                <label className='invoice_input_label'>Company Phone No*</label>
                <TextField required  placeholder='Company Phone No' type='number'   className='invoice_input_fields' id="outlined-basic"   variant="outlined" value={invoiceDetails?.company_phone_number} onChange={(e)=>setInvoiceDetails(prev=>({...prev,company_phone_number:e.target.value}))}/>

                <div className='invoice_btn'>
                <Button type='submit'  variant="contained"  startIcon={<Iconify icon="material-symbols:check-circle-rounded" />}>Save Changes</Button>
                </div>
            </form>
            <div className='invoice_demo'>
            <div class="invoice-main-container" >
    <div class="invoice-main-inner ">
        <div class="row-invoice mt-4">
            <div class="col-12 col-lg-12">
                <div class="row-invoice">
                        <div class="text-center text-150">
                        
                    </div>
                </div>
                <div class="row-invoice">
                        <div class="text-center text-150">
                            <h6></h6>
                        <u><h3 class="">Invoice Preview</h3></u>
                    </div>
                        <div class="invoice-store-owner-detail-box">
                         <h3 className='font-capitalize-case' >{invoiceDetails?.company_name ? invoiceDetails?.company_name : 'your Company Name'}</h3>
                       <p className='font-capitalize-case' >{invoiceDetails?.company_address ? invoiceDetails?.company_address : 'your Company Address'}</p>
                       <p  className='font-capitalize-case' style={{paddingLeft:'10px'}} >{invoiceDetails?.company_state ? invoiceDetails?.company_state : 'Your State'},{invoiceDetails?.company_zipcode ? invoiceDetails?.company_zipcode : 'Your Zipcode' }</p>
                       <p className='font-capitalize-case' >{invoiceDetails?.company_phone_number ? invoiceDetails?.company_phone_number : 'Your Company Phone Number'}</p>
                       </div>
                </div>


                <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

                <div class="row-invoice">
                    <div class="invoice-customer-detail-box">
                         <h4 >To : <b>Sanjeev</b></h4>
                      <div className='invoice-customer-details' >
                      <p>Main market karol baag</p>
                       <p> Delhi, 110053 </p>
                       <p> <strong>Payment Mode :</strong> Cash on delivery</p>
                      </div>
                       </div>

                       <div class="invoice-customer-detail-box-right">
                      <div className='invoice-customer-details' >
                      <p><strong>Invoice ID :</strong> Order-7182-354593-9157</p>
                      <p><strong>Date & Time :</strong> 3/23/2023, 7:43:55 PM</p>
                       <p> <strong>Mobile : </strong>+91-9988779988</p>
                       <p style={{textTransform:'lowercase'}} ><strong style={{textTransform:'capitalize'}} >Email : </strong> customer@gmail.com</p>
                      </div>
                       </div>
              
                </div>
                <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />
                <div class="mt-4">
                <TableContainer >
      <Table sx={{ minWidth: 850 }} aria-label="simple table">
        <TableHead sx={{fontWeight:'900'}} >
          <TableRow>
            <TableCell align='left' ><h4>#</h4></TableCell>
            <TableCell align='left' ><h4>Products</h4></TableCell>
            <TableCell align="center"><h4>Quantity</h4></TableCell>
            <TableCell align="right"><h4>Price</h4></TableCell>
            <TableCell align="right"><h4>Amount</h4></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                     <TableCell align="left">1</TableCell>
                     <TableCell align="left"> BOYS TSHIRT | boys tshirt19 yellow S</TableCell>
                     <TableCell align="center">2</TableCell>
                     <TableCell align="right">Rs.500</TableCell>
                     <TableCell align="right">Rs.450</TableCell>
                   </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

                    <div class="row-invoice mt-3">
                        <div class="col-12 col-sm-6 text-grey-d2 text-95 mt-2 mt-lg-0">
                            {/* Extra note such as company or payment information... */}
                        </div>
                        <div class="invoice-customer-detail-box-right">
                      <div className='invoice-customer-total-details' >
                      <p className='total-amount-box' ><strong>Sub Total :</strong> Rs.1298</p>
                      <p className='total-amount-box' ><strong style={{paddingRight:'13px'}} >Delivery & Shipping : </strong> Rs.40</p>
                      <hr />
                       <p className='total-amount-box total-amount-detail' > <strong style={{paddingRight:'13px'}} >Total Amount : </strong><strong>Rs.1338</strong></p>
                      </div>
                       </div>
                    </div>

                    

                    <div style={{marginTop:'80px',textAlign:'center'}} >
                        <p class="">Have a Nice Day, Thank You For Shopping With Us.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            </div>
        </div>
    </>
  )
}
export default InvoiceDetails