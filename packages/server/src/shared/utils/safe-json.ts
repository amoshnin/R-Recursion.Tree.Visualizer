export const safeStringify = (obj: any) => JSON.stringify(obj, replacer)
export const safeParse = (str: string) =>
  isJson(str) ? JSON.parse(sanitize(str), reviver) : {}

export const isJson = (str: string) => {
  const sanitized = sanitize(str)
  try {
    JSON.parse(sanitized, reviver)
  } catch {
    // log('Error to parse: %O', sanitized)
    return false
  }
  return true
}

const replacer = (_key: string, value: any) => {
  if (value === Infinity) return 'Infinity'
  if (value === -Infinity) return '-Infinity'
  if (Number.isNaN(value)) return 'NaN'
  return value
}

const reviver = (_key: string, value: any) => {
  if (value === 'Infinity') return Infinity
  if (value === '-Infinity') return -Infinity
  if (value === 'NaN') return NaN
  return value
}

const sanitize = (jsonString: string) =>
  jsonString.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}')
