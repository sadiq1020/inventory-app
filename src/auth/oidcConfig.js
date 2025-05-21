// src/auth/oidcConfig.js
export const oidcConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_szDQpWkvh",
    client_id: "15blsvpjgpi9c2v4h38amrg3tb",
    redirect_uri: "http://localhost:5173",
    response_type: "code",
    scope: "openid email phone",

    // Add explicit post-logout redirect URL
    post_logout_redirect_uri: "http://localhost:5173",

    // Metadata for endpoints
    metadataUrl: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_szDQpWkvh/.well-known/openid-configuration",

    // Automatic silent renew configuration
    automaticSilentRenew: false,

    // Load user info
    loadUserInfo: true
};