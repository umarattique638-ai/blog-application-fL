import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '@/helper/firebase';
import { googleLogin, setUser } from '@/feature/authSlice';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { RouteIndex } from '@/helper/RouteName';
import { Button } from './ui/button';

function GoogleLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleGoogleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;

      const formData = {
        name: user.displayName || "No Name",
        email: user.email,
        avatar: user.photoURL || "https://github.com/shadcn.png",
      };

      const response = await dispatch(googleLogin(formData)).unwrap();
      dispatch(setUser(response.user.user))

      toast.success(response.message);
      navigate(RouteIndex);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google login failed");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Button variant="ghost" onClick={handleGoogleLogin} disabled={loading}>
      {loading ? <Spinner /> : <FcGoogle />}
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
}

export default GoogleLogin;
