import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.trinity.app',
  appName: 'Trinity',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0c1a14',
    },
    Keyboard: {
      resize: 'body',
    },
  },
}

export default config
