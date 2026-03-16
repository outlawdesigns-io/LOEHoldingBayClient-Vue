export function loadRuntimeConfig(): Promise<void>;

export function getConfig():{
  ENV: string,
  TZ: string,
  API_URL:string,
  AUTH_DISCOVERY_URI:string,
  AUTH_CLIENT_ID: string,
  AUTH_REDIRECT_URL: string,
  AUTH_LOGOUT_URL:string,
  AUTH_SCOPE:string,
  AUTH_DISABLED:bool,
  LOE_BASE_URL:string
}
