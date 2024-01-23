import { Navigate, useRoutes,BrowserRouter,Route,Routes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import { UseContextState } from './global/GlobalContext/GlobalContext';

import User from './pages/User';
import Login from './pages/Login';

import ProtectedRoute from './utils/ProtectedRoute';
import Products from "./pages/Products"
import Orders from "./pages/Orders"
import DashboardApp from "./pages/DashboardApp"
import Banners from './pages/Banners';
import Enquiry from './pages/Enquiry';
import Category from './pages/Category';
import Settings from './pages/Settings';
import EditUser from './pages/SidebarPages/userpage/EditUser';
import AddProducts from './pages/SidebarPages/productpage/AddProducts';
import EditProduct from './pages/SidebarPages/productpage/EditProduct';
import ViewOrder from './pages/SidebarPages/orderpage/ViewOrder';
import CategoryPage from './pages/SidebarPages/categorypage/CategoryPage';
import NewEditCategoryPage from './pages/SidebarPages/categorypage/NewEditCategoryPage';
import ShiprocketPluginDetails from './pages/SidebarPages/pluginsdetailspage/ShiprocketPluginDetails';
import RazorpayPluginDetails from './pages/SidebarPages/pluginsdetailspage/RazorpayPluginDetails';
import PushNotifi from './pages/PushNotifi';


// ----------------------------------------------------------------------

export default function Router() {
  const {authState} = UseContextState()

  console.log("AUTHSTATE",authState)
  const userState = authState.isAuthenticated
     return (

     <Routes>
     <Route element={<ProtectedRoute/>} >
     <Route exact path="/"  element={ <Navigate to='/dashboard/analytics' />    }  />    
     <Route path="/dashboard/analytics" element={ <DashboardLayout Component={<DashboardApp/>} />} />
     <Route path="/dashboard/products" element={ <DashboardLayout Component={<Products/>} />} />
     <Route path="/dashboard/products/add/new" element={ <DashboardLayout Component={<AddProducts/>} />} />
     <Route path="/dashboard/edit/product/:product_id" element={ <DashboardLayout Component={<EditProduct/>} />} />
     <Route path="/dashboard/orders" element={ <DashboardLayout Component={<Orders/>} />} />
     <Route path="/dashboard/customers" element={ <DashboardLayout Component={<User/>} />} />
     <Route path="/dashboard/customers/view/:user_id" element={ <DashboardLayout Component={<EditUser/>} />} />
     <Route path="/dashboard/view/order/details/:order_id" element={ <DashboardLayout Component={<ViewOrder/>} />} />
     <Route path="/dashboard/enquiries" element={ <DashboardLayout Component={<Enquiry/>} />} />
     <Route path="/dashboard/banners" element={ <DashboardLayout Component={<Banners/>} />} />
     <Route path="/dashboard/categories" element={ <DashboardLayout Component={<Category/>} />} />
     <Route path="/dashboard/categories/add/new" element={ <DashboardLayout Component={<CategoryPage/>} />} />
     <Route path="/dashboard/edit/category/:main_category_id" element={ <DashboardLayout Component={<NewEditCategoryPage/>} />} />
     <Route path="/dashboard/settings" element={ <DashboardLayout Component={<Settings/>} />} />
     <Route path="/dashboard/app-push-notification" element={ <DashboardLayout Component={<PushNotifi/>} />} />
     <Route path="/dashboard/shiprocket" element={ <DashboardLayout Component={<ShiprocketPluginDetails/>} />} />
     <Route path="/dashboard/razorpay-payments" element={ <DashboardLayout Component={<RazorpayPluginDetails/>} />} />

 
   
      </Route>
       <Route exact path="/login" element={<LogoOnlyLayout Component={<Login/>} />   } />
       {/* <Route path="/upgrade/plan" element={ <DashboardLayout Component={<PlanDetails/>} />} /> */}
       <Route exact path="*" element={<Navigate to="/login" />   } />
   </Routes>

    )
}
