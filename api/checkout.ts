import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'info@codecatcookies.com'
const BUSINESS_EMAIL = 'info@codecatcookies.com'
const PICKUP_ADDRESS = 'Prashka 9, 1000 Skopje'

type OrderLine = { name: string; quantity: number; price: number }

type OrderPayload = {
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  lines: OrderLine[]
  total: number
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!isOrderPayload(req.body)) {
    res.status(400).json({ error: 'Invalid order payload' })
    return
  }

  const { fullName, email, phone, date, time, lines, total } = req.body

  const itemsText = lines
    .map((line) => `${line.name} x ${line.quantity} — ${line.price * line.quantity} den`)
    .join('\n')
  const itemsHtml = lines
    .map((line) => `<li>${line.name} x ${line.quantity} — ${line.price * line.quantity} den</li>`)
    .join('')
  const fullPhone = `+389${phone}`

  try {
    const [businessResult, customerResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: BUSINESS_EMAIL,
        subject: `New order from ${fullName}`,
        text: `${fullName}\n${email}\n${fullPhone}\n\nPickup: ${date} at ${time}\n${PICKUP_ADDRESS}\n\n${itemsText}\n\nTotal: ${total} den (cash on pickup)`,
        html: `<p><strong>${fullName}</strong><br/>${email}<br/>${fullPhone}</p><p>Pickup: ${date} at ${time}<br/>${PICKUP_ADDRESS}</p><ul>${itemsHtml}</ul><p>Total: ${total} den (cash on pickup)</p>`,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Your codecatcookies order',
        text: `Thanks for your order, ${fullName}!\n\n${itemsText}\n\nTotal: ${total} den, payable in cash on pickup.\n\nPickup: ${date} at ${time}\n${PICKUP_ADDRESS}`,
        html: `<p>Thanks for your order, ${fullName}!</p><ul>${itemsHtml}</ul><p>Total: ${total} den, payable in cash on pickup.</p><p>Pickup: ${date} at ${time}<br/>${PICKUP_ADDRESS}</p>`,
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
