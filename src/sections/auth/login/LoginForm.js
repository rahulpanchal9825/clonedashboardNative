import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from 'src/components/Spinner';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment, Typography, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { UseContextState } from '../../../global/GlobalContext/GlobalContext'
import {config} from "../../../global/globalConfig"
import { editable_config } from 'src/editable_config';
import palette from 'src/theme/palette';
import { copyContentFunc } from 'src/global/globalFunctions';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error , setError ] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

;
const demoUser =  "admin@gmail.com";
const demopassword =  "123456";


useEffect(()=>{
  setEmail(demoUser)
  setPassword(demopassword)
},[])

  const {authState,fetchAuthuser} = UseContextState();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`,{email,password},{headers: {
      'Authorization': `token ${editable_config.FRONTEND_VALIDATOR}`,
    },withCredentials:true})
    .then(res=>{
      console.log(res)
      if(res?.data?.status === true){
        console.log("CALLED")
        setLoading(false)
        fetchAuthuser()
        navigate(from,{replace:true});
        setError("")
      }else{
        setError("Invalid email or password !!")
        setLoading(false)
      }

    })
    .catch(err=>{
      console.log(err)
    })
  };

 



  return (
    <div>
       <LoadingSpinner loading={loading} />
      {error && (<p className='show-error-login' >{error}</p>)}
       <FormProvider methods={methods} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <RHFTextField
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
         name="email" label="User Name" />

        <RHFTextField
          name="password"
          label="Password"
          required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" >
        Login
      </LoadingButton>
    </FormProvider>

             <div className="demo_account_credentials_box">
             <Typography className='demo_account_credentials' variant="subtitle2" >
             Demo User
                </Typography>
            <div>
            <Typography className='demo_account_credentials' variant="body2"  >
              User:- {' '}
                <Typography variant="subtitle2" >
                admin@gmail.com
                </Typography>
                <Tooltip arrow title="Copy" placement="top-start"><IconButton  onClick={()=>copyContentFunc(demoUser)} style={{color:palette.primary.main}} size='small'  ><Iconify className='copy-icon' icon="mingcute:copy-fill" /></IconButton>
                            </Tooltip>
              </Typography>
              
              <Typography className='demo_account_credentials' variant="body2"  >
              Password:- {' '}
                <Typography variant="subtitle2" >
                123456
                </Typography>
                <Tooltip arrow title="Copy" placement="top-start">
                  <IconButton onClick={()=>copyContentFunc(demopassword)}  style={{color:palette.primary.main}} size='small'  ><Iconify className='copy-icon' icon="mingcute:copy-fill" /></IconButton>
                  </Tooltip>
              </Typography>
            </div>
             </div>

    </div>
  );
}
