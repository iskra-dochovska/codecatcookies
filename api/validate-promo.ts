import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PROMO_CODE_PATTERN = /^[A-Za-z0-9_-]{1,40}$/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : ''
  if (!code || !PROMO_CODE_PATTERN.test(code)) {
    res.status(200).json({ valid: false })
    return
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .select('uses, max_uses, active')
    .eq('code', code.toUpperCase())
    .maybeSingle()

  if (error || !data) {
    res.status(200).json({ valid: false })
    return
  }

  const valid = data.active && (data.max_uses === null || data.uses < data.max_uses)
  res.status(200).json({ valid })
}
