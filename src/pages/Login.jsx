import React, { useState, useContext, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { assets } from '../assets/assets';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '723802467912-e1hb32vs8599laocuk0a6iuqet5jdk23.apps.googleusercontent.com';


const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.p`
  color: #c9a96e;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

const LoginPage = styled.div`
  --gold: #c9a96e;
  --gold-dark: #a8835a;
  --text-primary: #faf7f2;
  --text-muted: rgba(255, 255, 255, 0.3);
  --input-bg: rgba(255, 255, 255, 0.04);
  --card-bg: rgba(255, 255, 255, 0.04);

  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 84px);
  overflow: hidden;
  padding: 48px 20px;
  background:
    linear-gradient(90deg, rgba(14, 11, 15, 0.94) 0%, rgba(14, 11, 15, 0.82) 48%, rgba(14, 11, 15, 0.58) 100%),
    url(${assets.hero_img}) center right / cover no-repeat,
    #0e0b0f;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.18;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23noise)' opacity='0.55'/%3E%3C/svg%3E");
    mix-blend-mode: soft-light;
  }
`;

const AmbientOrb = styled.span`
  position: absolute;
  z-index: -2;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  bottom: ${({ bottom }) => bottom};
  border-radius: 50%;
  background: ${({ color }) => color};
  filter: blur(80px);
  opacity: ${({ opacity }) => opacity || 0.18};
`;

const FormContainer = styled.form`
  width: min(100%, 420px);
  padding: 44px 40px;
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  animation: ${fadeUp} 700ms ease forwards;

  @media (max-width: 480px) {
    padding: 36px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const Logo = styled.img`
  display: block;
  width: 86px;
  height: auto;
  margin: 0 auto 18px;
  object-fit: contain;
  filter: drop-shadow(0 10px 24px rgba(201, 169, 110, 0.18));
`;

const BrandLabel = styled.p`
  margin: 0 0 12px;
  color: var(--gold);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
`;

const Heading = styled.h1`
  margin: 0;
  color: var(--text-primary);
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  line-height: 1.16;
  font-weight: 700;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const AuthOptionButton = styled.button`
  width: 100%;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid ${({ muted }) => (muted ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 14px;
  background: ${({ muted }) => (muted ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.055)')};
  color: ${({ muted }) => (muted ? 'rgba(250, 247, 242, 0.72)' : '#faf7f2')};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;

  &:hover {
    border-color: rgba(201, 169, 110, 0.6);
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-1px);
  }
`;

const GoogleLogo = styled.svg`
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
`;

const Separator = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 14px;
  margin: 4px 0 22px;
  color: rgba(255, 255, 255, 0.34);
  font-size: 0.78rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;

  &:focus {
    border-color: rgba(201, 169, 110, 0.6);
    box-shadow: 0 0 0 4px rgba(201, 169, 110, 0.1);
    background: rgba(255, 255, 255, 0.055);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PasswordField = styled.div`
  position: relative;
`;

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(250, 247, 242, 0.48);
  cursor: pointer;
  transform: translateY(-50%);
  transition: color 180ms ease, background 180ms ease;

  &:hover {
    color: var(--gold);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const UtilityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0 24px;
  font-size: 0.86rem;

  @media (max-width: 360px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(250, 247, 242, 0.62);
  cursor: pointer;

  input {
    width: 15px;
    height: 15px;
    accent-color: var(--gold);
  }
`;

const TextButton = styled.button`
  border: 0;
  background: transparent;
  color: var(--gold);
  font: inherit;
  font-weight: 600;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #c9a96e 0%, #a8835a 100%);
  color: #17100b;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 38px rgba(201, 169, 110, 0.2);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 22px 44px rgba(201, 169, 110, 0.26);
  }
`;

const FooterText = styled.p`
  margin: 24px 0 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const HelperText = styled.p`
  margin: 0 0 16px;
  text-align: center;
  color: rgba(250, 247, 242, 0.58);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin: 0 0 14px;
  color: #ff9a9a;
  font-size: 0.86rem;
  text-align: center;
`;

const AuthForm = () => {
 

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isEmailLinkSending, setIsEmailLinkSending] = useState(false);

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

  const completeAuth = (authToken, message) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setIsSuccess(true);
    if (message) toast.success(message);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magicToken');
    const magicEmail = params.get('email');
    const magicMode = params.get('mode') || 'login';

    if (!magicToken || !magicEmail) return;

    const verifyMagicLink = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/user/verify-magic-link`, {
          email: magicEmail,
          token: magicToken,
          mode: magicMode,
        });

        if (response.data.success) {
          completeAuth(response.data.token, response.data.message);
          window.history.replaceState({}, document.title, '/login');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Email link sign-in failed');
      }
    };

    verifyMagicLink();
  }, [backendUrl]);

  useEffect(() => {
    const googleClientId = GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (credentialResponse) => {
          try {
            const response = await axios.post(`${backendUrl}/api/user/google`, {
              credential: credentialResponse.credential,
            });

            if (response.data.success) {
              completeAuth(response.data.token, response.data.message);
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            toast.error('Google sign-in failed');
          }
        },
      });
      setIsGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);
      return () => existingScript.removeEventListener('load', initializeGoogle);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);
  }, [backendUrl]);

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

          completeAuth(response.data.token);
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
          completeAuth(response.data.token);
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

  const handleGoogleSignIn = () => {
    const googleClientId = GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      toast.error('Google sign-in is not configured.');
      return;
    }

    if (!isGoogleReady || !window.google?.accounts?.id) {
      toast.info('Google sign-in is still loading. Please try again.');
      return;
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        toast.info('Please allow pop-ups/third-party sign-in for Google login.');
      }
    });
  };

  const handleEmailLink = async () => {
    const email = formData.email.trim();
    const name = formData.name.trim();

    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    if (currentState === 'Sign Up' && !name) {
      toast.error('Please enter your name first.');
      return;
    }

    setIsEmailLinkSending(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/request-magic-link`, {
        email,
        name,
        mode: currentState === 'Sign Up' ? 'signup' : 'login',
        redirectBaseUrl: window.location.origin,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to send email link');
    } finally {
      setIsEmailLinkSending(false);
    }
  };

  const renderHeading = () => {
    if (currentState === 'Login') {
      return <>Welcome <em>back</em></>;
    }

    if (currentState === 'Sign Up') return <>Create <em>account</em></>;
    if (currentState === 'Forgot Password') return <>Recover <em>access</em></>;
    if (currentState === 'Reset Password') return <>Reset <em>password</em></>;
    return <>Welcome <em>back</em></>;
  };

  return (
    <LoginPage>
      <AmbientOrb size="280px" color="#c9a96e" left="-80px" top="8%" opacity="0.16" />
      <AmbientOrb size="340px" color="#7c3aed" right="-100px" top="18%" opacity="0.14" />
      <AmbientOrb size="300px" color="#f472b6" left="52%" bottom="-120px" opacity="0.12" />
      <FormContainer onSubmit={onSubmitHandler}>
        <Header>
          <Logo src={assets.logo} alt="Fancy Garments logo" />
          <BrandLabel>Fancy Garments</BrandLabel>
          <Heading>{renderHeading()}</Heading>
        </Header>

        {isOtpMode ? (
          <>
            <HelperText>Enter the 6-digit OTP sent to {formData.email}</HelperText>
            <Input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <UtilityRow>
              <TextButton
                type="button"
                disabled={resendTimer > 0}
                onClick={handleResendOtp}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </TextButton>
              <TextButton type="button" onClick={() => setIsOtpMode(false)}>
                Back to {currentState}
              </TextButton>
            </UtilityRow>
          </>
        ) : (
          <>
            {(currentState === 'Login' || currentState === 'Sign Up') && (
              <>
                <ButtonStack>
                  <AuthOptionButton
                    type="button"
                    onClick={handleGoogleSignIn}
                  >
                    <GoogleLogo viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.37 12 5.37z" />
                    </GoogleLogo>
                    Continue with Google
                  </AuthOptionButton>
                  <AuthOptionButton
                    type="button"
                    muted
                    onClick={handleEmailLink}
                    disabled={isEmailLinkSending}
                  >
                    <Mail size={18} />
                    {isEmailLinkSending ? 'Sending email link...' : 'Continue with Email link'}
                  </AuthOptionButton>
                </ButtonStack>
                <Separator>or sign in with password</Separator>
              </>
            )}

            <FieldStack>
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
              <PasswordField>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={currentState === 'Reset Password' ? "Enter New Password" : "Password"}
                  required
                  style={{ paddingRight: 52 }}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeButton>
              </PasswordField>
            )}
            </FieldStack>

            {currentState === 'Login' && (
              <UtilityRow>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Remember me
                </CheckboxLabel>
                <TextButton type="button" onClick={() => setCurrentState('Forgot Password')}>
                  Forgot password?
                </TextButton>
              </UtilityRow>
            )}
          </>
        )}

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        {isSuccess && (
          <SuccessMessage>
            {currentState === 'Sign Up'
              ? 'Successfully signed up! Redirecting...'
              : currentState === 'Reset Password' ? 'Password Reset Successfully!' : 'Successfully logged in! Redirecting...'}
          </SuccessMessage>
        )}

        <PrimaryButton type="submit">
          {isOtpMode ? 'Verify OTP' : (currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : currentState === 'Forgot Password' ? 'Send OTP' : 'Reset Password')}
        </PrimaryButton>

        <FooterText>
          {currentState === 'Login' ? (
            <>
              Don&apos;t have an account?{' '}
              <TextButton type="button" onClick={() => setCurrentState('Sign Up')}>
                Create one
              </TextButton>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <TextButton type="button" onClick={() => setCurrentState('Login')}>
                Sign in
              </TextButton>
            </>
          )}
        </FooterText>
      </FormContainer>
    </LoginPage>
  );
};

export default AuthForm;
