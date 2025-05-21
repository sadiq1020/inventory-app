import React from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { oidcConfig } from './oidcConfig';

const AuthProvider = ({ children }) => {
    // OIDC event hooks
    const oidcEvents = {
        onSigninComplete: (user) => {
            console.log('✅ Sign-in complete:', user);
        },
        onSignoutComplete: () => {
            console.log('✅ Sign-out complete');
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "http://localhost:5173";  // Redirect to homepage
        },
        onSigninError: (error) => {
            console.error('❌ Sign-in error:', error);
        },
        onSignoutError: (error) => {
            console.error('❌ Sign-out error:', error);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "http://localhost:5173";
        }
    };

    return (
        <OidcAuthProvider {...oidcConfig} {...oidcEvents}>
            {children}
        </OidcAuthProvider>
    );
};

export default AuthProvider;
