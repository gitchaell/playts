// @ts-nocheck
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`SW Registered: ${r}`)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  },
})
