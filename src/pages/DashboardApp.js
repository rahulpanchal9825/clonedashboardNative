import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, IconButton } from '@mui/material';
import { Card,Box, CardHeader,FormControl,TextField,InputAdornment,Menu,Button,ClickAwayListener } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { fShortenNumber } from 'src/utils/formatNumber';
// components
import Page from '../components/Page';
import {Paper} from '@mui/material';
import Iconify from '../components/Iconify';
import productimg from "../assests/product.png";
import orderimg from "../assests/order.png"
import usersimg from "../assests/users.png";
import totalsale from "../assests/sale.png";
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { editable_config } from 'src/editable_config';
import { getGapBetweenDates } from 'src/global/globalFunctions';
import VideoModal from 'src/global/Modals/VideoModal';
import LoadingSpinner from 'src/components/Spinner';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';



// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [allCounts,setAllCounts]=useState()
  const [loading,setLoading]=useState(false)
  const [render,setRender]=useState(false)
  const [activeUsers,setActiveUsers]=useState([])
  const [activeOrders,setActiveOrders]=useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [filters , setFilters ] = useState({by_status:'all',recentDays:'All'})
  const {authState} = UseContextState()
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      startDate: '',
      endDate: '',
      key: 'selection'
    }
  ]);
  let open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    open=false
    setRender(prev=>!prev)
  };

  console.log("filters=>>",filters);
  console.log("filters=>>",stateDate);

  const theme = useTheme();

  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/dashboard/details/for/admin/user`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then((res)=>{
      console.log(res?.data)
      setAllCounts(res.data)
      setLoading(false)
    })
    .catch((err)=>{
      console.log(err);
      setLoading(false)
        })
  },[])

  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/dashboard/active/user/graph/details/for/admin/user`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(async(res)=>{
      console.log(res?.data)
      setActiveUsers(res?.data?.active_users)
      setLoading(false)
     
      // setAllCounts(res.data)
    })
    .catch((err)=>{
      console.log(err);
      setLoading(false)
    })
  },[])
  
  let activeUserGraphData = {users:[],count:[],total_users:0};
  for(let i=0;i<activeUsers?.length;i++){
    console.log( activeUsers[i]?._id)
    activeUserGraphData.users.push(activeUsers[i]?._id?.slice(0,10))
    activeUserGraphData.count.push(activeUsers[i]?.count)
    activeUserGraphData.total_users =   activeUserGraphData.total_users + (activeUsers[i]?.count)
  }
  
  console.log("active=>",activeUserGraphData);
  
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/dashboard/total/sales/over/time/graph/details/for/admin/user?date_from=${stateDate[0]?.startDate}&date_to=${stateDate[0]?.endDate}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(async(res)=>{
      console.log('total_sales==>',res?.data)
      setActiveOrders(res?.data?.total_sale)
      setLoading(false)
    })
    .catch((err)=>{
      console.log(err);
      setLoading(false)
    })
  },[])

  let activeOrdersGraphData = {orders:[],sale:[],total_sale:0};
  for(let i=0;i<activeOrders?.length;i++){
    console.log( activeOrders[i])
    activeOrdersGraphData.orders.push(activeOrders[i]?.createdAt?.slice(0,10))
    activeOrdersGraphData.sale.push(parseInt(activeOrders[i]?.order_total) + activeOrders[i]?.delivery_charges)
    activeOrdersGraphData.total_sale = activeOrdersGraphData.total_sale + (parseInt(activeOrders[i]?.order_total) + activeOrders[i]?.delivery_charges)
  }

  console.log("activeOrdersGraphData====>",activeOrdersGraphData);

  // handle recent Order fucntion
  const handleRecentOrders = (value)=>{
    console.log("+++++value=========",value)
    setFilters((prev)=>({...prev,by_status:"all"}))
     let date = new Date().toJSON().slice(0, 10);
    // console.log(date); // "2022-06-17"
    const currentDate = new Date().toDateString()
    // console.log("current Date",currentDate.length)
    const getCompareValue = `${value?.startDate}`
    // console.log("getCompareValue",getCompareValue?.slice(0,15)?.length)

    // FOR SETTING TODAY IN DATE FILTER
    if(getCompareValue?.slice(0,15) == `${currentDate}` ){
      // console.log("ENTERED")
      setFilters((prev)=>({...prev,recentDays:"Today"}))
      return;
    }
    const startDateGap = getGapBetweenDates(value?.endDate,value?.startDate)
    console.log("getGapBetweenDates",startDateGap)
    // FOR SETTING YESTERDAY IN DATE FILTER
    if(startDateGap == 1){
      setFilters((prev)=>({...prev,recentDays:"Yesterday"}))
      return;
    }
    // FOR SETTING YESTERDAY IN DATE FILTER
    if(startDateGap == 7){
      setFilters((prev)=>({...prev,recentDays:"Week"}))
      return;
    }
    // FOR SETTING YESTERDAY IN DATE FILTER
    if(startDateGap == 30,31,29,28  ){
      setFilters((prev)=>({...prev,recentDays:"Month"}))
      // return;
    }
    if(startDateGap != 30,31,29,28,1,7  ){
      // console.log("ELSE")
      setFilters((prev)=>({...prev,recentDays:"Custom"}))
    }

    if(filters.recentDays =='All'  ){
      setRender(prev=>!prev)
      return
     }

    console.log(value)
  }

  // handle close video modal
  function handleCloseVideoModal(){
    setOpenVideoModal(false)
  }
  

  // handle open video modal
  function handleOpenVideoModal(){
    setOpenVideoModal(true)
  }
  

  return (
    <Page title={editable_config.Admin_Name}>
       <LoadingSpinner loading={loading} />
      <VideoModal title='How to use Dasboard?' video_url="https://www.youtube.com/embed/USccSZnS8MQ" isOpen={openVideoModal} handleClose={handleCloseVideoModal} /> 
      {/* <Container maxWidth="xl"> */}



      

   <div className='dashboard_heading_box' >
   <Typography variant="h5" className='font-capitalize-case' >
         Store Analytics & Overview
        </Typography>
   {/* <Typography variant="h4" className='font-capitalize-case' >
          👋 Hi {authState?.user?.app_name} Admin, Welcome back
        </Typography> */}


        {/* <div className="banner-image-guide-box">
    <Button onClick={handleOpenVideoModal} variant="text" className='image-guide-btn-text' startIcon={<Iconify icon="logos:youtube-icon" />}>Learn How it Works</Button>
   </div> */}

   </div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {/* <AppWidgetSummary className="analytics_box" title="Total Sale" total={allCounts?.total_sales ? allCounts?.total_sales : 0} img={productimg}   icon={'ic:round-currency-rupee'}> 
            <img src={productimg} />
            </AppWidgetSummary> */}

            <div className='analytics_box total_sale'>
              <div className='box_count_and_title'>
              <h3 className='count'>{fShortenNumber(allCounts?.total_sales ? allCounts?.total_sales : 0)}</h3>
              <h5>Total Sale</h5>
              </div>
              <img src={totalsale} />
            </div>
            
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* <AppWidgetSummary className="analytics_box" title="Total Sale" total={allCounts?.total_sales ? allCounts?.total_sales : 0} img={productimg}   icon={'ic:round-currency-rupee'}> 
            <img src={productimg} />
            </AppWidgetSummary> */}

            <div className='analytics_box new_order'>
              <div className='box_count_and_title'>
              <h3 className='count'>{allCounts?.new_order_count ? allCounts?.new_order_count : 0}</h3>
              <h5>New Order</h5>
              </div>
              <img src={productimg} />
            </div>
            
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* <AppWidgetSummary className="analytics_box" title="Total Sale" total={allCounts?.total_sales ? allCounts?.total_sales : 0} img={productimg}   icon={'ic:round-currency-rupee'}> 
            <img src={productimg} />
            </AppWidgetSummary> */}

            <div className='analytics_box total_order'>
              <div className='box_count_and_title'>
              <h3 className='count'>{allCounts?.total_orders_count ? allCounts?.total_orders_count : 0}</h3>
              <h5>Total Order</h5>
              </div>
              <img src={orderimg} />
            </div>
            
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* <AppWidgetSummary className="analytics_box" title="Total Sale" total={allCounts?.total_sales ? allCounts?.total_sales : 0} img={productimg}   icon={'ic:round-currency-rupee'}> 
            <img src={productimg} />
            </AppWidgetSummary> */}

            <div className='analytics_box total_customers'>
              <div className='box_count_and_title'>
              <h3 className='count'>{allCounts?.customers_count ? allCounts?.customers_count : 0}</h3>
              <h5>Total Customers</h5>
              </div>
              <img src={usersimg} />
            </div>
            
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Order" total={allCounts?.new_order_count ? allCounts?.new_order_count : 0} color="warning" icon={'carbon:result-old'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Orders" total={allCounts?.total_orders_count ? allCounts?.total_orders_count : 0} color="info" icon={'bxs:box'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Customers" total={allCounts?.customers_count ? allCounts?.customers_count : 0} color="error" icon={'eva:people-fill'} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={6}>
            <AppWebsiteVisits
              title="Recent Users "
              // subheader="(+43%) than last year"
              subheader="Weekly Active Users"
              chartLabels={activeUserGraphData?.users}
              // chartLabels={[
              //   '01',
              //   '02',
              //   '03',
              //   '04',
              //   '05',
              //   '06',
              //   '07',
              //   '08',
              //   '09',
              //   '10',
              //   '11',
              // ]}
              chartData={[
                {
                  name: 'User',
                  type: 'area',
                  fill: 'gradient',
                  data: activeUserGraphData?.count,
                },
              // chartData={[
              //   {
              //     name: 'User',
              //     type: 'area',
              //     fill: 'gradient',
              //     data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43,],
              //   },
                // {
                //   name: 'Team C',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                // },
              ]}
              cardAction={<div className='flex' >
                 <Iconify icon="eva:people-fill" sx={{width:'22px',height:'22px'}} /> 
                 <Typography variant="h6" paddingLeft={1} >
                 {fShortenNumber(activeUserGraphData?.total_users)} User
            </Typography>
              </div> }
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
              {/* <Paper elevation={4} sx={{borderRadius:12}} >
              div
              </Paper> */}
                 {/* <ClickAwayListener onClickAway={handleClose}> */}
               <Card  >
<AppWebsiteVisits
              title="Sales Over Time"
              // subheader="(+43%) than last year"
              subheader="Weekly Sales "
              chartLabels={activeOrdersGraphData?.orders}
              // chartLabels={[
              //   '01',
              //   '02',
              //   '03',
              //   '04',
              //   '05',
              //   '06',
              //   '07',
              //   '08',
              //   '09',
              //   '10',
              //   '11',
              // ]}
              chartData={[
                {
                  name: 'Amount(₹)',
                  type: 'column',
                  fill: 'solid',
                  data: activeOrdersGraphData?.sale,
                },
              ]}
              // chartData={[
              //   {
              //     name: 'Sales',
              //     type: 'column',
              //     fill: 'solid',
              //     data: [23, 11, 22, 0, 0, 22, 37, 21, 44, 22, 30],
              //   },
              // ]}
              cardAction={<div className='flex' >
                 <Typography variant="h6" paddingLeft={1} >
            ₹  {fShortenNumber(activeOrdersGraphData?.total_sale)}
            </Typography>
              </div> }
            

            />

    </Card>


{/* -=-=--=-=-=-=--=- sale date filter -=-=-=--=-=-=----=- */}
{/* cardAction={<FormControl   >
              <TextField
                      id="basic-button"
                      InputProps={{
                        
                        startAdornment: (
                          <InputAdornment position="start">
                             <CalendarMonthIcon  />
                          </InputAdornment>
                        ),
                        readOnly: true,
                       
                      }}
                     size='small'
                      aria-readonly={true}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClickMenu}
                      sx={{width:50,border:'none'}}
                      
                    />
                    

                        <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      closeAfterTransition={handleClose}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                       PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                         
                        },
                      }}
                    >
                      <div className='date-filter-box' >
                      <DateRangePicker
               
               onChange={item => {setStateDate([item.selection])
                handleRecentOrders(item.selection)
              
                }}
               showSelectionPreview={false}
               showPreview={false}
               moveRangeOnFirstSelection={false}
               months={1}
               
               ranges={stateDate}
               direction="vertical"
              />
              <div className='date-filter-reset-btn' >
              
              <Button onClick={()=>{setFilters((prev)=>({...prev,recentDays:'All'}))
                                                                            setStateDate([ {
                                                                              
                                                                              startDate: '',
                                                                              endDate: '',
                                                                              key: 'selection'
                                                                            }])
                                                                          }}  variant="contained" > Reset</Button>
                                                                          </div>
                      </div>

              
              
                    </Menu>
                    </FormControl>} */}
{/* -=-=--=-=-=-=--=- sale date filter -=-=-=--=-=-=----=- */}

      {/* </ClickAwayListener> */}
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>



              


      {/* </Container> */}
    </Page>
  );
}