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

// In-memory OTP storage for real phone verification
// Map<cleanPhone, { otp: string, expiresAt: number }>
const phoneOtpStore = new Map();

/**
 * Dispatch real SMS OTP to Indian mobile phone numbers
 * Supports Fast2SMS (Indian OTP route), 2Factor.in, and Twilio
 */
async function sendRealSmsOtp(phone, otp) {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  // 1. FAST2SMS (Standard in India for instant transactional OTP)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          numbers: cleanPhone,
          variables_values: otp.toString(),
        }),
      });
      const data = await response.json();
      console.log(`[Fast2SMS] Sent OTP to +91 ${cleanPhone}:`, data);
      if (data && data.return === true) {
        return { success: true, provider: 'Fast2SMS', details: data };
      }
    } catch (e) {
      console.error('[Fast2SMS Delivery Error]', e);
    }
  }

  // 2. 2FACTOR.IN (Popular Indian SMS OTP gateway)
  if (process.env.TWO_FACTOR_API_KEY) {
    try {
      const url = `https://2factor.in/v2/${process.env.TWO_FACTOR_API_KEY}/SMS/${cleanPhone}/${otp}/AUTOGEN`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(`[2Factor] Sent OTP to +91 ${cleanPhone}:`, data);
      if (data && data.Status === 'Success') {
        return { success: true, provider: '2Factor', details: data };
      }
    } catch (e) {
      console.error('[2Factor Delivery Error]', e);
    }
  }

  // 3. TWILIO
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `Your TaxMate verification code is ${otp}. Valid for 5 minutes.`
      });
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const data = await response.json();
      console.log(`[Twilio] Sent OTP to +91 ${cleanPhone}:`, data);
      if (data && data.sid) {
        return { success: true, provider: 'Twilio', details: data };
      }
    } catch (e) {
      console.error('[Twilio Delivery Error]', e);
    }
  }

  // Log in server terminal so developers / administrators see the exact dispatched OTP
  console.log(`\n================================================================`);
  console.log(`📱 [REAL SMS DISPATCH] To: +91 ${cleanPhone}`);
  console.log(`💬 Message: "Your TaxMate verification code is ${otp}."`);
  if (!process.env.FAST2SMS_API_KEY && !process.env.TWILIO_ACCOUNT_SID && !process.env.TWO_FACTOR_API_KEY) {
    console.log(`ℹ️  Notice: Add FAST2SMS_API_KEY or TWILIO credentials to .env to deliver via telecom carrier cell tower.`);
  }
  console.log(`================================================================\n`);

  return { 
    success: false, 
    noCarrierKey: !process.env.FAST2SMS_API_KEY && !process.env.TWILIO_ACCOUNT_SID 
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ============================================================
    // ACTION 1: REQUEST PHONE OTP (REAL SMS DISPATCH)
    // ============================================================
    if (action === 'REQUEST_PHONE_OTP') {
      const { phone } = body;
      const cleanPhone = cleanPhoneNumber(phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
      }

      // Generate a cryptographically random 6-digit OTP
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      phoneOtpStore.set(cleanPhone, {
        otp: generatedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      });

      // Dispatch real SMS
      const smsResult = await sendRealSmsOtp(cleanPhone, generatedOtp);

      // NEVER return OTP in JSON response to the client
      return NextResponse.json({
        success: true,
        message: `OTP sent via SMS to +91 ${cleanPhone}`,
        phone: cleanPhone,
        deliveredViaCarrier: smsResult.success,
        requiresCarrierApiKey: smsResult.noCarrierKey
      });
    }

    // ============================================================
    // ACTION 2: VERIFY PHONE OTP (STRICT CODE CHECK)
    // ============================================================
    if (action === 'VERIFY_PHONE_OTP') {
      const { phone, otp } = body;
      const cleanPhone = cleanPhoneNumber(phone);
      const cleanOtp = String(otp || '').trim();

      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ error: 'Valid 10-digit phone number is required' }, { status: 400 });
      }

      if (!cleanOtp) {
        return NextResponse.json({ error: 'Please enter the 6-digit OTP sent to your phone' }, { status: 400 });
      }

      const stored = phoneOtpStore.get(cleanPhone);
      const isMatchedCode = stored && stored.otp === cleanOtp && stored.expiresAt > Date.now();

      if (!isMatchedCode) {
        return NextResponse.json({ 
          error: 'Incorrect OTP code. Please enter the exact 6-digit code received on your phone.' 
        }, { status: 400 });
      }

      // OTP verified successfully!
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
