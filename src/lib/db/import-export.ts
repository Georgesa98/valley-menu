import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import { getCategories, getMenuItems, addCategory, addMenuItem, generateId } from './client';

interface ImportCategory {
  name: string;
  order: number;
}

interface ImportItem {
  categoryName: string;
  name: string;
  nameEn: string;
  description: string;
  consumerPrice: number;
  financialPrice: number;
  order: number;
  isAvailable: boolean;
}

interface ImportSchema {
  categories: ImportCategory[];
  items: ImportItem[];
}

interface ImportResult {
  success: boolean;
  message: string;
  categoriesAdded: number;
  itemsAdded: number;
  itemsSkipped: number;
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !isNaN(v);
}

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function validateImportData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['الملف يجب أن يكون كائن JSON'] };
  }

  const root = data as Record<string, unknown>;

  if (!isArray(root.categories)) {
    errors.push('الحقل "categories" مفقود أو ليس مصفوفة');
  } else {
    for (let i = 0; i < root.categories.length; i++) {
      const c = root.categories[i];
      if (!c || typeof c !== 'object') {
        errors.push(`العنصر ${i + 1} في الأقسام غير صالح`);
        continue;
      }
      const cat = c as Record<string, unknown>;
      if (!isString(cat.name) || !cat.name.trim()) {
        errors.push(`القسم رقم ${i + 1}: الحقل "name" مطلوب`);
      }
      if (!isNumber(cat.order)) {
        errors.push(`القسم "${cat.name || i + 1}": الحقل "order" يجب أن يكون رقماً`);
      }
    }
  }

  if (!isArray(root.items)) {
    errors.push('الحقل "items" مفقود أو ليس مصفوفة');
  } else {
    for (let i = 0; i < root.items.length; i++) {
      const item = root.items[i];
      if (!item || typeof item !== 'object') {
        errors.push(`العنصر ${i + 1} في الأصناف غير صالح`);
        continue;
      }
      const it = item as Record<string, unknown>;
      if (!isString(it.categoryName) || !it.categoryName.trim()) {
        errors.push(`الصنف رقم ${i + 1}: الحقل "categoryName" مطلوب`);
      }
      if (!isString(it.name) || !it.name.trim()) {
        errors.push(`الصنف رقم ${i + 1}: الحقل "name" مطلوب`);
      }
      if (!isString(it.nameEn)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "nameEn" يجب أن يكون نصاً`);
      }
      if (!isString(it.description)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "description" يجب أن يكون نصاً`);
      }
      if (!isNumber(it.consumerPrice)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "consumerPrice" يجب أن يكون رقماً`);
      }
      if (!isNumber(it.financialPrice)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "financialPrice" يجب أن يكون رقماً`);
      }
      if (!isNumber(it.order)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "order" يجب أن يكون رقماً`);
      }
      if (!isBoolean(it.isAvailable)) {
        errors.push(`الصنف "${it.name || i + 1}": الحقل "isAvailable" يجب أن يكون منطقياً (true/false)`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function importMenu(jsonString: string): Promise<ImportResult> {
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    return { success: false, message: 'الملف ليس JSON صالح', categoriesAdded: 0, itemsAdded: 0, itemsSkipped: 0 };
  }

  const validation = validateImportData(data);
  if (!validation.valid) {
    return { success: false, message: validation.errors.join('\n'), categoriesAdded: 0, itemsAdded: 0, itemsSkipped: 0 };
  }

  const importData = data as ImportSchema;
  const existingCats = getCategories();
  const existingItems = getMenuItems();

  const catNameToId: Record<string, string> = {};
  for (const c of existingCats) {
    catNameToId[c.name] = c.id;
  }

  let categoriesAdded = 0;
  for (const ic of importData.categories) {
    const trimmed = ic.name.trim();
    if (catNameToId[trimmed]) continue;
    const id = generateId();
    addCategory(id, trimmed, ic.order);
    catNameToId[trimmed] = id;
    categoriesAdded++;
  }

  let itemsAdded = 0;
  let itemsSkipped = 0;
  for (const ii of importData.items) {
    const catId = catNameToId[ii.categoryName.trim()];
    if (!catId) continue;

    const duplicate = existingItems.some(
      (e) =>
        e.categoryId === catId &&
        e.name === ii.name.trim() &&
        e.nameEn === ii.nameEn.trim(),
    );
    if (duplicate) {
      itemsSkipped++;
      continue;
    }

    addMenuItem({
      id: generateId(),
      categoryId: catId,
      name: ii.name.trim(),
      nameEn: ii.nameEn.trim(),
      description: ii.description.trim(),
      consumerPrice: ii.consumerPrice,
      financialPrice: ii.financialPrice,
      order: ii.order,
      isAvailable: ii.isAvailable,
    });
    itemsAdded++;
  }

  const parts: string[] = [];
  if (categoriesAdded > 0) parts.push(`تم إضافة ${categoriesAdded} أقسام`);
  if (itemsAdded > 0) parts.push(`تم إضافة ${itemsAdded} أصناف`);
  if (itemsSkipped > 0) parts.push(`تم تخطي ${itemsSkipped} أصناف مكررة`);

  return {
    success: true,
    message: parts.length > 0 ? parts.join('\n') : 'لا توجد بيانات جديدة للإضافة',
    categoriesAdded,
    itemsAdded,
    itemsSkipped,
  };
}

export async function exportMenu(): Promise<string> {
  const cats = getCategories();
  const items = getMenuItems();

  const exportData: ImportSchema = {
    categories: cats.map((c) => ({ name: c.name, order: c.order })),
    items: items.map((i) => ({
      categoryName: cats.find((c) => c.id === i.categoryId)?.name ?? '',
      name: i.name,
      nameEn: i.nameEn,
      description: i.description,
      consumerPrice: i.consumerPrice,
      financialPrice: i.financialPrice,
      order: i.order,
      isAvailable: i.isAvailable,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

export async function pickAndImport(): Promise<ImportResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, message: 'تم الإلغاء', categoriesAdded: 0, itemsAdded: 0, itemsSkipped: 0 };
    }

    const file = new File(result.assets[0].uri);
    const content = await file.text();

    return await importMenu(content);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
    return { success: false, message: msg, categoriesAdded: 0, itemsAdded: 0, itemsSkipped: 0 };
  }
}

export async function exportAndShare(): Promise<void> {
  const json = await exportMenu();
  const exportFile = new File(Paths.document, 'valley-menu-export.json');
  exportFile.create({ intermediates: true, overwrite: true });
  exportFile.write(json, { encoding: 'utf8' });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(exportFile.uri, {
      mimeType: 'application/json',
      dialogTitle: 'تصدير قائمة الطعام',
    });
  } else {
    Alert.alert('خطأ', 'المشاركة غير متوفرة على هذا الجهاز');
  }
}
