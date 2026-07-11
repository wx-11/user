import type { CryptoPaymentMethod } from '../api/types'

export const cryptoPaymentMethodKey = (method: Pick<CryptoPaymentMethod, 'currency' | 'network'>) => {
  return `${String(method.currency || '').trim().toUpperCase()}:${String(method.network || '').trim().toLowerCase()}`
}

export const normalizeCryptoPaymentMethods = (source: unknown): CryptoPaymentMethod[] => {
  if (!Array.isArray(source)) return []
  const seen = new Set<string>()
  return source.reduce((result: CryptoPaymentMethod[], method: any) => {
    const normalized: CryptoPaymentMethod = {
      ...method,
      currency: String(method?.currency || '').trim().toUpperCase(),
      network: String(method?.network || '').trim().toLowerCase(),
    }
    const key = cryptoPaymentMethodKey(normalized)
    if (!normalized.currency || !normalized.network || seen.has(key)) return result
    seen.add(key)
    result.push(normalized)
    return result
  }, [])
}

export const resolveCryptoPaymentMethodKey = (
  methods: CryptoPaymentMethod[],
  selectedCurrency: unknown,
  selectedNetwork: unknown,
  currentKey = '',
) => {
  const selectedKey = cryptoPaymentMethodKey({
    currency: String(selectedCurrency || ''),
    network: String(selectedNetwork || ''),
  })
  if (methods.some((method) => cryptoPaymentMethodKey(method) === selectedKey)) return selectedKey
  if (methods.some((method) => cryptoPaymentMethodKey(method) === currentKey)) return currentKey
  const preferred = methods.find((method) => method.is_popular) || methods[0]
  return preferred ? cryptoPaymentMethodKey(preferred) : ''
}
