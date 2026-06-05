export const KZ_PHONE_PATTERN = String.raw`\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}`

export function formatKzPhone(value: string) {
  let digits = value.replace(/\D/g, '')

  if (!digits) return ''
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (!digits.startsWith('7')) digits = `7${digits}`

  const local = digits.slice(1, 11)
  const parts = [
    local.slice(0, 3),
    local.slice(3, 6),
    local.slice(6, 8),
    local.slice(8, 10),
  ]

  let result = '+7'
  if (parts[0]) result += ` (${parts[0]}`
  if (parts[0]?.length === 3) result += ')'
  if (parts[1]) result += ` ${parts[1]}`
  if (parts[2]) result += `-${parts[2]}`
  if (parts[3]) result += `-${parts[3]}`

  return result
}
