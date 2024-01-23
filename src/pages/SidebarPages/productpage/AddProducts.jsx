import React,{useState,useEffect} from 'react'
import axios from 'axios';
import FileUploadDesign from '../../../components/common/FileUploadDesign';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {MenuItem,OutlinedInput,Chip,InputLabel,Checkbox,ListItemText,FormControl,Select, InputAdornment, Tooltip, Typography } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SearchIcon from '@mui/icons-material/Search';
import {Button,IconButton} from '@mui/material';
import Paper from '@mui/material/Paper';
import Iconify from '../../../components/Iconify';
import palette from '../../../theme/palette';
import Autocomplete from '@mui/material/Autocomplete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uploadFileToFirebase } from 'src/global/globalFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import noImage from '../../../assests/No_image.svg'
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CancelIcon from '@mui/icons-material/Cancel';
import { editable_config } from 'src/editable_config';
import PopupModal from 'src/global/Modals/PopupModal';
import ImageError from 'src/global/Modals/ImageError';
import ImageLength from 'src/global/Modals/ImageLength';
import { useNavigate } from 'react-router-dom';
import utils from 'src/utils/utils';
import VideoModal from 'src/global/Modals/VideoModal';
import ProductVariationModal from 'src/global/Modals/ProductVariationModal';

// for auto complete feilds
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AddProducts({handleClose}) {
   const [productData , setProductData ] = useState({product_main_category:'choose_main_category',
   product_category:'choose_category',
   product_subcategory:'',
  color:[],
  size:[],
  weight:[]
})
   const [ mainCategory,setMainCategory ] = useState([]);
   const [ category,setCategory ] = useState([]);
   const [ subCategory,setSubCategory ] = useState([]);
   const [message ,setMessage] = useState({type:"",message:""})
   const [ loading, setLoading  ] =useState(false)
   const [fileUpload , setFileUpload ] = useState([])
   const [snackbarOpen,setSnackbarOpen ] = useState(false)
   const [ render, setRender ] = useState(false)
   const [ openPopupModal, setOpenPopupModal ] = useState(false)
   const [ openImageLenghtPopupModal, setOpenImageLenghtPopupModal ] = useState(false)
   const [openProductLimitModal, setOpenProductLimitModal] = useState(false);
   const [ productCount, setProductCount ] = useState(false);
   const [openVideoModal, setOpenVideoModal] = useState(false);
   const [openAddSizeModal, setOpenAddSizeModal] = useState(false);
   const [openAddWeightModal, setOpenAddWeightModal] = useState(false);
   const [addCustomSize,setAddCustomSize] = useState('')
   const [addCustomWeight,setAddCustomWeight] = useState('')
   const [customSizeAndWeight,setCustomSizeAndWeight] = useState({custom_size:[],custom_weight:[]})
   const [productVariantFields, setProductVariantFields] = React.useState([{anchorEl:null,option_name:'',option_values:[]}]);
   const [productVariant, setProductVariant] = useState([])
   const [errorMessageVariant ,setErrorMessageVariant] = useState({index:0,error:false})
   const [openProductVariantModal, setOpenProductVariantModal] = useState(false);
  //  const [productVariant, setProductVariant] = useState([{product_regular_price:'',product_sale_price:'',attributes:[]}])

  //  product_regular_price:{ type:Number},
  //  product_sale_price:{type:Number},
  //  attributes:[
  //      {
  //          value: {type:String},
  //          master_attribute:{type:String},
  //      },
  //  ]

   const [sizes, setsizes] = React.useState([]);
   const [colors, setColors] = React.useState([]);
   const [searchInSize, setSearchInSize] = React.useState('');
   const {authState} = UseContextState()
   const navigate = useNavigate()
   console.log("PRODUCT productVariantFields",productVariantFields)
   console.log("productVariant=>",productVariant)



  // ===================== PRODUCT VARIANTS FUNCTIONS. =====================

  const handleClickOpenSelectVariantList = (i,event) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i]['anchorEl'] = event.currentTarget;
    setProductVariantFields(newFormValues);
  };
  const handleClickCloseSelectVariantList = (i,event) => {
    let newFormValues = [...productVariantFields];
    newFormValues[i]['anchorEl'] = null;
    setProductVariantFields(newFormValues);
  };

  let removeProductVariants = (i) => {
    let newFormValues = [...productVariantFields];
    newFormValues.splice(i, 1);
    setProductVariantFields(newFormValues)
}

let addMoreProductVariants = () => {
  setProductVariantFields([...productVariantFields, { option_name:'',option_values:[]}])
  }

let handleSelectProductVariantsOption=(i,value)=>{
  console.log("value",value,'index',i)
  let newFormValues = [...productVariantFields];
  for (let inner=0;inner<productVariantFields?.length;inner++){
    if(productVariantFields[inner]?.option_name === value){
      console.log("productVariantFields[inner]?.option_name",productVariantFields[inner]?.option_name,'===',value)

      newFormValues[i]['option_name'] = '';
      // alert('already exists!!')
      setMessage({type:'error',message:'Option Name Already Exists !!'})
      setSnackbarOpen(true)
      return 

    }
    
  }
  newFormValues[i]['option_name'] = value;
  setProductVariantFields(newFormValues);
}

let handleChangeProductVariants=(i,e)=>{
  let newFormValues = [...productVariantFields];
  newFormValues[i][e.target.name] = e.target.value;
  setProductVariantFields(newFormValues);
}
let handleProductVariantsOptionsValue=(i,value)=>{
  let newFormValues = [...productVariantFields];
  newFormValues[i]['option_values'] = value;
  setProductVariantFields(newFormValues);
}

const createVariantListForPriceFilling = ()=>{
  let newList=[]

  if(!productVariantFields?.length) {
    setMessage({type:'error',message:'Add Atleast 1 Product Variant !!'})
    setSnackbarOpen(true)
    return
  }

  if(productVariantFields?.length == 1 && !productVariantFields[0]?.option_name?.length) {
    setMessage({type:'error',message:'Add Option Name !!'})
    setSnackbarOpen(true)
    return
  }
  // console.log("productVariantFields[0]?.option_values?.length",productVariantFields[0]?.option_values?.length)
  if(productVariantFields?.length == 1 &&  !productVariantFields[0]?.option_values?.length ) {
    setMessage({type:'error',message:'Add Option Values !!'})
    setSnackbarOpen(true)
    return
  }

  if(productVariantFields?.length == 2 &&  !productVariantFields[1]?.option_name?.length) {
    setMessage({type:'error',message:'Add Option Name !!'})
    setSnackbarOpen(true)
    return
  }
  if(productVariantFields?.length == 2 &&  !productVariantFields[1]?.option_values?.length) {
    setMessage({type:'error',message:'Add Option Values !!'})
    setSnackbarOpen(true)
    return
  }

  // for 2 variants
if(productVariantFields?.length == 2){
  productVariantFields[0]?.option_values?.map((value1,index)=>{
    // console.log("value----->>>",value,index)
    productVariantFields[1]?.option_values?.map(value2=>{

      newList?.push({product_regular_price:'',product_sale_price:'',attributes:[value1,value2]})
    })
  })
}

// for 1 variant
if(productVariantFields?.length < 2){
  productVariantFields[0]?.option_values?.map((value1,index)=>{
    // console.log("value----->>>",value,index)
      newList?.push({product_regular_price:'',product_sale_price:'',attributes:[value1]})
  })
}

  console.log("allOption===>",newList)
  setProductVariant(newList)

  setOpenProductVariantModal(false)

}


// product variants close modal
function handleCloseProductVariantsModal(){
  setOpenProductVariantModal(false)
}


// set price in variants
const handleChangeProductVariantPrice=(i,e)=>{
let newData = [...productVariant]
newData[i][e.target.name] = e.target.value;
setProductVariant(newData);
setErrorMessageVariant((prev)=>({...prev,index:0,error:false}))

} 

const removeProductVariantPricefield = (i) => {
  let newData = [...productVariant];
  newData.splice(i, 1);
  setProductVariant(newData)
}

//==============  PRODUCT VARIANTS FUNCTIONS =====================


 // GET CUSTOM SIZES AND WEIGHT
 useEffect(()=>{
  axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/all/custom/sizes/and/weight/${authState?.user?.app_id}`,{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
  .then(res=>{
    console.log("res?.data------>>>>>>>",res?.data)
    setCustomSizeAndWeight((prev=>({...prev,custom_weight:res?.data?.custom_size_and_weight?.custom_weight,custom_size:res?.data?.custom_size_and_weight?.custom_size})))
  })
  .catch(err=>{
    console.log(err)
  })
},[render])
// GET CUSTOM SIZES AND WEIGHT




   const availablecolors=utils.availablecolors
    
    
  //  let availablesizes = utils.availablesizes
   let availablesizes = customSizeAndWeight?.custom_size

  // const availableWeight = utils.availableWeight
  const availableWeight = customSizeAndWeight?.custom_weight


  const handleColorsChange = (event,value) => {
    setProductData((prev)=>({...prev,color: value }))
  };
 
  const handleSizeChange = (event,value) => {
    setProductData((prev)=>({...prev,size: value }))
  };
  const handleWeightChange = (event,value) => {
    setProductData((prev)=>({...prev,weight: value }))
  };


// check product limit 

       //================= GET ALL MAIN CATEGORY =================
  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/addproduct/maincategory`, {headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then((res) => {
      console.log(res);
      setMainCategory(res?.data);
    })
    .catch((err) => {
      console.log(err);
    });

    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/products/count`, {headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then((res) => {
      console.log("PPRODYCT ______",res?.data);
      setProductCount(res?.data.product_count);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [render]);

  //================= GET ALL MAIN CATEGORY =================

  // GET CATEGORY BY BRAND
  useEffect(()=>{
    if(productData?.product_main_category === 'choose_main_category')return;
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?main_category=${productData?.product_main_category}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res)
        setCategory(res?.data)
    })
  },[productData?.product_main_category])
  // GET CATEGORY BY BRAND

  // GET SUB CATEGORY BY BRAND
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?category=${productData?.product_category}`,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res)
      setSubCategory(res?.data[0]?.subcategory)
    })
  },[productData?.product_category])
  // GET SUB CATEGORY BY BRAND

 

    const handleChange=(e)=>{
      console.log(e.target)
      if(e.target.name == 'color'){
        const {
          target: { value },
        } = e;
        setColors(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        setProductData((prev)=>({...prev,color: typeof value === 'string' ? value.split(',') : value, }))
      }
      if(e.target.name == 'size'){
        const {
          target: { value },
        } = e;
        setsizes(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        setProductData((prev)=>({...prev,size: typeof value === 'string' ? value.split(',') : value, }))
      }
        setProductData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    
    // File upload function 
    const handleFileUpload = (e)=>{
      console.log("e.target.files",e.target.files)
      if(e.target.files){
        for(let i=0;i<e.target.files?.length;i++){
          if(e.target.files[i]?.size > editable_config?.ImageUploadSize){
            console.log("e.target.files[i]?.size----",e.target.files[i]?.size);
            setFileUpload(null)
            setOpenPopupModal(true); 
            return
          }else{setFileUpload(null)}
        }
      }
      if(e.target.files?.length > 4){ 
        setFileUpload(null)
        setOpenImageLenghtPopupModal(true)
        return 
      }
      console.log(e.target.files)
      let allImages = [...fileUpload,...e.target.files]
      setFileUpload(allImages)

    }
    console.log(fileUpload)

    // remove image after select
    const handleRemoveImage=(removeByIndex)=>{
      console.log(removeByIndex)
      const afterRemove= fileUpload?.filter((value,index)=>{
        return index !=removeByIndex
      })
      console.log("AFTER REMOVE IMAGE=>",afterRemove )
      setFileUpload(afterRemove)
    }

    // handle form submit 
    const handleSubmit = async(e)=>{
      e.preventDefault()
     console.log(fileUpload)
     if(productData?.product_main_category == 'choose_main_category'){
      setMessage((prev)=>({...prev,type:'error',message:'Choose Product Main Category !!'}))
      setSnackbarOpen(true);
      return
    }
     if(productData?.product_category == 'choose_category'){
      setMessage((prev)=>({...prev,type:'error',message:'Choose Product Category !!'}))
      setSnackbarOpen(true);
      return
    }
   
    
      // if(!productData?.product_regular_price ){
      //   alert("")
      //   return 
      //   }
      //   if(!productData?.product_sale_price){
      //     alert("Regular Price Is Greater Than Sale Price")
      //   }
      if(parseInt(productData?.product_regular_price) <= parseInt(productData?.product_sale_price)){
        setMessage((prev)=>({...prev,type:'error',message:'Regular Price Need To Be Greater Than Sale Price !!'}))
        setSnackbarOpen(true);
      // alert("Regular Price Need To Be Greater Than Sale Price !!")
      return 
      }
      
      if(productVariant?.length){
        for(let i=0;i<productVariant?.length;i++){
          // console.log("ENTERED LOOP")
          if(parseInt(productVariant[i]?.product_regular_price) <= parseInt(productVariant[i]?.product_sale_price)){
        // console.log("MATCH FOUND ->",i,productVariant[i]?.product_regular_price,productVariant[i]?.product_sale_price)
        setErrorMessageVariant((prev)=>({...prev,index:i,error:true}))
            setMessage((prev)=>({...prev,type:'error',message:'Regular Price Need To Be Greater Than Sale Price !!'}))
            setSnackbarOpen(true);
          return 
          }
        }
      }

      let productVariantLowestPrice={product_regular_price:'',product_sale_price:''};
      if(productVariant?.length){
        let min = Math.min(...productVariant.map(item => item.product_sale_price));
        for(let i=0;i<productVariant?.length;i++){
          // console.log("ENTERED LOOP")
          if(parseInt(productVariant[i]?.product_sale_price) === min){
        // console.log("MATCH FOUND ->",i,productVariant[i]?.product_regular_price,productVariant[i]?.product_sale_price)
        productVariantLowestPrice.product_regular_price = productVariant[i]?.product_regular_price
        productVariantLowestPrice.product_sale_price = productVariant[i]?.product_sale_price
           
          }
        }
      }
// console.log("productVariantLowestPrice==>",productVariantLowestPrice)
      if(!fileUpload?.length){
        setMessage((prev)=>({...prev,type:'error',message:'Add Atleast 1 Product Image !!'}))
        setSnackbarOpen(true);
        // alert('Add Atleast 1 Product Image !!');
        return
      }

      setLoading(true);
      let productsImageToFirebase=[];
      console.log("productsImageToFirebase",productsImageToFirebase)
      if(fileUpload.length > 0){
        for(let i = 0; i<fileUpload?.length;i++){
          productsImageToFirebase[i]= await uploadFileToFirebase(`/${process.env.REACT_APP_IMAGES_FOLDER_NAME}/users/${authState?.user?.app_id}/products/${productData?.product_code}/`,fileUpload[i]);


        }
       }

       let data;
       if(productVariant?.length){
        data ={
          ...productData,
          ...productVariantLowestPrice,
          product_images:productsImageToFirebase,
          is_variant_true:true,
          variant_option:productVariantFields,
          available_variants:productVariant
          
        }
       }else{
        data ={
          ...productData,
          product_images:productsImageToFirebase,
          
        }
       }
       
console.log("Data=>>",data)


     await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add/new/product`,data,{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
      .then(res=>{
        // if(res?.data?.product_code_match){
        //   setMessage((prev)=>({...prev,type:'error',message:'Product Code Already Exists !!'}))
        //   setSnackbarOpen(true);
        // }
          console.log(res)
          setLoading(false);
          setMessage((prev)=>({...prev,type:'success',message:'Product Added Successfully !!'}))
          setSnackbarOpen(true);
          setProductData({
          product_main_category:'choose_main_category',
          product_category:'choose_category',
          product_subcategory:'',
          product_code:'',
          product_name:'',
          product_variant:'',
          product_quantity:'',
          product_description:'',
          color:[],
          size:[],
          weight:[],
          cartoon_total_products:'',
          product_regular_price:'',
          product_sale_price:''

        });
          setProductVariantFields([{anchorEl:null,option_name:'',option_values:[]}])
          setProductVariant([])
          setFileUpload([])
          setRender(prev=>!prev)
      })
      .catch(err=>{
          console.log(err);
          setLoading(false);
      })
      setLoading(false);
  }
   

// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};
// ##################### SNACK BAR FUNCTIONs ##################

  //############################# IMAGE SIZE ERROR MODAL FUNCTION #############################
  const handleClosePopupModal=()=>{
    setOpenPopupModal(false); 
    // setIsOpen2(false)
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
  //############################# IMAGE lenght ERROR MODAL FUNCTION #############################
  const handleCloseImageLenghtPopupModal=()=>{
    setOpenImageLenghtPopupModal(false); 
    // setIsOpen2(false)
    onYesFunction()
  }
const handleImageLenghtOpenPopupModal=()=>{
    setOpenImageLenghtPopupModal(true); 
    // setIsOpen2(false)
  }

  //############################# IMAGE lenght ERROR MODAL FUNCTION #############################

  // product limit popup handle close function
  const handleCloseProductLimitModal=()=>{
    setOpenProductLimitModal(false)
  }
  
  // product limit popup handle close function

  // handle close video modal
  function handleCloseVideoModal(){
    setOpenVideoModal(false)
  }
  

  // handle open video modal
  function handleOpenVideoModal(){
    setOpenVideoModal(true)
  }

  // handle open Custom add size modal
  // function handleChangeCustomSize(){
  //   setOpenVideoModal(true)
  // }

  // handle close add size modal
  // function handleCloseAddCustomSizeModal(){
  //   setOpenAddSizeModal(false)
  // }
  // console.log(addCustomSize)


// handle save custom sizes
// const handleSaveCustomSize=async(e)=>{
//   e.preventDefault()
//   await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/custom/size/for/product/upload/${authState?.user?.app_id}`,{size:addCustomSize},{headers: {
//     'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
//   },withCredentials:true})
//   .then(res=>{
//     console.log("ADD SIZE SUCCESS",res?.data);
//     setAddCustomSize('')
//     setMessage((prev)=>({...prev,type:'success',message:'Size Added Successfully !!'}))
//     setSnackbarOpen(true);
//     setRender(prev=>!prev)
//   })
//   .catch(err=>{
//     console.log(err);
//     setMessage((prev)=>({...prev,type:'error',message:'Size Add Failed !!'}))
//     setSnackbarOpen(true);
//   })
// }


  // handle close add weight modal
  // function handleCloseAddCustomWeightModal(){
  //   setOpenAddWeightModal(false)
  // }
  // console.log(addCustomWeight)

// handle save custom sizes
// const handleSaveCustomWeight=async(e)=>{
//   e.preventDefault()
//   await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/add/custom/weights/for/product/upload/${authState?.user?.app_id}`,{weight:addCustomWeight},{headers: {
//     'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
//   },withCredentials:true})
//   .then(res=>{
//     console.log("ADD SIZE SUCCESS",res?.data);
//     setAddCustomWeight('')
//     setMessage((prev)=>({...prev,type:'success',message:'Weight Added Successfully !!'}))
//     setSnackbarOpen(true);
//     setRender(prev=>!prev)
//   })
//   .catch(err=>{
//     console.log(err);
//     setMessage((prev)=>({...prev,type:'error',message:'Weight Add Failed !!'}))
//     setSnackbarOpen(true);
//   })

// }

  


  return (
    <>

     <div className='custom-conatiner'>
    {/* #################### ACCOUNT LIMIT PROTECTION ######################## */}

    {/* #################### ACCOUNT LIMIT PROTECTION ######################## */}
 {/*===== IMAGE SIZE ERROR Popup  Modal ====== */}
 <PopupModal handleClose={handleClosePopupModal}open={openPopupModal} data={<ImageError handleClose={handleClosePopupModal} onYes={onYesFunction}  confirmBtnName='Image Compress Now' title='Reduce Image Size!! ' message='Max Image Upload Size is 1Mb.  For more read our image upload guidelines.'  />} />
        {/*===== IMAGE SIZE ERROR Popup Modal ====== */}
 {/*=====Number of Image alert Popup Modal ====== */}
 <PopupModal handleClose={handleCloseImageLenghtPopupModal}open={openImageLenghtPopupModal} data={<ImageLength handleClose={handleCloseImageLenghtPopupModal} onYes={handleCloseImageLenghtPopupModal} confirmBtnName='Okay, Got it'   title='Image Error!! ' message='You can only upload 4 product images. For more read our image upload guidelines.'  />} />
        {/*=====Number of Image alert Popup Modal ====== */}

{/* open add size modal */}
{/* <AddSizeFeildModal  open={openAddSizeModal} handleClose={handleCloseAddCustomSizeModal} onYes={handleSaveCustomSize}  addSizeValue={addCustomSize} handleChangeCustomSize={setAddCustomSize} /> */}
{/* open add size modal */}

{/* open add weight modal */}
{/* <AddWeightFeildModal  open={openAddWeightModal} handleClose={handleCloseAddCustomWeightModal}  onYes={handleSaveCustomWeight} addWeightValue={addCustomWeight} handleChangeCustomWeight={setAddCustomWeight} /> */}
{/* open add weight modal */}

{/* open product variants modal */}
<ProductVariationModal  open={openProductVariantModal}
sub_title='Add your product variants like size, color, etc.'
btn_title='Add Variants'
 handleClose={handleCloseProductVariantsModal}
  handleChangeProductVariants={handleChangeProductVariants}
   handleSelectProductVariantsOption={handleSelectProductVariantsOption}
   handleProductVariantsOptionsValue={handleProductVariantsOptionsValue}
   addMoreProductVariants={addMoreProductVariants}
   removeProductVariants={removeProductVariants}
   handleClickOpenSelectVariantList={handleClickOpenSelectVariantList}
   handleClickCloseSelectVariantList={handleClickCloseSelectVariantList}
   createVariantListForPriceFilling={createVariantListForPriceFilling}
     productVariantFields={productVariantFields}  />
{/* open product variants modal */}



      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    {/* #################### LOADING SPINNER ######################## */}
    
    

    
    {/* #################### SANCKBAR MESSAGE ######################## */}
    <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
    {/* #################### SANCKBAR MESSAGE ######################## */}



    <Paper elevation={4} >
        <div className='product-conatiner'>
        <div className='inner-page-heading-box' >
        <IconButton sx={{color:'black'}}  onClick={()=>navigate(-1)} >
        <Iconify icon="material-symbols:arrow-back-rounded" />
        </IconButton>
     <div>
     <h2>  Add Product</h2>
      {/* <p>  Add your products for your app</p> */}
     </div>
      </div>
        <div className='addproducts_slider'>
            {/* <div className='slider_heading'>
                <h4>Add Products</h4>
                <p>Add your product and necessary information from here</p>
            </div> */}
            {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
            <div className='addproduct_img_and_details flex'>
             {/* file upload box */}
               
                <div className='add_product_form'>
                    <form onSubmit={handleSubmit} >
                   <div className='flex add_product_regular_price_and_sale_price' style={{width:'100%',gap:'10px'}} >
                   <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Product Name  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="product_name" value={productData?.product_name} onChange={handleChange} placeholder=" Product Name " variant="outlined" />
                    </div>
                   <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Product Code  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="product_code" value={productData?.product_code} onChange={handleChange} placeholder=" Product Code " variant="outlined" />
                    </div>

                   </div>
                   <div className='flex add_product_regular_price_and_sale_price' style={{width:'100%',gap:'10px'}} >
                   <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Select Main Category  </label>
                    <TextField  labelId="demo-select-small" id="demo-select-small"
                     className='select_field' name="product_main_category" style={{textTransform:'capitalize'}} value={productData?.product_main_category} onChange={handleChange} 
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
                    <MenuItem value='add_new' onClick={()=>navigate('/dashboard/categories/add/new')} >
                   
                    <Iconify  sx={{marginRight:0.5}} icon="akar-icons:link-out" />
                      Add New Main Category</MenuItem>
                    <MenuItem value='choose_main_category' disabled >Choose Main Categroy</MenuItem>
                    {mainCategory?.map((value,index)=>(
                        <MenuItem key={value._id} style={{textTransform:'capitalize'}} value={value?._id}>{value?._id}</MenuItem>

                    ))}
                    </TextField>
                    </div>
                    <div className='add_product_label_input' style={{width:'100%'}}  >
                    <label htmlFor=""> Select Category  </label>
                    <TextField style={{textTransform:'capitalize'}} labelId="demo-select-small" id="demo-select-small" className='select_field'
                     name='product_category' value={productData?.product_category} onChange={handleChange} 
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
                    <MenuItem value='choose_category'>Choose Category</MenuItem>
                    {category?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?.category_name}>{value?.category_name}</MenuItem>

                    ))}
                    </TextField>
                    </div>
                    <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Select Sub-Category  </label>
                    <TextField style={{textTransform:'capitalize'}} labelId="demo-select-small" id="demo-select-small" className='select_field'
                     name='product_subcategory' value={productData?.product_subcategory} onChange={handleChange}  
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
                    <MenuItem value='' disabled >Choose Sub-Category </MenuItem>
                    {subCategory?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?.name}>{value?.name}</MenuItem>

                    ))}
                    </TextField>
                    </div>
                   </div>
                   

                    
                   <div className='flex add_product_regular_price_and_sale_price' style={{width:'100%',gap:'10px'}} >
                   {/* <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Select Sub-Category  </label>
                    <TextField style={{textTransform:'capitalize'}} labelId="demo-select-small" id="demo-select-small" className='select_field'
                     name='product_subcategory' value={productData?.product_subcategory} onChange={handleChange}  
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
                    <MenuItem value='' disabled >Choose Sub-Category </MenuItem>
                    {subCategory?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?.name}>{value?.name}</MenuItem>

                    ))}
                    </TextField>
                    </div> */}



                    {/* <div className='add_product_label_input' style={{width:'100%'}} >
                   <FormControl sx={{ width: '100%' }}>
                  <label htmlFor=""> Colors  </label>
          <Autocomplete
      multiple
      limitTags={2}
      id="checkboxes-tags-demo"
      value={productData?.color}
      onChange={(e,value)=>handleColorsChange(e,value)}
      name='size'
      options={availablecolors}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}  style={{ textTransform:'capitalize' }} >
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
              <p style={{backgroundColor:`${option}`,padding:'12px 24px',borderRadius:3,marginRight:5,border:'1px solid gray'}} ></p>
          {option}
        </li>
      )}
      style={{ textTransform:'capitalize' }}
      renderInput={(params) => (
        <TextField {...params}  label="" placeholder="Choose Colors" />
      )}
    />
      </FormControl>
      
                    </div> */}


                   </div>
                   

                    {/* <div className='flex add_product_size_color_product_tag ' style={{width:'100%',gap:'10px'}} >
                   

                    <div className='add_product_label_input flex  multiselect_field' style={{width:'100%'}} >
                <FormControl sx={{ width: '100%' }}>
               <label htmlFor=""> Size  </label>
         <Autocomplete
      multiple
      limitTags={2}
      id="checkboxes-tags-demo"
      value={productData?.size}
      onChange={(e,value)=>handleSizeChange(e,value)}
      name='size'
      options={availablesizes}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}  style={{ textTransform:'capitalize' }} >
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      style={{ textTransform:'capitalize' }}
      renderInput={(params) => (
        <TextField {...params} label="" placeholder="Choose Sizes" />
      )}
    />
      </FormControl>
      <div className='add_size_product_page' >
      <Tooltip title='Add Custom Sizes' arrow >
      <Button onClick={()=>setOpenAddSizeModal(true)} sx={{padding:'10px',marginLeft:1}} variant='outlined'  ><Iconify  sx={{width:'28px',height:'28px'}} icon="quill:add" /></Button>
      </Tooltip>
      </div>
                    </div>

                  <div className='add_product_label_input flex multiselect_field' style={{width:'100%'}} >
                <FormControl sx={{ width: '100%' }}>
                  <label htmlFor=""> Weight  </label>
          <Autocomplete
      multiple
      limitTags={2}
      id="checkboxes-tags-demo"
      value={productData?.weight}
      onChange={(e,value)=>handleWeightChange(e,value)}
      name='size'
      options={availableWeight}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="" placeholder="Choose Weight" />
      )}
    />
      </FormControl>
      <div className='add_size_product_page' >
      <Tooltip title='Add Custom Weights' arrow>
      <Button onClick={()=>setOpenAddWeightModal(true)} sx={{padding:'10px',marginLeft:1}} variant='outlined'  ><Iconify  sx={{width:'28px',height:'28px'}} icon="quill:add" /></Button>
      </Tooltip>
      </div>
                    </div>
                   
                  </div> */}
                 

                    <div className='flex add_product_regular_price_and_sale_price' style={{width:'100%',gap:'10px'}} >
                  <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Regular Price  </label>
                    <TextField disabled={productVariant?.length ? true: false} className={productVariant?.length ? 'product_form_disable_price_field': 'product_form_input'}  required type='number' fullWidth  id="outlined-basic" name="product_regular_price" value={productData?.product_regular_price} onChange={handleChange} placeholder=" Regular Price " variant="outlined" />
                    {productVariant?.length ?
                    <span className='product_form_disable_price_field_text_info'  ><Iconify icon="ic:outline-info" /> Add your product prices below in variants.</span>
                      :
                    <span className='regular_price_and_sale_price_info_text' style={{color:'#de074c',fontSize:12,fontWeight:'600'}} >**Regular price is always greater than sale price.</span>
                    }
                    </div>
                  <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Sale Price  </label>
                    <TextField disabled={productVariant?.length ? true: false} className={productVariant?.length ? 'product_form_disable_price_field': 'product_form_input'} required type='number'  fullWidth  id="outlined-basic" name='product_sale_price' value={productData?.product_sale_price} onChange={handleChange} placeholder=" Sale Price " variant="outlined" />
                    {productVariant?.length ?
                    <span className='product_form_disable_price_field_text_info'  ><Iconify icon="ic:outline-info" /> Add your product prices below in variants.</span>
                  :
                    <span className='regular_price_and_sale_price_info_text' style={{color:'#de074c',fontSize:12,fontWeight:'600'}} >**Sale price is always less than regular price.</span>
                    
                  }
                    </div>
                    </div>

                  
                      <div className='add_product_label_input' >
                      <div className='flex-justify-between' >
                      <div>
                       <Typography variant='p' >Product Variants</Typography>
                        <Typography variant='body2'  sx={{color:'text.secondary'}} className='product_Variant_desc' >Add your product variants like size, color, etc.</Typography>
                       </div>
                        <Button onClick={()=>setOpenProductVariantModal(true)}  variant='text' className='product_add_variant_btn'  startIcon={<Iconify icon="quill:add" />} > {productVariant?.length? `Edit Variants` : `Add Variants` }  </Button>
                      </div>

                    

                      {productVariant?.length ? productVariant?.map((value,index)=>(
                       <div key={index}  >
                       {index === 0 &&
                        <div className="product_variant_heading"  >
                        <p >Variants</p>
                        <p >Regular Price</p>
                        <p >Sale Price</p>
                        <p style={{visibility:'hidden'}} >Sale Price</p>
                      </div>
                       }
                         <div className='flex ' style={{width:'100%',gap:'10px',padding:'0px 5px'}}  >
                        <div className='add_product_label_input' style={{width:'40%'}} >
                        <label htmlFor="" className='font-capitalize-case' >{value?.attributes[0]} {value?.attributes[1] && `| ${value?.attributes[1]}` } </label>
                        {/* <Typography variant='body2' sx={{color:'text.secondary'}} >Variant {index + 1} </Typography> */}
                        </div>
                        <div className='add_product_label_input' style={{width:'50%'}} >
                        {/* <label htmlFor=""> Regular Price  </label> */}
                        <TextField error={(errorMessageVariant?.index == index && errorMessageVariant?.error ) ? true:false }  required type='number'  size='small' fullWidth className='product_form_input' id="outlined-basic" name="product_regular_price" value={value?.product_regular_price} onChange={(e)=>handleChangeProductVariantPrice(index,e)} placeholder=" Regular Price " variant="outlined" />
                        {/* <span className='regular_price_and_sale_price_info_text' style={{color:'#de074c',fontSize:12,fontWeight:'600'}} >**Regular price is always greater than sale price.</span> */}
                        </div>
                        <div className='add_product_label_input' style={{width:'50%'}} >
                        {/* <label htmlFor=""> Sale Price  </label> */}
                        <TextField error={(errorMessageVariant?.index == index && errorMessageVariant?.error ) ? true:false} required type='number'  size='small' fullWidth className='product_form_input' id="outlined-basic" name='product_sale_price' value={value?.product_sale_price} onChange={(e)=>handleChangeProductVariantPrice(index,e)} placeholder=" Sale Price " variant="outlined" />
                        {/* <span className='regular_price_and_sale_price_info_text' style={{color:'#de074c',fontSize:12,fontWeight:'600'}} >**Sale price is always less than regular price.</span> */}
                        </div>
                        <IconButton onClick={()=>removeProductVariantPricefield(index)} >
                        <Iconify icon="ep:remove" />
                        </IconButton>
                        </div>
                       </div>

                      ))
                      :
                      null
                    
                    }

                      </div>
                      <div className='add_product_label_input'>
                    <label htmlFor="">Product Description  </label>
                    <TextField multiline rows={5}  fullWidth className='product_form_input' name='product_description' value={productData?.product_description} onChange={handleChange} id="outlined-basic" placeholder=" Add Your Product Description  " variant="outlined" />
                    </div>
                  <div style={{paddingTop:20}} >

                    <Button  variant='text' style={{marginRight:"10px"}} onClick={()=>navigate(-1)}  startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} > Go Back  </Button>
                    {/* <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="material-symbols:check-circle" />} > Add Product </Button> */}

            <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="material-symbols:check-circle" />} > Add Product </Button>
            
                     

                    </div>
                    </form>
                    
                </div>
                <div className='file_upload_col'>
                <div className='product_file_upload_box'>
                    <FileUploadDesign fileUpload={fileUpload} handleFileUpload={handleFileUpload} />
                  </div>
                    <div className='uploaded_files_box' style={{paddingTop:20}} >
                  {fileUpload?.length > 0 && 
                   fileUpload?.map((value,index)=>(
                    <div key={index} className='uploaded-images-preview' >
                    <img className='category-table-image' alt="product" src={URL.createObjectURL(value)} />
                    <p  >{value.name?.slice(0,25)}{value.name?.length > 25 && '...'}</p>
                     <div className='remove-product-image-button' >
             <CancelIcon style={{color:'red',cursor:'pointer'}}  onClick={()=>handleRemoveImage(index)} />
                      </div> 
                    </div>
                   ))
                   }
                </div>
                </div>


            </div>
        </div>
        </div>
        </Paper>
        </div>
    </>
  )
}

export default AddProducts