export const oidcConfig = {
    authority: `https://cognito-idp.${import.meta.env.VITE_COGNITO_REGION}.amazonaws.com/${import.meta.env.VITE_COGNITO_USER_POOL_ID}`,
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email phone",
    post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URI,
    metadataUrl: `https://cognito-idp.${import.meta.env.VITE_COGNITO_REGION}.amazonaws.com/${import.meta.env.VITE_COGNITO_USER_POOL_ID}/.well-known/openid-configuration`,
    automaticSilentRenew: false,
    loadUserInfo: true
};
