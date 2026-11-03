import { NextResponse } from 'next/server';
import { 
  findOrCreateUser, 
  createOrUpdatePhoneUser, 
  findUserByCredentials, 
  googleLoginUser, 
  cleanPhoneNumber, 
  getSalesInvoices, 
  getPurchaseInvoices 
} from '../../../lib/db.js';

// In-memory OTP storage for phone verification
// Map<cleanPhone, { otp: string, expiresAt: number }>
const phoneOtpStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ============================================================
    // ACTION 1: REQUEST PHONE OTP
    // ============================================================
    if (action === 'REQUEST_PHONE_OTP') {
      const { phone } = body;
      const cleanPhone = cleanPhoneNumber(phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
      }

      // Generate a realistic 6-digit statutory OTP (or use 582194)
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      phoneOtpStore.set(cleanPhone, {
        otp: generatedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      });

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone}`,
        phone: cleanPhone,
        otp: generatedOtp // Returned so client can display notification banner / simulated SMS
      });
    }

    // ============================================================
    // ACTION 2: VERIFY PHONE OTP
    // ============================================================
    if (action === 'VERIFY_PHONE_OTP') {
      const { phone, otp } = body;
      const cleanPhone = cleanPhoneNumber(phone);
      const cleanOtp = String(otp || '').trim();

      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Valid 10-digit phone number is required' }, { status: 400 });
      }

      if (!cleanOtp) {
        return NextResponse.json({ error: 'Please enter the 6-digit OTP' }, { status: 400 });
      }

      const stored = phoneOtpStore.get(cleanPhone);
      const isDemoCode = cleanOtp === '123456';
      const isMatchedCode = stored && stored.otp === cleanOtp && stored.expiresAt > Date.now();

      if (!isDemoCode && !isMatchedCode) {
        return NextResponse.json({ 
          error: 'Invalid or expired OTP. Please enter the correct code or click Resend.' 
        }, { status: 400 });
      }

      // OTP verified successfully!
      // Check if user already exists
      const credentialCheck = findUserByCredentials({ identifier: cleanPhone, password: '' });
      const hasExistingUser = credentialCheck?.user ? true : false;
      const hasPassword = Boolean(credentialCheck?.user?.password);

      return NextResponse.json({
        success: true,
        verified: true,
        phone: cleanPhone,
        hasExistingUser,
        hasPassword,
        user: credentialCheck?.user || null
      });
    }

    // ============================================================
    // ACTION 3: SET PHONE PASSWORD & CREATE/UPDATE ACCOUNT
    // ============================================================
    if (action === 'SET_PHONE_PASSWORD') {
      const { phone, password, name, businessName } = body;
      const cleanPhone = cleanPhoneNumber(phone);

      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Valid 10-digit phone number is required' }, { status: 400 });
      }

      if (!password || password.length < 4) {
        return NextResponse.json({ error: 'Password must be at least 4 characters long' }, { status: 400 });
      }

      const { user, business } = createOrUpdatePhoneUser({
        phone: cleanPhone,
        password,
        name,
        businessName
      });

      const sales = getSalesInvoices(user.email);
      const purchases = getPurchaseInvoices(user.email);

      // Clean up used OTP
      phoneOtpStore.delete(cleanPhone);

      return NextResponse.json({
        success: true,
        message: 'Password set successfully! Your account is ready.',
        user,
        business,
        sales,
        purchases
      });
    }

    // ============================================================
    // ACTION 4: LOGIN VIA CREDENTIALS (PHONE NUMBER, EMAIL, OR USERNAME)
    // ============================================================
    if (action === 'LOGIN_CREDENTIALS') {
      const { identifier, password } = body;
      if (!identifier) {
        return NextResponse.json({ error: 'Phone number, username, or email is required' }, { status: 400 });
      }

      const result = findUserByCredentials({ identifier, password: password || '' });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }

      const sales = getSalesInvoices(result.user.email);
      const purchases = getPurchaseInvoices(result.user.email);

      return NextResponse.json({
        success: true,
        user: result.user,
        business: result.business,
        sales,
        purchases
      });
    }

    // ============================================================
    // ACTION 5: GOOGLE SIGN-IN
    // ============================================================
    if (action === 'GOOGLE_LOGIN') {
      const { email, name, avatarUrl, businessName } = body;
      if (!email) {
        return NextResponse.json({ error: 'Google email is required' }, { status: 400 });
      }

      const { user, business } = googleLoginUser({
        email,
        name: name || 'Google Verified Business',
        avatarUrl,
        businessName
      });

      const sales = getSalesInvoices(user.email);
      const purchases = getPurchaseInvoices(user.email);

      return NextResponse.json({
        success: true,
        user,
        business,
        sales,
        purchases
      });
    }

    // ============================================================
    // FALLBACK / LEGACY FIND OR CREATE USER
    // ============================================================
    const { email, name, role, businessName } = body;
    if (!email && !name) {
      return NextResponse.json({ error: 'Email, name, or phone number is required' }, { status: 400 });
    }

    const { user, business } = findOrCreateUser(email || `${(name || 'user').toLowerCase()}@user.in`, name, role || 'OWNER', businessName);
    const sales = getSalesInvoices(user.email);
    const purchases = getPurchaseInvoices(user.email);

    return NextResponse.json({
      success: true,
      user,
      business,
      sales,
      purchases
    });
  } catch (error) {
    console.error('API /auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
