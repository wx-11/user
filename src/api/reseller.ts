import { userApi } from './client'
import type { ResellerWithdrawApplyPayload } from './types'

export const resellerAPI = {
    dashboard: () => userApi.get('/reseller/dashboard'),
    balanceAccounts: (params?: any) => userApi.get('/reseller/balance-accounts', { params }),
    ledgerEntries: (params?: any) => userApi.get('/reseller/ledger-entries', { params }),
    withdraws: (params?: any) => userApi.get('/reseller/withdraws', { params }),
    applyWithdraw: (data: ResellerWithdrawApplyPayload) =>
        userApi.post('/reseller/withdraws', data),
}
