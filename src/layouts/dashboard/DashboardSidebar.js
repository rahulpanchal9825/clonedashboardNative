import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import Iconify from 'src/components/Iconify';
import { editable_config } from 'src/editable_config';
import imageImport from 'src/utils/imageImport';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';
import palette from 'src/theme/palette';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 215;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH ,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const {authState} = UseContextState()
  const navigate = useNavigate()

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  function handleOpenVideoModal(){
    // setOpenVideoModal(true)
    const url ="https://google.com/"
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 0, py: 4,pb:2, justifyContent:'center',display: 'inline-flex' }}>
        <Logo />
      </Box>
      {authState?.user?.app_dashboard_status 
        ?
        <NavSection navConfig={navConfig} />
        :
        <NavSection navConfig={navConfig} />

      }

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 1, mt: 5 }}>
        <Stack alignItems="center" spacing={1} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src={imageImport.useravtarImg}
            sx={{ width: 100, position: 'absolute', top: -60 }}
          />
            
             <Typography variant="h5" className='font-capitalize-case'  >
       Upsellz App
        </Typography>
             <Typography variant="body2"  style={{color:'gray',marginTop: -2,fontSize:12 }} >
       version 1.0.0
        </Typography>
        </Stack>
      </Box>
      
       

    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
