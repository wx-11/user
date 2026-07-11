<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Coins, RefreshCw } from 'lucide-vue-next'
import type { CryptoPaymentMethod } from '@/api/types'
import { cryptoPaymentMethodKey } from '@/utils/cryptoPayment'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  methods: CryptoPaymentMethod[]
  modelValue: string
  loading?: boolean
  hasAddress?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  confirm: []
}>()

const { t } = useI18n()

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', String(value || '')),
})

const methodLabel = (method: CryptoPaymentMethod) => {
  const currency = String(method.currency || '').toUpperCase()
  const network = String(method.token_custom_name || method.token_net_name || method.network || '').trim()
  const amount = String(method.actual_amount || '').trim()
  return [currency, network, amount ? `${amount} ${currency}` : ''].filter(Boolean).join(' · ')
}
</script>

<template>
  <div class="w-full border-y py-4 text-left">
    <div class="mb-3 flex items-center gap-2">
      <Coins class="h-4 w-4 text-primary" />
      <span class="text-sm font-semibold text-foreground">{{ t('payment.cryptoMethodTitle') }}</span>
    </div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select v-model="selected" :disabled="loading">
        <SelectTrigger class="h-10 min-w-0 flex-1">
          <SelectValue :placeholder="t('payment.cryptoMethodPlaceholder')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="method in methods" :key="cryptoPaymentMethodKey(method)" :value="cryptoPaymentMethodKey(method)">
            {{ methodLabel(method) }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Button type="button" class="h-10 shrink-0" :disabled="loading || !selected" @click="emit('confirm')">
        <RefreshCw v-if="hasAddress" class="mr-2 h-4 w-4" />
        <Coins v-else class="mr-2 h-4 w-4" />
        {{ loading ? t('payment.cryptoMethodLoading') : (hasAddress ? t('payment.cryptoMethodSwitch') : t('payment.cryptoMethodConfirm')) }}
      </Button>
    </div>
    <p v-if="error" class="mt-2 text-xs text-destructive">{{ error }}</p>
  </div>
</template>
