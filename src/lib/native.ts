import { Capacitor } from '@capacitor/core'

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Dark })
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#0c1a14' })
    }
  } catch {
    // Status bar plugin may be unavailable
  }

  try {
    const { App } = await import('@capacitor/app')
    await App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        void App.exitApp()
      }
    })
  } catch {
    // App plugin optional
  }
}
