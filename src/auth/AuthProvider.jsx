// src/auth/AuthProvider.jsx
import React from 'react';
import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { oidcConfig } from './oidcConfig';

const AuthProvider = ({ children }) => {
    // Set up event handlers for OIDC events
    const oidcEvents = {
        onSigninComplete: (user) => {
            console.log('Sign-in complete', user);
        },
        onSignoutComplete: () => {
            console.log('Sign-out complete');
            // Force reload after signout to ensure clean state
            window.location.href = 'http://localhost:5173';
        },
        onSigninError: (error) => {
            console.error('Sign-in error:', error);
        },
        onSignoutError: (error) => {
            console.error('Sign-out error:', error);
            // Force reload to clean state even after error
            window.location.href = 'http://localhost:5173';
        }
    };

    return (
        <OidcAuthProvider {...oidcConfig} {...oidcEvents}>
            {children}
        </OidcAuthProvider>
    );
};

export default AuthProvider;