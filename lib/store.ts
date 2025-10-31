import { StoreData, Category, Weapon } from '@/types';
import { getStoreData as getGitHubData, saveStoreData as saveGitHubData } from './github';

// Кеш данных
let dataCache: StoreData | null = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // 10 секунд

export async function getStoreData(): Promise<StoreData> {
  const now = Date.now();
  
  // Используем кеш если данные свежие
  if (dataCache && (now - cacheTime) < CACHE_TTL) {
    return dataCache as StoreData;
  }
  
  // Загружаем из GitHub
  dataCache = await getGitHubData();
  cacheTime = now;
  
  return dataCache as StoreData;
}

export async function saveStoreData(data: StoreData): Promise<void> {
  await saveGitHubData(data);
  
  // Обновляем кеш
  dataCache = data;
  cacheTime = Date.now();
}

export async function getCategories(): Promise<Category[]> {
  const data = await getStoreData();
  return data.categories;
}

export async function getWeapons(): Promise<Weapon[]> {
  const data = await getStoreData();
  return data.weapons;
}

export async function getWeaponsByCategory(categoryId: string): Promise<Weapon[]> {
  const data = await getStoreData();
  return data.weapons.filter(w => w.categoryId === categoryId);
}

export async function getWeaponBySlug(slug: string): Promise<Weapon | undefined> {
  const data = await getStoreData();
  const decodedSlug = decodeURIComponent(slug);
  return data.weapons.find(w => w.slug === decodedSlug || w.slug === slug);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const data = await getStoreData();
  return data.categories.find(c => c.slug === slug);
}

export async function addCategory(category: Category): Promise<void> {
  const data = await getStoreData();
  data.categories.push(category);
  await saveStoreData(data);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const data = await getStoreData();
  const index = data.categories.findIndex(c => c.id === id);
  if (index !== -1) {
    data.categories[index] = { ...data.categories[index], ...updates };
    await saveStoreData(data);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const data = await getStoreData();
  data.categories = data.categories.filter(c => c.id !== id);
  await saveStoreData(data);
}

export async function addWeapon(weapon: Weapon): Promise<void> {
  const data = await getStoreData();
  data.weapons.push(weapon);
  await saveStoreData(data);
}

export async function updateWeapon(id: string, updates: Partial<Weapon>): Promise<void> {
  const data = await getStoreData();
  const index = data.weapons.findIndex(w => w.id === id);
  if (index !== -1) {
    data.weapons[index] = { ...data.weapons[index], ...updates };
    await saveStoreData(data);
  }
}

export async function deleteWeapon(id: string): Promise<void> {
  const data = await getStoreData();
  data.weapons = data.weapons.filter(w => w.id !== id);
  await saveStoreData(data);
}

export async function getSettings() {
  const data = await getStoreData();
  return data.settings || { orderButtonUrl: '' };
}

export async function updateSettings(settings: { orderButtonUrl?: string }): Promise<void> {
  const data = await getStoreData();
  data.settings = { ...data.settings, ...settings };
  await saveStoreData(data);
}
