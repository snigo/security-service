/* eslint-disable no-multi-spaces */
const { Router } = require('express');
const authCtrl = require('./auth.ctrl');
const signupCtrl = require('./signup.ctrl');
const loginCtrl = require('./login.ctrl');
const logoutCtrl = require('./logout.ctrl');
const { registerServiceCtrl, revokeServiceCtrl } = require('./service.ctrl');
const { resetPasswordCtrl, requestResetCtrl, revokeRequestCtrl } = require('./reset.ctrl');
const { serviceAuthMW, adminAuthMW } = require('./service.mw');
const { updatePasswordCtrl, updateEmailCtrl } = require('./update.ctrl');

const authRouter = Router();
authRouter.post('/', serviceAuthMW, authCtrl);                    // Authorize user
authRouter.post('/signup', serviceAuthMW, signupCtrl);            // Sign up
authRouter.post('/login', serviceAuthMW, loginCtrl);              // Log in
authRouter.post('/logout', serviceAuthMW, logoutCtrl);            // Log out
authRouter.post('/reset', serviceAuthMW, requestResetCtrl);       // Request password reset
authRouter.put('/reset', serviceAuthMW, resetPasswordCtrl);       // Reset password
authRouter.delete('/reset', serviceAuthMW, revokeRequestCtrl);    // Cancel password request
authRouter.put('/password', serviceAuthMW, updatePasswordCtrl);   // Update password
authRouter.put('/email', serviceAuthMW, updateEmailCtrl);         // Update email

const serviceRouter = Router();
authRouter.post('/service', adminAuthMW, registerServiceCtrl);    // Register service
authRouter.delete('/service', adminAuthMW, revokeServiceCtrl);    // Revoke service

module.exports = { authRouter, serviceRouter };
