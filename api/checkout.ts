import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'info@codecatcookies.com'
const FROM = `codecatcookies <${FROM_EMAIL}>`
const BUSINESS_EMAIL = 'info@codecatcookies.com'
const PICKUP_ADDRESS = 'Prashka 9, 1000 Skopje'
const LOGO_URL = 'https://www.codecatcookies.com/logo.svg'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const FOIL_COST_PER_COOKIE = 1.12
const BOX_COST = 9.5
const COOKIES_PER_BOX = 4
const DISCOUNT_PER_COOKIE = 10

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
  discountAmount: number
}

type CheckoutItem = { slug: string; quantity: number }

type CheckoutRequestBody = {
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  notes?: string
  promoCode?: string
  items: CheckoutItem[]
}

const NOTES_MAX_LENGTH = 500
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0b\x0c\x0e-\x1f]/
const SQL_INJECTION_PATTERN =
  /(\bunion\s+select\b|\bdrop\s+table\b|\binsert\s+into\b.*\bvalues\b|\bdelete\s+from\b|\bor\s+1\s*=\s*1\b|'\s*or\s*'|\/\*|\*\/|;\s*(drop|delete|update|insert)\b|xp_cmdshell)/i
const PROMO_CODE_PATTERN = /^[A-Za-z0-9_-]{1,40}$/

function isSafeNotes(notes: string) {
  return (
    notes.length <= NOTES_MAX_LENGTH &&
    !CONTROL_CHAR_PATTERN.test(notes) &&
    !SQL_INJECTION_PATTERN.test(notes)
  )
}

function isCheckoutRequestBody(body: unknown): body is CheckoutRequestBody {
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
    (b.promoCode === undefined ||
      (typeof b.promoCode === 'string' &&
        (b.promoCode === '' || PROMO_CODE_PATTERN.test(b.promoCode)))) &&
    Array.isArray(b.items) &&
    b.items.length > 0 &&
    b.items.every(
      (item): item is CheckoutItem =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as CheckoutItem).slug === 'string' &&
        typeof (item as CheckoutItem).quantity === 'number' &&
        Number.isInteger((item as CheckoutItem).quantity) &&
        (item as CheckoutItem).quantity > 0,
    )
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

function renderDiscountRow(discountAmount: number) {
  return `
        <tr>
          <td style="padding:6px 0;color:${BRAND.charcoal};font-size:14px;">Promo discount</td>
          <td style="padding:6px 0;color:${BRAND.rust};font-size:14px;font-weight:700;text-align:right;">-${discountAmount} den</td>
        </tr>`
}

function renderOrderSummary(lines: OrderLine[], total: number, discountAmount: number) {
  return `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px dashed rgba(40,40,40,0.2);border-bottom:2px dashed rgba(40,40,40,0.2);padding:12px 0;margin-bottom:20px;">
                  ${renderItemRows(lines)}
                  ${discountAmount > 0 ? renderDiscountRow(discountAmount) : ''}
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
  const { fullName, date, time, lines, total, discountAmount } = payload
  const safeName = escapeHtml(fullName)
  const prettyDate = formatPickupDate(date)

  const bodyHtml = `
                ${renderOrderSummary(lines, total, discountAmount)}
                ${renderPickupBlock(prettyDate, time)}
                ${CASH_NOTICE_HTML}`

  const html = renderShell(`Thanks for your order, ${safeName}!`, bodyHtml)

  const itemsText = lines
    .map((line) => `${line.name} x ${line.quantity} — ${line.price * line.quantity} den`)
    .join('\n')
  const discountText = discountAmount > 0 ? `\nPromo discount: -${discountAmount} den` : ''
  const text = `Thanks for your order, ${fullName}!\n\n${itemsText}${discountText}\n\nTotal: ${total} den, payable in cash on pickup.\n\nPickup: ${prettyDate} at ${time}\n${PICKUP_ADDRESS}`

  return { html, text }
}

export function buildBusinessEmail(payload: OrderPayload) {
  const { fullName, email, phone, date, time, notes, lines, total, discountAmount } = payload
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
                ${renderOrderSummary(lines, total, discountAmount)}
                ${renderPickupBlock(prettyDate, time)}
                ${renderNotesBlock(notes)}
                ${CASH_NOTICE_HTML}`

  const html = renderShell(`New order from ${safeName}`, bodyHtml)

  const itemsText = lines
    .map((line) => `${line.name} x ${line.quantity} — ${line.price * line.quantity} den`)
    .join('\n')
  const discountText = discountAmount > 0 ? `\nPromo discount: -${discountAmount} den` : ''
  const notesText = notes && notes.trim() ? `\n\nNotes: ${notes}` : ''
  const text = `${fullName}\n${email}\n${fullPhone}\n\nPickup: ${prettyDate} at ${time}\n${PICKUP_ADDRESS}\n\n${itemsText}${discountText}\n\nTotal: ${total} den (cash on pickup)${notesText}`

  return { html, text }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!isCheckoutRequestBody(req.body)) {
    res.status(400).json({ error: 'Invalid order payload' })
    return
  }

  const { fullName, email, phone, date, time, notes, promoCode, items } = req.body

  const slugs = items.map((item) => item.slug)
  const { data: cookieRows, error: cookiesError } = await supabase
    .from('cookies')
    .select('slug, name, price, production_cost, purchasable')
    .in('slug', slugs)

  if (cookiesError || !cookieRows) {
    console.error('cookie lookup failure', cookiesError)
    res.status(502).json({ error: 'Failed to place order' })
    return
  }

  const cookiesBySlug = new Map(cookieRows.map((row) => [row.slug, row]))
  if (!slugs.every((slug) => cookiesBySlug.get(slug)?.purchasable)) {
    res.status(400).json({ error: 'Invalid order payload' })
    return
  }

  const lines: OrderLine[] = items.map((item) => {
    const cookie = cookiesBySlug.get(item.slug)!
    return { name: cookie.name, quantity: item.quantity, price: cookie.price }
  })
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

  const orderItems = items.map((item) => {
    const cookie = cookiesBySlug.get(item.slug)!
    const unitCost = cookie.production_cost + FOIL_COST_PER_COOKIE + BOX_COST / COOKIES_PER_BOX
    return {
      cookie_slug: item.slug,
      cookie_name: cookie.name,
      quantity: item.quantity,
      unit_price: cookie.price,
      unit_cost: unitCost,
    }
  })

  const { data: orderResult, error: createOrderError } = await supabase.rpc('create_order', {
    order_data: {
      full_name: fullName,
      email,
      phone,
      pickup_date: date,
      pickup_time: time,
      notes: notes ?? null,
      total,
    },
    items: orderItems,
    promo_code: promoCode?.trim() || null,
  })

  if (createOrderError) {
    if (createOrderError.message?.includes('invalid_promo_code')) {
      res.status(400).json({ error: 'invalid_promo_code' })
      return
    }
    console.error('order creation failure', createOrderError)
    res.status(502).json({ error: 'Failed to place order' })
    return
  }

  const discountApplied = Boolean((orderResult as { discount_applied?: boolean } | null)?.discount_applied)
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const discountAmount = discountApplied ? DISCOUNT_PER_COOKIE * quantity : 0

  const orderPayload: OrderPayload = {
    fullName,
    email,
    phone,
    date,
    time,
    notes,
    lines,
    total: total - discountAmount,
    discountAmount,
  }
  const businessEmail = buildBusinessEmail(orderPayload)
  const customerEmail = buildCustomerEmail(orderPayload)

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
