// src/app/api/handle-suggestion/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge'; // Add this line

// Define a type for the expected Sanity webhook payload for a suggestion
// Adjust this based on the actual fields you have in your 'suggestion' schema
interface SuggestionPayload {
  _id: string;
  _type: 'suggestion';
  text: string;
  userName?: string;
  userEmail?: string;
  submittedAt: string;
  // Add any other fields you expect from the Sanity document
}

export async function POST(request: NextRequest) {
  const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET;

  if (!sanityWebhookSecret) {
    console.error('SANITY_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Server configuration error: SANITY_WEBHOOK_SECRET missing' }, { status: 500 });
  }

  // Get the signature from the headers
  const signature = request.headers.get('sanity-webhook-signature');
  if (!signature) {
    console.warn('Sanity webhook signature missing from request');
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // Read the raw body
  const requestBody = await request.text(); // Get raw body as text

  // Replace Node.js crypto with Web Crypto API
  async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const expectedSignatureBase64 = Buffer.from(expectedSignature).toString('base64');

    return timingSafeEqual(signature, expectedSignatureBase64);
  }

  // Custom timing-safe comparison function
  function timingSafeEqual(a: string, b: string): boolean {
    const aLength = a.length;
    const bLength = b.length;
    let result = aLength === bLength ? 0 : 1;

    for (let i = 0; i < Math.min(aLength, bLength); i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  // Update signature verification logic
  try {
    const isValidSignature = await verifySignature(sanityWebhookSecret, requestBody, signature);

    if (isValidSignature) {
      console.log('Sanity webhook signature verified successfully.');
    } else {
      console.warn('Invalid Sanity webhook signature.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } catch (e) {
    console.error('Error during signature verification:', e);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 500 });
  }

  // --- Proceed with existing logic, but parse the body from the stored string ---
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not set.');
    return NextResponse.json({ error: 'Server configuration error: RESEND_API_KEY missing' }, { status: 500 });
  }
  if (!emailTo) {
    console.error('EMAIL_TO is not set.');
    return NextResponse.json({ error: 'Server configuration error: EMAIL_TO missing' }, { status: 500 });
  }
  if (!emailFrom) {
    console.error('EMAIL_FROM is not set.');
    return NextResponse.json({ error: 'Server configuration error: EMAIL_FROM missing' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  try {
    // IMPORTANT: Add Sanity webhook signature verification here for production - DONE ABOVE
    // This is crucial for security to ensure the request is genuinely from Sanity.
    // See Sanity documentation for 'Validating Signatures': 
    // https://www.sanity.io/docs/webhooks#securing-webhooks-validating-signatures

    const payload = JSON.parse(requestBody) as SuggestionPayload; // Parse the stored raw body

    // Ensure it's a suggestion document if you have other webhooks
    if (payload._type !== 'suggestion') {
      return NextResponse.json({ message: 'Not a suggestion event, skipping.' }, { status: 200 });
    }

    const { text, userName, userEmail, submittedAt, _id } = payload;

    const subject = `New Portfolio Suggestion: ${userName || 'Anonymous'}`;
    
    let htmlBody = `
      <h1>New Suggestion Received!</h1>
      <p><strong>Suggestion ID:</strong> ${_id}</p>
      <p><strong>Submitted At:</strong> ${new Date(submittedAt).toLocaleString()}</p>
    `;

    if (userName) {
      htmlBody += `<p><strong>From:</strong> ${userName}</p>`;
    }
    if (userEmail) {
      htmlBody += `<p><strong>Email:</strong> ${userEmail}</p>`;
    }
    htmlBody += `<h2>Suggestion:</h2><p>${text.replace(/\n/g, '<br>')}</p>`;
    // Construct the Sanity Studio URL using the environment variable
    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-sanity-project-id'; // Fallback just in case
    htmlBody += `<p>---</p><p>View in Sanity Studio: <a href="https://${sanityProjectId}.sanity.studio/desk/suggestion;${_id}">Open Suggestion</a></p>`;
    

    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email', details: error.message }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ message: 'Webhook received and email sent successfully!' });

  } catch (err: unknown) { // Changed from any to unknown
    console.error('Webhook processing error:', err);
    // Type guard to safely access err.message
    let errorMessage = 'Failed to process webhook';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: 'Failed to process webhook', details: errorMessage }, { status: 500 });
  }
}
