// /api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name = '', email = '', phone = '', message = '', company = '' } = req.body || {};

  // Honeypot check
  if (company) return res.status(200).json({ ok: true });

  if (!name || !email || !message)
    return res.status(400).json({ ok: false, error: 'Missing fields' });

  // Cloudflare Turnstile verification
  const token = req.body['cf-turnstile-response'];
  if (!token) return res.status(400).json({ ok: false, error: 'Missing Turnstile token' });

  // Verify Turnstile response
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token
    })
  }).then(r => r.json());

  if (!verify.success) {
    return res.status(403).json({ ok: false, error: 'Turnstile validation failed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: 'RESEND_API_KEY missing' });

  const to = 'info@corporateri.com';
  const subject = `New message from ${name}`;
  const html = `
    <h2>New Website Message</h2>
    <p><b>Name:</b> ${escape(name)}</p>
    <p><b>Email:</b> ${escape(email)}</p>
    <p><b>Phone:</b> ${escape(phone)}</p>
    <p><b>Message:</b></p>
    <p>${escape(message).replace(/\n/g, '<br>')}</p>
  `;

  try {
    // 1️⃣ Send main email to Corporate Transportation
    const main = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Corporate Transportation <no-reply@corporateri.com>',
        to: [to],
        subject,
        html,
        reply_to: email
      })
    });

    // 2️⃣ Auto-reply confirmation to the sender
    const confirmHtml = `
      <h2>Thank you for contacting Corporate Transportation</h2>
      <p>Hi ${escape(name)},</p>
      <p>We’ve received your message and will get back to you shortly.</p>
      <p>If your inquiry is urgent, please call us directly at <a href="tel:+14012312228">401-231-2228</a>.</p>
      <br>
      <p>— The Corporate Transportation Team</p>
      <hr>
      <p style="font-size:0.9rem;color:#666;">This email was sent automatically from corporateri.com</p>
    `;

    const confirm = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Corporate Transportation <no-reply@corporateri.com>',
        to: [email],
        subject: 'We’ve received your message',
        html: confirmHtml
      })
    });

    if (!main.ok || !confirm.ok)
      return res.status(500).json({ ok: false, error: 'Email send failed' });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }

  const SHEET_WEBHOOK = process.env.SHEET_WEBHOOK_URL;
  if (SHEET_WEBHOOK) {
    try {
      await fetch(SHEET_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
    } catch (e) {
      console.warn('Sheet log failed', e?.message || e);
    }
  }

  return res.status(200).json({ ok: true });
}

function escape(s = '') {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
