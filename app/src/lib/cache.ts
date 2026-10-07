import { get, set } from 'idb-keyval'

// Try the network; on failure fall back to the last copy saved on the device.
export async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const data = await fetcher()
    await set(key, data)
    return data
  } catch (e) {
    const old = await get<T>(key)
    if (old !== undefined) return old
    throw e
  }
}
