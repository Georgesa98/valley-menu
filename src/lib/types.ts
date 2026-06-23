import type { categories, menuItems } from './db/schema';

export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;

export interface MenuSettings {
  showFinancialPrice: boolean;
}
