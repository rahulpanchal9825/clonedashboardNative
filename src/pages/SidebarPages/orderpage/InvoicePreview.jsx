import React, { useRef } from 'react'
import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Invoice from './InvoiceTemplate/Invoice';
import palette from 'src/theme/palette';
import Iconify from 'src/components/Iconify';

function InvoicePreview({orderDetail,handleClose}) {

  const pdfExportComponent = useRef(null);

  const handleExportWithComponent = event => {
    pdfExportComponent.current.save();
  };
  return (
    <div>
        <Container  >
         <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
    {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
</div>
          {/* <div style={{textAlign:'left'}} >
          <h2>Inovice Preivew</h2>
          </div> */}

    <PDFExport scale={0.6} ref={pdfExportComponent}  margin={10} paperSize='a4'  >
    <Invoice orderDetail={orderDetail} />
        </PDFExport>
        <div style={{display:'flex',justifyContent:'center',marginBottom:22}} > 
          <Button onClick={handleClose}  variant="text"  style={{marginRight:10}}  startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} >  
                 Go Back
                    </Button>
          <Button onClick={handleExportWithComponent}  variant="contained"  startIcon={<Iconify icon="basil:invoice-solid" />}>  
                Download Invoice
                    </Button>
          </div>
        </Container>
    </div>

  )
}

export default InvoicePreview