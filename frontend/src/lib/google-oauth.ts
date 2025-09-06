// Google OAuth 2.0 Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;

// Google OAuth 2.0 URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Generate Google OAuth URL
export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string) => {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
};

// Get user info from Google
export const getGoogleUserInfo = async (accessToken: string) => {
  const response = await fetch(`${GOOGLE_USERINFO_URL}?access_token=${accessToken}`);
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
};

// Sign in with Google (redirect method)
export const signInWithGoogle = () => {
  window.location.href = getGoogleAuthUrl();
};

// Handle OAuth callback
export const handleOAuthCallback = async (code: string) => {
  try {
    const tokenData = await exchangeCodeForToken(code);
    const userInfo = await getGoogleUserInfo(tokenData.access_token);
    
    return {
      user: userInfo,
      tokens: tokenData
    };
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};
