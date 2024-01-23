import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';

// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar,Typography,Button, IconButton, Tooltip, Badge } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import LogoutButton from './LogoutButton';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { editable_config } from 'src/editable_config';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 215;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 72;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5,0,2),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  // const {authState} = UseContextState();
  const navigate = useNavigate()

  return (
    <RootStyle>
 
      <ToolbarStyle className='navbarallitems'>
        <div className='humbarger_and_planstatus_and_btn'>
        <IconButton className='humbtn' onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        {/* <Searchbar /> */} 

         <Typography variant="h5" color={'#212b36'} className='font-capitalize-case' >
          👋 Hi {editable_config?.Admin_Name} Admin, Welcome back
        </Typography> 
       <div className='hidelogout-btn-web' >
       <LogoutButton />
       </div>
        </div>
        
        <Box className='blank_box' sx={{ flexGrow: 1 }} />
        <div className='hidelogout-btn-mobile' >
       <LogoutButton />
       </div>
      </ToolbarStyle>
    </RootStyle>
  );
}
