import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

import { categories, menuItems, settings, adminPassword } from './schema';

const DEFAULT_PASSWORD = 'admin123';

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    const sqlite = openDatabaseSync('valley-menu.db');
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        "order" INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY NOT NULL,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        name_en TEXT DEFAULT '',
        description TEXT DEFAULT '',
        consumer_price REAL NOT NULL,
        financial_price REAL NOT NULL,
        "order" INTEGER NOT NULL,
        is_available INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admin_password (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL
      );
    `);
    _db = drizzle(sqlite);
  }
  return _db;
}

export async function ensureDefaults() {
  const db = getDb();

  const pwRows = db.select().from(adminPassword).all();
  if (pwRows.length === 0) {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      DEFAULT_PASSWORD,
    );
    db.insert(adminPassword).values({ hash }).run();
  }

  const sfRows = db.select().from(settings).where(eq(settings.key, 'showFinancialPrice')).all();
  if (sfRows.length === 0) {
    db.insert(settings).values({ key: 'showFinancialPrice', value: 'false' }).run();
  }
}

export function getCategories() {
  return getDb().select().from(categories).orderBy(categories.order).all();
}

export function addCategory(id: string, name: string, order: number) {
  getDb().insert(categories).values({ id, name, order }).run();
}

export function updateCategory(id: string, name: string) {
  getDb().update(categories).set({ name }).where(eq(categories.id, id)).run();
}

export function deleteCategory(id: string) {
  const db = getDb();
  db.delete(categories).where(eq(categories.id, id)).run();
  db.delete(menuItems).where(eq(menuItems.categoryId, id)).run();
}

export function getMenuItems() {
  return getDb().select().from(menuItems).orderBy(menuItems.order).all();
}

export function addMenuItem(item: typeof menuItems.$inferInsert) {
  getDb().insert(menuItems).values(item).run();
}

export function updateMenuItem(id: string, data: Partial<typeof menuItems.$inferInsert>) {
  getDb().update(menuItems).set(data).where(eq(menuItems.id, id)).run();
}

export function deleteMenuItem(id: string) {
  getDb().delete(menuItems).where(eq(menuItems.id, id)).run();
}

export function getShowFinancialPrice(): boolean {
  const row = getDb().select().from(settings).where(eq(settings.key, 'showFinancialPrice')).all();
  return row[0]?.value === 'true';
}

export function setShowFinancialPrice(value: boolean) {
  getDb().update(settings).set({ value: String(value) }).where(eq(settings.key, 'showFinancialPrice')).run();
}

export async function verifyPassword(password: string): Promise<boolean> {
  const db = getDb();
  const rows = db.select().from(adminPassword).all();
  if (rows.length === 0) return false;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
  return rows[0].hash === hash;
}

export async function setAdminPassword(password: string) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
  const db = getDb();
  const rows = db.select().from(adminPassword).all();
  if (rows.length === 0) {
    db.insert(adminPassword).values({ hash }).run();
  } else {
    db.update(adminPassword).set({ hash }).where(eq(adminPassword.id, rows[0].id)).run();
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
