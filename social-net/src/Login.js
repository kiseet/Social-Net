import { Button } from '@mui/material';
import{auth,provider} from './firebase'
import React from 'react';
import './Login.css';

function Login() {
    const signIn =() =>{
        auth.signInWithPopup(provider)
        .then((result) => {
            dispatchEvent({
                type :actionTypes.SET_USER,
                user:result.user
            })
        }
            ).catch((error)=>alert(error.message))
    }
 

  return (
    <div className='login'>
        <h1>Login</h1>
        <div className='login__text'>
            <h1>Sign into SocialNet</h1>

        </div>
        <Button type="submit" onClick={signIn}>
            Sign In With Google

        </Button>

    </div>
  )
}

export default Login