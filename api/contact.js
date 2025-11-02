// /api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { name = '', email = '', phone = '', message = '', company = '' } = req.body || {};
  // Honeypot check
  if (company) return res.status(200).json({ ok: true });

  // Basic validation
  if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });

  // Use Resend API (no extra package needed)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: 'Missing RESEND_API_KEY' });

  const to = 'info@corporateri.com';
  const subject = `New website inquiry from ${name}`;
  const html = `
    <h2>New Website Message</h2>
    <p><b>Name:</b> ${escapeHtml(name)}</p>
    <p><b>Email:</b> ${escapeHtml(email)}</p>
    <p><b>Phone:</b> ${escapeHtml(phone)}</p>
    <p><b>Message:</b></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
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
    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ ok: false, error: text });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
