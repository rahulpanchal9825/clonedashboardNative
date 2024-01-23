import React, { useState,useRef, useEffect } from 'react';
import axios from 'axios';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from 'react-router-dom';
import { InputAdornment,Container,TextField,Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import LoadingSpinner from 'src/components/Spinner';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../../components/Iconify';
import {uploadFileToFirebase,returnFileName,deleteImageFromFirebase,splitString} from "../../../global/globalFunctions"
import noImage from '../../../assests/No_image.svg'
import palette from '../../../theme/palette';
import ConfimModal from "../../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import PopupModal from 'src/global/Modals/PopupModal';
import ImageError from 'src/global/Modals/ImageError';
import ImageGuidelines from 'src/global/Modals/ImageGuidelines';
import { editable_config } from 'src/editable_config';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';

function EditMainCategory({handleClose}) {
  const [fileUpload, setFileUpload] = useState(null);
    const [mainCategory, setMainCategory] = useState([]);
    const [searchMainCategory, setSearchMainCategory] = useState('');
  const [ userselectedCategory , setuserSelectedCategory ] = useState({main_Catgeory:''})
  const [newMainCategory , setNewMainCategory] = useState({name:"",image:null})
  const [showEditBox , setShowEditBox ] = useState(false)
  const [ render, setRender ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [openConfimModal ,setOpenConfimModal] = useState(false)
  const [message ,setMessage] = useState({type:"",message:""})
  const [ addMainCategory,setAddMainCategory ] = useState('')
  const [ openPopupModal, setOpenPopupModal ] = useState(false)
  const [ openImageGuidePopupModal, setOpenImageGuidePopupModal ] = useState(false)
  const {authState} = UseContextState()
  const scrollRef = useRef(null);
  const navigate = useNavigate()

  console.log(userselectedCategory)
  console.log(mainCategory)
  console.log("NEWMAIN=>",newMainCategory)

  const goToImageCompressor=()=>{
    navigate('/dashboard/tools-and-services/imagecompressor')
  }

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
  }, [render]);
  //================= GET ALL MAIN CATEGORY =================

   //================= HANDLE ON SELECT CATEGORIES AND GET SELECTED CATEGORIES  =================
   const handleSelectedMainCategory=(selectedMainCategory,mainCategoryImage)=>{
   
    setuserSelectedCategory((prev)=>({...prev,main_Catgeory:selectedMainCategory}))
    setNewMainCategory((prev)=>({...prev,name:selectedMainCategory,image:mainCategoryImage}))
    setFileUpload(null)
    setShowEditBox(true)
    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  //================= HANDLE ON SELECT CATEGORIES AND GET SELECTED CATEGORIES =================

  console.log("fileUpload",fileUpload)
  // ################### MAIN CATEGORY IMAGE UPLOAD  ########################
  const handleMainCategoryFileChange =async (e) => {
    if(e.target.files){
      for(let i=0;i<e.target.files?.length;i++){
        if(e.target.files[i]?.size > editable_config?.CategoryImageUploadSize){
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
    const image = e.target.files[0]
    setFileUpload(image);
    setNewMainCategory((prev)=>({...prev,image:null}))
  };
// ################### MAIN CATEGORY IMAGE UPLOAD  ########################

// ================ REMOVE MAIN CATEGORY IMAGE =======================
const handleRemoveMainCategoryImage =async(mainCategoryObj,userselectedCategory)=>{
    console.log("DELETE IMAGE FUNCTION",mainCategoryObj)
 
     
      deleteImageFromFirebase(mainCategoryObj?.image?.path,mainCategoryObj?.image?.image_name)
        await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/delete/main/category/image/?old_main_category_name=${userselectedCategory?.main_Catgeory}`,{},{headers: {
          'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
        },withCredentials:true})
        .then(res=>{
          console.log(res)
         if(res?.data?.status === true){
          setMessage((prev)=>({...prev,type:"success",message:"Image Deleted Successfully !"}))
          setSnackbarOpen(true)
          setOpenConfimModal(false)
          setRender(prev=>!prev)
          setNewMainCategory((prev)=>({...prev,image:null}))
          setFileUpload(null)
        // setShowEditBox(false)
         }
        
        })
        .catch(err=>{
          setMessage((prev)=>({...prev,type:"error",message:"Image Deleted Failed !"}))
          console.log(err)
        })
      // setFileUpload((prev)=>({...prev,mainCategoryImage:null}));
        
  }
//========================= REMOVE MAIN CATEGORY IMAGE =================

 // ======================== HANDLE SAVE ======================== 
 const handleSubmit=async(e)=>{
  e.preventDefault()
  setLoading(true)
  let mainCategoryImageToFirebase;
  if(fileUpload){
   mainCategoryImageToFirebase=await uploadFileToFirebase(`/${process.env.REACT_APP_IMAGES_FOLDER_NAME}/users/${authState?.user?.app_id}/allcategories/maincategories/${newMainCategory?.name}/`,fileUpload)
  }
    let data={
        main_category_name:newMainCategory?.name?.trim(),
        main_category_slug:splitString(newMainCategory?.name),
        main_category_image:mainCategoryImageToFirebase
    }
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/update/all/main/category/?old_main_category_name=${userselectedCategory?.main_Catgeory}`,{...data},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
        console.log(res)
        setMessage((prev)=>({...prev,type:"success",message:"Category Updated Successfully !"}))
        setSnackbarOpen(true)
        setLoading(false)
        // setShowEditBox(false)
        setRender(prev=>!prev)
    })
    .catch(err=>{
        console.log(err)
        setMessage((prev)=>({...prev,type:"error",message:"An Error Occured !!"}))
        setSnackbarOpen(true)
        setShowEditBox(false)
        setLoading(false)
    })
}

 // ======================== HANDLE SAVE ======================== 

// ############## CONFIRM MAIN CATEGORY MODAL ###########
const handleCloseMainCategoryConfirmModal=()=>{
  setOpenConfimModal(false)
  
}
// ############## CONFIRM MAIN CATEGORY MODAL ###########

// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};
// ##################### SNACK BAR FUNCTIONs ##################

// ##################### ADD NEW MAIN CATEGORY #################
const handleAddMainCategory=async(data)=>{
  if(!data?.length){
    setMessage((prev)=>({...prev,type:'error',message:"Please Add Main Category Name !!"}))
    setSnackbarOpen(true)
    return
  }
  // if(!data?.length) return alert("Enter Category Name !!")
  const addData ={
    mainCategory:data,
    main_category_slug:splitString(data)
  }
  console.log("NEW MAIN CATEGORY DATA",addData)
  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create/maincategory`,{...addData},{headers: {
    'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
  },withCredentials:true})
  .then(res=>{
    console.log(res)
    setAddMainCategory('')
    setMessage((prev)=>({...prev,type:'success',message:"Main Category Added Successfully !!"}))
    setSnackbarOpen(true)
    setRender(prev=>!prev)
  })
  .catch(err=>{
    console.log(err)
  })
}
// ##################### ADD NEW MAIN CATEGORY #################

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

// handle close show edit box
const handleCloseShowEditbox=()=>{
    setShowEditBox(false);
    setuserSelectedCategory({main_Catgeory:''})
    setNewMainCategory({name:"",image:null})


}

    
console.log("FILE UPLOAD ___________",fileUpload)


  return (
   <>
      {/* #################### SANCKBAR MESSAGE ######################## */}
       <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 {/* #################### SANCKBAR MESSAGE ######################## */}

 {/* #################### LOADING SPINNNER ######################## */}
 <LoadingSpinner loading={loading} />
 {/* #################### LOADING SPINNNER ######################## */}

     {/*===== IMAGE SIZE ERROR Popup  Modal ====== */}
     <PopupModal handleClose={handleClosePopupModal}open={openPopupModal} data={<ImageError handleClose={handleClosePopupModal} onYes={onYesFunction}  confirmBtnName='Image Compress Now' title='Reduce Image Size!! ' message='Max category image upload size is 1Mb. For more read our image upload guidelines.'  />} />
        {/*===== IMAGE SIZE ERROR Popup Modal ====== */}
       {/*===== Popup Modal ====== */}
       <PopupModal handleClose={handleCloseImageGuidelinePopupModal}open={openImageGuidePopupModal} data={<ImageGuidelines handleClose={handleCloseImageGuidelinePopupModal}  />} />
        {/*===== Popup Modal ====== */}

   {/* <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
</div> */}
        <Container maxWidth="md" className='main-categrory-container-box'>
    {/* <div className='add-category-pad-top-bot'>
        <h2  >
       Create or Edit Main Category
        </h2>
        <p>  Create and Edit your Product Main Category from here</p>
    </div> */}
 
  {/*============ CONFIRM MODAL ============ */}
  <ConfimModal open={openConfimModal} title="Delete Image" onYes={()=>handleRemoveMainCategoryImage(newMainCategory,userselectedCategory)} message="Are you sure you want to delete category image?" handleClose={handleCloseMainCategoryConfirmModal}  />
       {/*============ CONFIRM MODAL ============ */}
    

    <div className='main-category-edit-box' >
   
             {/* ======================= MAIN CATEGORY SELECTION BOX ===================== */}
             <div className="main-edit-category-list">
             <div style={{paddingBottom:5}}>
        <h4  >
       Add a Main Categroy
        </h4>
       
    </div>
      {/* <label htmlFor="">Main Category  </label> */}
      <div className=' add_main_cate_feild_box '  >
       <div className='add_main_cate_input_box' >
       <TextField required fullWidth id="outlined-basic" value={addMainCategory} onChange={(e)=>setAddMainCategory(e.target.value?.replace(/[^0-9a-zA-Z ]/g,''))}  placeholder="Main Category Name " variant="outlined" />
       <Button   variant='contained' onClick={()=>handleAddMainCategory(addMainCategory?.trim())}  style={{padding:"15px 30px",fontSize:16,marginLeft:10}} startIcon={<Iconify icon="ant-design:plus-outlined" />} > Add </Button>
       </div>
       <span className='regular_price_and_sale_price_info_text' style={{color:'#878787',paddingTop:4,fontSize:12,fontWeight:'600'}} >*You cannot use any special symbols(eg. &^%$#@!*)</span>

      </div>
      <div style={{paddingBottom:5,paddingTop:10}}>
        <h4  >
       Edit or Modify Your Main Category 
        </h4>
       
    </div>
          
                <div className="category-single-search">
                  
                  <SearchIcon style={{ color: '#637281' }} />
                  <input
                    className="remove-radius-input"
                    value={searchMainCategory}
                    onChange={(e) => setSearchMainCategory(e.target.value)}
                    type="search"
                    placeholder="Search In Main Category..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <ul>
                  {mainCategory
                    ?.filter((value) => {
                      if (searchMainCategory === '') {
                        return value;
                      } else if (value?._id?.toLowerCase().includes(searchMainCategory?.toLowerCase())) {
                        return value;
                      }
                    })
                    .map((value, index) => (
            
                      <div key={value?._id}
                      onClick={()=>handleSelectedMainCategory(value?._id,value?.main_category_image)}
                      className={value?._id === userselectedCategory?.main_Catgeory ? "add-product-category-list-active ":"add-product-category-list" }>
                      <div 
                      className='main-category-style' >
                      <img
                          className="product-table-image"
                          alt="product"
                          src={
                            value?.main_category_image?.image_url  ?  value?.main_category_image?.image_url :noImage
                          }
                        />

                        <li className="category-text">{value?._id}</li>
                      </div>

                          

                       <div className='selected_cate_icon' >
                       {value?._id === userselectedCategory?.main_Catgeory && <DoubleArrowIcon style={{color:palette.primary.main}} />}
                       </div>



                       
                      </div>

                      


                    ))}
                
               {/* <li>asda</li>
               <li>asda</li>
               <li>asda</li>
               <li>asda</li>
               <li>asda</li> */}
                </ul>
                {/* ======================= MAIN CATEGORY SELECTION BOX ===================== */}
               

              </div>
              {/* ============================= EDIT BOX ======================= */}
               {showEditBox && (
                <div className='edit-name-maincategory-box' ref={scrollRef} id='open_edit_category' >
                    <IconButton onClick={handleCloseShowEditbox} style={{color:'text.secondary'}} className='close-main-category-edit-box-icon' >
          <Iconify icon="material-symbols:close" />
          </IconButton>
                 <form onSubmit={handleSubmit} className="edit-name-maincategory" >

             <div className='main-category-image-change' >
                 <img
                               className="edit-main-category-image"
                               alt="product"
                          
                               src={ newMainCategory?.image?.image_url?.length ? newMainCategory?.image?.image_url : fileUpload ? URL.createObjectURL(fileUpload) :
                                noImage
                               }

                             />
             
           {!newMainCategory?.image?.image_url && <Button className='upload-edit-main-category' variant="text" component="label" startIcon={<Iconify icon="ant-design:cloud-upload-outlined" />} >
             Upload
             <input hidden accept="image/*" type="file" name="mainCategoryImage"  onChange={handleMainCategoryFileChange } />
           </Button>}
              </div>
                 <p style={{paddingBottom:4,paddingTop:22,fontWeight:500}}>Main Category Name </p>

             <TextField 
              fullWidth required id="outlined-basic" value={newMainCategory?.name} onChange={(e)=>{setNewMainCategory((prev)=>({...prev,name:e.target.value?.replace(/[^0-9a-zA-Z ]/g,'')}))}} placeholder="Main Category " variant="outlined" />
              <span className='regular_price_and_sale_price_info_text' style={{color:'#878787',fontSize:12,fontWeight:'600'}} >*You cannot use any special symbols(eg. &^%$#@!*)</span>
              <div className='main-category-remove-image-icon' >
             {(newMainCategory?.image?.image_url || fileUpload )&&  <Iconify style={{color:palette.primary.main,cursor:'pointer',width:'20px',height:'20px'}} onClick={()=>setOpenConfimModal(true)} icon="eva:trash-2-outline" /> }
             

             </div>
           
              <div style={{paddingTop:20}} >
                      <Button  variant='text'  style={{marginRight:"10px"}} onClick={()=>navigate(-1)} startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} > Go Back  </Button>
                     
                    <Button className='category_Save_btn'  variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="bxs:check-circle" />} > Save Changes </Button>
                   
                       </div>
                
                      
             </form>
             <div className="category-image-guide-box">
    <Button onClick={handleOpenImageGuidelinePopupModal} variant="text"  className='image-guide-btn-text' startIcon={<Iconify icon="eva:image-fill" />}>Image Guidelines</Button>
   {/* <a href={editable_config.ImageCompressorLink} target="_blank"><Button variant="text"  className='image-guide-btn-text' startIcon={<Iconify icon="fluent:resize-image-20-filled" />}>Image Compressor</Button></a> */}
   </div>
             </div>
             
               )}
              {/* ============================= EDIT BOX ======================= */}

        </div>
    
  
   </Container>




   </>
  )
}

export default EditMainCategory