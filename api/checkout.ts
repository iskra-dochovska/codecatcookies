import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'info@codecatcookies.com'
const FROM = `codecatcookies <${FROM_EMAIL}>`
const BUSINESS_EMAIL = 'info@codecatcookies.com'
const PICKUP_ADDRESS = 'Prashka 9, 1000 Skopje'
const LOGO_URL = 'https://codecatcookies.com/logo.svg'

const BRAND = {
  brown: '#542916',
  rust: '#a13a1e',
  cream: '#fefaf0',
  honey: '#f1c166',
  charcoal: '#282828',
}

type OrderLine = { name: string; quantity: number; price: number }

type OrderPayload = {
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  notes?: string
  lines: OrderLine[]
  total: number
}

const NOTES_MAX_LENGTH = 500
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0b\x0c\x0e-\x1f]/
const SQL_INJECTION_PATTERN =
  /(\bunion\s+select\b|\bdrop\s+table\b|\binsert\s+into\b.*\bvalues\b|\bdelete\s+from\b|\bor\s+1\s*=\s*1\b|'\s*or\s*'|\/\*|\*\/|;\s*(drop|delete|update|insert)\b|xp_cmdshell)/i

function isSafeNotes(notes: string) {
  return (
    notes.length <= NOTES_MAX_LENGTH &&
    !CONTROL_CHAR_PATTERN.test(notes) &&
    !SQL_INJECTION_PATTERN.test(notes)
  )
}

function isOrderPayload(body: unknown): body is OrderPayload {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  return (
    typeof b.fullName === 'string' &&
    b.fullName.trim() !== '' &&
    typeof b.email === 'string' &&
    typeof b.phone === 'string' &&
    typeof b.date === 'string' &&
    typeof b.time === 'string' &&
    (b.notes === undefined || (typeof b.notes === 'string' && isSafeNotes(b.notes))) &&
    Array.isArray(b.lines) &&
    b.lines.length > 0 &&
    b.lines.every(
      (line): line is OrderLine =>
        Boolean(line) &&
        typeof line === 'object' &&
        typeof (line as OrderLine).name === 'string' &&
        typeof (line as OrderLine).quantity === 'number' &&
        typeof (line as OrderLine).price === 'number',
    ) &&
    typeof b.total === 'number'
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatPickupDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function renderItemRows(lines: OrderLine[]) {
  return lines
    .map(
      (line) => `
        <tr>
          <td style="padding:6px 0;color:${BRAND.charcoal};font-size:14px;">${escapeHtml(line.name)} &times; ${line.quantity}</td>
          <td style="padding:6px 0;color:${BRAND.brown};font-size:14px;font-weight:700;text-align:right;">${line.price * line.quantity} den</td>
        </tr>`,
    )
    .join('')
}

function renderShell(headingHtml: string, bodyHtml: string) {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td align="center" style="background-color:${BRAND.brown};padding:28px 24px;">
                <img src="${LOGO_URL}" alt="codecatcookies" width="72" height="72" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 8px 24px;">
                <p style="margin:0 0 20px 0;color:${BRAND.brown};font-size:18px;font-weight:800;">${headingHtml}</p>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 24px 24px 24px;">
                <p style="margin:0;color:${BRAND.charcoal};font-size:12px;font-weight:700;">codecatcookies</p>
                <p style="margin:2px 0 0 0;color:rgba(40,40,40,0.5);font-size:11px;">Skopje</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function renderOrderSummary(lines: OrderLine[], total: number) {
  return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px dashed rgba(40,40,40,0.2);border-bottom:2px dashed rgba(40,40,40,0.2);padding:12px 0;margin-bottom:20px;">
                  ${renderItemRows(lines)}
                  <tr>
                    <td style="padding:10px 0 0 0;color:${BRAND.brown};font-size:14px;font-weight:800;border-top:2px dashed rgba(40,40,40,0.2);">Total</td>
                    <td style="padding:10px 0 0 0;color:${BRAND.brown};font-size:14px;font-weight:800;text-align:right;border-top:2px dashed rgba(40,40,40,0.2);">${total} den</td>
                  </tr>
                </table>`
}

function renderPickupBlock(prettyDate: string, time: string) {
  return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.honey}22;border-radius:12px;margin-bottom:16px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 6px 0;color:${BRAND.brown};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;">Pickup</p>
                      <p style="margin:0;color:${BRAND.charcoal};font-size:14px;">${prettyDate} at ${time}</p>
                      <p style="margin:0;color:${BRAND.charcoal};font-size:14px;">${PICKUP_ADDRESS}</p>
                    </td>
                  </tr>
                </table>`
}

const CASH_NOTICE_HTML = `<p style="margin:0 0 24px 0;color:${BRAND.rust};font-size:14px;font-weight:700;text-align:center;">Payment is made in cash at pickup.</p>`

function renderNotesBlock(notes: string | undefined) {
  if (!notes || !notes.trim()) return ''
  return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(40,40,40,0.05);border-radius:12px;margin-bottom:16px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 6px 0;color:${BRAND.brown};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;">Notes</p>
                      <p style="margin:0;color:${BRAND.charcoal};font-size:14px;white-space:pre-wrap;">${escapeHtml(notes)}</p>
                    </td>
                  </tr>
                </table>`
}

export function buildCustomerEmail(payload: OrderPayload) {
  const { fullName, date, time, lines, total } = payload
  const safeName = escapeHtml(fullName)
  const prettyDate = formatPickupDate(date)

  const bodyHtml = `
                ${renderOrderSummary(lines, total)}
                ${renderPickupBlock(prettyDate, time)}
                ${CASH_NOTICE_HTML}`

  const html = renderShell(`Thanks for your order, ${safeName}!`, bodyHtml)

  const itemsText = lines
    .map((line) => `${line.name} x ${line.quantity} — ${line.price * line.quantity} den`)
    .join('\n')
  const text = `Thanks for your order, ${fullName}!\n\n${itemsText}\n\nTotal: ${total} den, payable in cash on pickup.\n\nPickup: ${prettyDate} at ${time}\n${PICKUP_ADDRESS}`

  return { html, text }
}

export function buildBusinessEmail(payload: OrderPayload) {
  const { fullName, email, phone, date, time, notes, lines, total } = payload
  const safeName = escapeHtml(fullName)
  const safeEmail = escapeHtml(email)
  const fullPhone = `+389${phone}`
  const prettyDate = formatPickupDate(date)

  const contactBlock = `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:2px 0;color:${BRAND.charcoal};font-size:14px;"><strong>${safeName}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:2px 0;color:${BRAND.charcoal};font-size:14px;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:2px 0;color:${BRAND.charcoal};font-size:14px;">${fullPhone}</td>
                  </tr>
                </table>`

  const bodyHtml = `
                ${contactBlock}
                ${renderOrderSummary(lines, total)}
                ${renderPickupBlock(prettyDate, time)}
                ${renderNotesBlock(notes)}
                ${CASH_NOTICE_HTML}`

  const html = renderShell(`New order from ${safeName}`, bodyHtml)

  const itemsText = lines
    .map((line) => `${line.name} x ${line.quantity} — ${line.price * line.quantity} den`)
    .join('\n')
  const notesText = notes && notes.trim() ? `\n\nNotes: ${notes}` : ''
  const text = `${fullName}\n${email}\n${fullPhone}\n\nPickup: ${prettyDate} at ${time}\n${PICKUP_ADDRESS}\n\n${itemsText}\n\nTotal: ${total} den (cash on pickup)${notesText}`

  return { html, text }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!isOrderPayload(req.body)) {
    res.status(400).json({ error: 'Invalid order payload' })
    return
  }

  const { fullName, email } = req.body
  const businessEmail = buildBusinessEmail(req.body)
  const customerEmail = buildCustomerEmail(req.body)

  try {
    const [businessResult, customerResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM,
        to: BUSINESS_EMAIL,
        subject: `New order from ${fullName}`,
        text: businessEmail.text,
        html: businessEmail.html,
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Your codecatcookies order',
        text: customerEmail.text,
        html: customerEmail.html,
      }),
    ])

    const businessError =
      businessResult.status === 'rejected' ? businessResult.reason : businessResult.value.error
    const customerError =
      customerResult.status === 'rejected' ? customerResult.reason : customerResult.value.error

    if (businessError || customerError) {
      console.error('order email failure', businessError, customerError)
      res.status(502).json({ error: 'Failed to send order emails' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'Failed to send order emails' })
  }
}
