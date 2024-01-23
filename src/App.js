// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';


export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
      {/* FOR REACT TOAST NOTIFICATION */}
      {/* FOR WEB */}
      <ToastContainer
        className='toast-notification-class-web'
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="colored"
          />
          {/* FOR WEB */}
          {/* FOR MOBILE */}
          <ToastContainer
          className='toast-notification-class-mobile'
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="colored"
          />
          {/* FOR MOBILE */}

      {/* FOR REACT TOAST NOTIFICATION */}
    </ThemeProvider>
  );
}
