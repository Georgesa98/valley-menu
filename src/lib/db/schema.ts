import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
});

export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  name: text('name').notNull(),
  nameEn: text('name_en').notNull().default(''),
  description: text('description').notNull().default(''),
  consumerPrice: real('consumer_price').notNull(),
  financialPrice: real('financial_price').notNull(),
  order: integer('order').notNull(),
  isAvailable: integer('is_available', { mode: 'boolean' }).notNull().default(true),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const adminPassword = sqliteTable('admin_password', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hash: text('hash').notNull(),
});
