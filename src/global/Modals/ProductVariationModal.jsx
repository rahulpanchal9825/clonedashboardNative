import React,{useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import {MenuItem,Menu,OutlinedInput,Chip,InputLabel,Checkbox,ListItemText,FormControl,Select, InputAdornment, Tooltip, } from '@mui/material';
import Iconify from 'src/components/Iconify';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LoadingSpinner from 'src/components/Spinner';
import { LoadingButton } from '@mui/lab';
import { IconButton, TextField ,} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { TagsInput } from "react-tag-input-component";
import utils from 'src/utils/utils';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  // bgcolor: 'white',
  border: 'none',
  boxShadow: 4,
  borderRadius:1,
  p: 3,
};

export default function ProductVariationModal(props) {
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
// const [selected, setSelected] = useState([]);
const [valueColor, setValueColor] = useState('');
// const [anchorEl, setAnchorEl] = React.useState(null);
// const open = Boolean(anchorEl);
// const handleClick = (event) => {
//   setAnchorEl(event.currentTarget);
// };
// const handleClose = (i) => {
//   setAnchorEl(null);
// };
// for auto complete feilds
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const availablecolors=utils.availablecolors

// const handleChangeComplete = (color) => {
//   console.log("valueColor-",color)
//   setValueColor(color.hex);
  
// };

  return (
    <div>
    <LoadingSpinner  />
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
       
            
            // BackdropComponent={Backdrop}
            // BackdropProps={{
            // timeout: 500,
            //  }}
        // disableEscapeKeyDown={false}
      >
         
        <Box sx={style}>
        <IconButton onClick={props.handleClose} style={{color:'text.secondary'}} className='close-upgrade-icon' >
          <Iconify icon="material-symbols:close" />
          </IconButton>
          <Typography id="modal-modal-title" style={{fontSize:20}} variant="h6" component="h2">
            Product Variants
          </Typography>
          <Typography id="modal-modal-description" sx={{ fontSize:16,fontWeight:'500',color:'text.secondary' }}>
          {props?.sub_title}
          </Typography>
         <form onSubmit={props.onYes}>
            {props?.productVariantFields?.map((value,index)=>(
                <div className='flex' style={{width:'100%',gap:'10px'}} >
                <div className='add_product_label_input'  >
                         <label htmlFor=""> Option Name*  </label>
                         <TextField
                         id="outlined-start-adornment"
                         placeholder="E.g. Size, Material"
                         name='option_name'
                         value={value?.option_name}
                         onChange={(e)=>props?.handleChangeProductVariants(index,e)}
                         InputProps={{
                             endAdornment: <InputAdornment position="end">
                             <div>
                             <IconButton
                             size='small'
                             id="basic-button"
                             aria-controls={Boolean(value?.anchorEl) ? 'basic-menu' : undefined}
                            //  aria-haspopup="true"
                             aria-expanded={Boolean(value?.anchorEl) ? 'true' : undefined}
                            //  onClick={handleClick}
                             onClick={(e)=>props?.handleClickOpenSelectVariantList(index,e)}
                             >
                             <Iconify icon="ri:arrow-down-s-fill" />
                             </IconButton>
                             <Menu
                             id="basic-menu"
                             anchorEl={value?.anchorEl}
                             open={Boolean(value?.anchorEl)}
                            //  onClose={handleClose}
                             onClose={(e)=>props?.handleClickCloseSelectVariantList(index,e)}
                             anchorOrigin={{
                                 vertical: 'top',
                                 horizontal: 'left',
                             }}
                             transformOrigin={{
                                 vertical: 'top',
                                 horizontal: 'left',
                             }}
                             >
                             <MenuItem disabled={value?.option_name == 'size' ?true:false} onClick={(e)=>{props?.handleSelectProductVariantsOption(index,'size'); props?.handleClickCloseSelectVariantList(index,e)}}>Size</MenuItem>
                             <MenuItem disabled={value?.option_name == 'weight' ?true:false} onClick={(e)=>{props?.handleSelectProductVariantsOption(index,'weight'); props?.handleClickCloseSelectVariantList(index,e)}}>Weight</MenuItem>
                             <MenuItem disabled={value?.option_name == 'color picker' ?true:false} onClick={(e)=>{props?.handleSelectProductVariantsOption(index,'color picker'); props?.handleClickCloseSelectVariantList(index,e)}}>Color Picker</MenuItem> 
                             </Menu>
                             </div>
                                     </InputAdornment>
                                     }}
                                     />
                                      <span className='regular_price_and_sale_price_info_text' style={{color:'#878787',fontSize:11,fontWeight:'500'}} >**Choose existing or Add your's  </span>
             </div>
                 <div className='add_product_label_input' style={{width:'100%'}} >
                         <label htmlFor=""> Option Values* </label>
                         {value?.option_name == 'color picker'
                         ?
                         <Autocomplete
                         multiple
                        //  limitTags={2}
                         id="checkboxes-tags-demo"
                         value={value?.option_values}
                         onChange={(e,value)=>props?.handleProductVariantsOptionsValue(index,value)}
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
                         :
                         <TagsInput
                         style={{width:'100%'}}
                           value={value?.option_values}
                           onChange={(e)=>props?.handleProductVariantsOptionsValue(index,e)}
                           name="option value"
                           separators={['Enter',',']}
                           placeHolder="Enter values and press enter"
                       />
                         }
                          


                           <span className='regular_price_and_sale_price_info_text' style={{color:'#878787',fontSize:11,fontWeight:'500'}} >**Duplicate values are not alloweded.</span>
                         
                 </div>
                 
             <IconButton  onClick={()=>props?.removeProductVariants(index)} >
                           <Iconify icon="eva:trash-2-outline" />
                           </IconButton>
                           
             </div>
            ))  }
          
         
        {props?.productVariantFields?.length < 2 ?
         <Button onClick={props?.addMoreProductVariants} style={{marginTop:"10px"}} variant='text'  startIcon={<Iconify icon="quill:add" />}  >Add another Option</Button>
        :null
        }
        

         <div className='product_variant_bottom_box'  >
         <span className='' style={{fontSize:14,fontWeight:'500',color:'#878787',}} >**Note : You can add prices after this step.</span>
         <div>
         <Button variant='text' onClick={props.handleClose}  >Discard</Button>
          <LoadingButton
        
         loading={props.loading}
         onClick={props.createVariantListForPriceFilling}
         loadingPosition="start"
         startIcon={<Iconify icon="material-symbols:check-circle" />} 
         variant="contained"
         style={{marginLeft:"10px"}}

       >
         <span>{props?.btn_title} </span>
       </LoadingButton>
         </div>
         {/* <Button style={{marginLeft:"10px"}} variant='contained' onClick={props.onYes} startIcon={<Iconify icon="material-symbols:check-circle" />}  >{props.saveBtnName}</Button> */}
         </div>
         </form>

        </Box>

      </Modal>
    </div>
  );
}