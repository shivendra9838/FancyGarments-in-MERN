import React, { useState, useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const showMessage = keyframes`
  0% {
    opacity: 0;
    transform: rotateY(-90deg);
  }
  50% {
    opacity: 0.5;
    transform: rotateY(30deg);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
`;

const SuccessMessage = styled.p`
  opacity: 0;
  transform: rotateY(-90deg);
  animation: ${showMessage} 1s forwards;
  color: green;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 3rem auto;
  gap: 1.25rem;
  color: #333;
  padding: 2rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #333;
  }
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const AuthForm = () => {
 

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resetToken, setResetToken] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-otp`, { email: formData.email });
      if (response.data.success) {
        toast.success(response.data.message);
        setResendTimer(30);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSuccess(false);
    setErrorMessage('');

    const { name, email, password } = formData;

    try {
      if (isOtpMode) {
        let endpoint = '';
        let payload = {};

        if (currentState === 'Sign Up') {
           endpoint = '/api/user/verify-register-otp';
           payload = { name, email, password, otp };
        } else if (currentState === 'Forgot Password') {
           endpoint = '/api/user/verify-forgot-otp';
           payload = { email, otp };
        } else {
           endpoint = '/api/user/verify-login-otp';
           payload = { email, otp };
        }
        
        const response = await axios.post(`${backendUrl}${endpoint}`, payload);
        if (response.data.success) {
          toast.success(response.data.message);
          
          if (currentState === 'Forgot Password') {
            setIsOtpMode(false);
            setCurrentState('Reset Password');
            setOtp('');
            if (response.data.resetToken) {
              setResetToken(response.data.resetToken);
            }
            return;
          }

          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setIsSuccess(true);
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      if (currentState === 'Reset Password') {
         const response = await axios.post(`${backendUrl}/api/user/reset-password`, { email, newPassword: password, resetToken });
         if (response.data.success) {
            toast.success(response.data.message);
            setCurrentState('Login');
         } else {
            toast.error(response.data.message);
         }
         return;
      }

      let endpoint = '';
      let payload = {};

      if (currentState === 'Sign Up') {
         endpoint = '/api/user/register';
         payload = { name, email, password };
      } else if (currentState === 'Forgot Password') {
         endpoint = '/api/user/forgot-password';
         payload = { email };
      } else {
         endpoint = '/api/user/login';
         payload = { email, password };
      }

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (response.data.success) {
        if (response.data.isOtpRequired) {
          toast.success(response.data.message);
          setIsOtpMode(true);
          setResendTimer(30);
        } else {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setIsSuccess(true);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('🚨 Error during auth request:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/'); // 👈 Redirect to homepage or dashboard
    }
  }, [token, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <FormContainer onSubmit={onSubmitHandler}>
        <div className="inline-flex items-center gap-2 mb-6">
          <p className="text-3xl font-bold">{currentState}</p>
          <hr className="border-none h-[1.5px] w-12 bg-gray-800" />
        </div>

        {isOtpMode ? (
          <>
            <p className="text-center text-gray-600 mb-4">Enter the 6-digit OTP sent to {formData.email}</p>
            <Input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <div className="w-full flex justify-between text-sm -mt-2">
              <p 
                className={`cursor-pointer ${resendTimer > 0 ? 'text-gray-400' : 'text-blue-600'}`}
                onClick={handleResendOtp}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </p>
              <p onClick={() => setIsOtpMode(false)} className="cursor-pointer text-blue-600">
                Back to {currentState}
              </p>
            </div>
          </>
        ) : (
          <>
            {currentState === 'Sign Up' && (
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
            )}

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />

            {(currentState === 'Login' || currentState === 'Sign Up' || currentState === 'Reset Password') && (
              <div className="w-full relative mb-4">
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={currentState === 'Reset Password' ? "Enter New Password" : "Password"}
                  required
                  style={{ marginBottom: 0 }}
                />
                {currentState === 'Login' && (
                  <button
                    type="button"
                    onClick={() => setCurrentState('Forgot Password')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none bg-transparent border-none cursor-pointer p-1"
                    title="Forgot Password?"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            <div className="w-full flex justify-end text-sm mt-1 relative z-50">
              {currentState === 'Login' ? (
                <button
                  type="button"
                  onClick={() => setCurrentState('Sign Up')} 
                  className="text-blue-600 font-medium bg-transparent border-none p-0 cursor-pointer"
                >
                  Create account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentState('Login')} 
                  className="text-blue-600 font-medium bg-transparent border-none p-0 cursor-pointer"
                >
                  Login Here
                </button>
              )}
            </div>
          </>
        )}

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        {isSuccess && (
          <SuccessMessage>
            {currentState === 'Sign Up'
              ? 'Successfully signed up! Redirecting...'
              : currentState === 'Reset Password' ? 'Password Reset Successfully!' : 'Successfully logged in! Redirecting...'}
          </SuccessMessage>
        )}

        <Button type="submit">
          {isOtpMode ? 'Verify OTP' : (currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : currentState === 'Forgot Password' ? 'Send OTP' : 'Reset Password')}
        </Button>
      </FormContainer>
    </div>
  );
};

export default AuthForm;