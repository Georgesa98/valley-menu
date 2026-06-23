import * as Crypto from 'expo-crypto'
import { MenuSettings } from './types'
import { loadData, saveData } from './storage'

const SETTINGS_KEY = 'menu_settings'
const PASSWORD_KEY = 'admin_password'
const DEFAULT_PASSWORD = 'admin123'

export async function getSettings(): Promise<MenuSettings> {
  const settings = await loadData<MenuSettings>(SETTINGS_KEY)
  return settings ?? { showFinancialPrice: false }
}

export async function saveSettings(settings: MenuSettings): Promise<void> {
  await saveData(SETTINGS_KEY, settings)
}

export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  )
}

export async function setPassword(password: string): Promise<void> {
  const hash = await hashPassword(password)
  await saveData(PASSWORD_KEY, hash)
}

export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = await loadData<string>(PASSWORD_KEY)
  if (!storedHash) {
    await setPassword(DEFAULT_PASSWORD)
    return password === DEFAULT_PASSWORD
  }
  const hash = await hashPassword(password)
  return hash === storedHash
}
