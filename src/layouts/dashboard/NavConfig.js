// component
import Iconify from '../../components/Iconify';
import imageImport from 'src/utils/imageImport';
// ----------------------------------------------------------------------

// const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const getIcon = (name) => <img src={name} className='nav_icon'  />;

const navConfig = [
  {
    title: 'Analytics',
    path: '/dashboard/analytics',
    icon: getIcon(imageImport.icon_sidebar3),
    // icon: getIcon('logos:google-analytics'),
  },
  {
    title: 'orders',
    path: '/dashboard/orders',
    icon: getIcon(imageImport.icon_sidebar7),
    // icon: getIcon('emojione-v1:shopping-bags'),
    // icon: getIcon('bxs:box'),
  },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon(imageImport.icon_sidebar16),
    // icon: getIcon('bxs:box'),
    // icon: getIcon(imageImport.icon_dashboard),
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: getIcon(imageImport.icon_sidebar5),
    // icon: getIcon('material-symbols:category-rounded'),
  },
  {
    title: 'Customers',
    path: '/dashboard/customers',
    // icon: getIcon('eva:people-fill'),
    icon: getIcon(imageImport.icon_sidebar9),
    // icon: getIcon('fluent-emoji:man-feeding-baby-light'),
  },
  {
    title: 'banners',
    path: '/dashboard/banners',
    icon: getIcon(imageImport.icon_sidebar12),
    // icon: getIcon('vscode-icons:file-type-image'),
  },

  {
    title: 'Enquiries',
    path: '/dashboard/enquiries',
    icon:getIcon(imageImport.icon_sidebar22),
    // icon: getIcon('cryptocurrency-color:chat'),
  },

  
  {
    title: 'Push Notification',
    path: '/dashboard/app-push-notification',
    icon: getIcon(imageImport.icon_sidebar25),
  },
  {
    title: 'Payments',
    path: '/dashboard/razorpay-payments',
    icon: getIcon(imageImport.icon_sidebar8),
  },
  {
    title: 'Shipping',
    path: '/dashboard/shiprocket',
    icon: getIcon(imageImport.icon_sidebar24),
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon(imageImport.icon_sidebar20),
    // icon: getIcon('flat-color-icons:settings'),
  },



];

export default navConfig;
