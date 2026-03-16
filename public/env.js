window.ENV = {
  ENV: "production",
  TZ: "America/Chicago",
  API_URL:'https://loe-service.outlawdesigns.io',
  AUTH_DISCOVERY_URI:'https://auth.outlawdesigns.io/.well-known/openid-configuration',
  AUTH_CLIENT_ID: 'loesuite-holdingbay-vuepwa',
  AUTH_REDIRECT_URL: 'http://localhost:3000/token/',
  AUTH_LOGOUT_URL:'http://localhost:3000/logout/',
  AUTH_SCOPE:'offline_access offline openid',
  AUTH_DISABLED:false,
  LOE_BASE_URL:'https://loe.outlawdesigns.io/'
};
