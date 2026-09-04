const nodemailer = require('nodemailer')

const sendInvitation = async ({ to, orgName, password }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('SMTP not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to .env')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111">
      <div style="text-align:center;margin-bottom:32px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;background:#4f46e5;border-radius:14px;margin-bottom:10px">
          <span style="color:#fff;font-size:20px;font-weight:800">B</span>
        </div>
        <div style="font-size:18px;font-weight:700;color:#111">BizManager</div>
      </div>

      <h2 style="margin:0 0 10px;font-size:20px;color:#4f46e5">You've been added to ${orgName}</h2>
      <p style="color:#374151;margin:0 0 24px;line-height:1.6;font-size:14px">
        You have been added as a team member. Use the credentials below to sign in and start managing invoices and inventory.
      </p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9ca3af">Login Credentials</p>
        <p style="margin:0 0 8px;font-size:14px;color:#111"><strong>Email:</strong> ${to}</p>
        <p style="margin:0;font-size:14px;color:#111"><strong>Password:</strong>
          <code style="background:#e5e7eb;padding:3px 10px;border-radius:5px;font-size:13px;margin-left:4px">${password}</code>
        </p>
      </div>

      <p style="color:#6b7280;font-size:13px;margin:0 0 24px;line-height:1.5">
        You can create bills and manage inventory for <strong>${orgName}</strong>. Contact your admin if you need help.
      </p>

      <div style="border-top:1px solid #e5e7eb;padding-top:18px;text-align:center">
        <p style="color:#9ca3af;font-size:12px;margin:0">BizManager · Billing &amp; Inventory Management</p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"BizManager" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: `You've been added to ${orgName} on BizManager`,
    html,
  })
}

module.exports = { sendInvitation }
