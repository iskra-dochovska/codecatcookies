export type DiscountType = 'fixed' | 'percent'
export type DiscountScope = 'per_cookie' | 'total'

export type DiscountConfig = {
  discountType: DiscountType
  discountScope: DiscountScope
  discountValue: number
}

export type DiscountLine = { price: number; quantity: number }

export function calculateDiscount(config: DiscountConfig, lines: DiscountLine[]) {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0)

  let amount: number
  if (config.discountType === 'percent' && config.discountScope === 'per_cookie') {
    amount = lines.reduce(
      (sum, line) => sum + Math.round((line.price * line.quantity * config.discountValue) / 100),
      0,
    )
  } else if (config.discountType === 'percent') {
    amount = Math.round((total * config.discountValue) / 100)
  } else if (config.discountScope === 'per_cookie') {
    amount = Math.round(config.discountValue * quantity)
  } else {
    amount = Math.round(config.discountValue)
  }

  return Math.min(amount, total)
}
