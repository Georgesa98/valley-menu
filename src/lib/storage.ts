import AsyncStorage from '@react-native-async-storage/async-storage'

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key)
    return json ? JSON.parse(json) : null
  } catch {
    return null
  }
}

export async function saveData<T>(key: string, data: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
