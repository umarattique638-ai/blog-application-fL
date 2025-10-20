import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { resetAuthState, resetUser, verificationUser } from '@/feature/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteSignIn } from '@/helper/RouteName';
import { resetUserState } from '@/feature/userSlice';

function ConfirmVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams(); // ✅ Extract token from route
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await dispatch(verificationUser(token)).unwrap();

        if (response.message === "User already verified") {
          toast.info(response.message); // ℹ️ Use info toast for already verified
        } else {
          toast.success(response.message); // ✅ Success for newly verified
        }

        setStatus('success');
        dispatch(resetAuthState())
        dispatch(resetUserState())
        dispatch(resetUser())

        setTimeout(() => {
          navigate(RouteSignIn);
        }, 2000);
      } catch (error) {
        toast.error(error?.message || "Verification failed.");
        setStatus('error');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
    }
  }, [dispatch]);


  if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {status === 'success' && (
        <Card className="p-10 border border-green-500 text-center">
          <h1 className="text-lg font-bold text-green-600">✅ Email Verified Successfully</h1>
          <p className="text-sm mt-2">Redirecting to sign in...</p>
        </Card>
      )}
      {status === 'error' && (
        <Card className="p-10 border border-red-500 text-center">
          <h1 className="text-lg font-bold text-red-600">❌ Email Verification Failed</h1>
          <p className="text-sm mt-2">Please try again or contact support.</p>
        </Card>
      )}
    </div>
  );
}

export default ConfirmVerification;
