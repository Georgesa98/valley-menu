import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import { loadData as storageLoad, saveData, generateId } from '@/lib/storage';
import { getSettings, saveSettings, setPassword } from '@/lib/settings';
import AdminLogin from '@/components/admin/admin-login';
import CategoryForm from '@/components/admin/category-form';
import ItemForm from '@/components/admin/item-form';
import CategoryAdminRow from '@/components/admin/category-admin-row';

export default function AdminScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [authenticated, setAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showFinancial, setShowFinancial] = useState(false);

  const [catFormVisible, setCatFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [itemFormVisible, setItemFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemCategoryId, setItemCategoryId] = useState<string | null>(null);

  const [changePassVisible, setChangePassVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const loaded = useRef(false);

  const loadMenuData = useCallback(async () => {
    const cats = await storageLoad<Category[]>('menu_categories') ?? [];
    const allItems = await storageLoad<MenuItem[]>('menu_items') ?? [];
    setCategories(cats);
    setItems(allItems);

    const settings = await getSettings();
    setShowFinancial(settings.showFinancialPrice);
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadMenuData();
  }, [loadMenuData]);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const addCategory = async (name: string) => {
    const newCat: Category = {
      id: generateId(),
      name,
      order: categories.length + 1,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    await saveData('menu_categories', updated);
    setCatFormVisible(false);
  };

  const editCategory = async (name: string) => {
    if (!editingCategory) return;
    const updated = categories.map((c) =>
      c.id === editingCategory.id ? { ...c, name } : c,
    );
    setCategories(updated);
    await saveData('menu_categories', updated);
    setEditingCategory(null);
    setCatFormVisible(false);
  };

  const deleteCategory = async (catId: string) => {
    const updatedCats = categories.filter((c) => c.id !== catId);
    const updatedItems = items.filter((i) => i.categoryId !== catId);
    setCategories(updatedCats);
    setItems(updatedItems);
    await saveData('menu_categories', updatedCats);
    await saveData('menu_items', updatedItems);
  };

  const addItem = async (data: Omit<MenuItem, 'id' | 'categoryId' | 'order'>) => {
    const catId = itemCategoryId;
    if (!catId) return;
    const catItems = items.filter((i) => i.categoryId === catId);
    const newItem: MenuItem = {
      ...data,
      id: generateId(),
      categoryId: catId,
      order: catItems.length + 1,
    };
    const updated = [...items, newItem];
    setItems(updated);
    await saveData('menu_items', updated);
    setItemFormVisible(false);
    setItemCategoryId(null);
  };

  const editItem = async (data: Omit<MenuItem, 'id' | 'categoryId' | 'order'>) => {
    if (!editingItem) return;
    const updated = items.map((i) =>
      i.id === editingItem.id ? { ...i, ...data } : i,
    );
    setItems(updated);
    await saveData('menu_items', updated);
    setEditingItem(null);
    setItemFormVisible(false);
    setItemCategoryId(null);
  };

  const deleteItem = async (item: MenuItem) => {
    const updated = items.filter((i) => i.id !== item.id);
    setItems(updated);
    await saveData('menu_items', updated);
  };

  const togglePriceSetting = async (value: boolean) => {
    setShowFinancial(value);
    await saveSettings({ showFinancialPrice: value });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون ٤ أحرف على الأقل');
      return;
    }
    await setPassword(newPassword);
    setNewPassword('');
    setChangePassVisible(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const sortedCats = [...categories].sort((a, b) => a.order - b.order);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.three,
          paddingBottom: BottomTabInset + Spacing.four,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>لوحة التحكم</Text>
          <Pressable onPress={() => setAuthenticated(false)}>
            <Text style={[styles.logout, { color: theme.textSecondary }]}>خروج</Text>
          </Pressable>
        </View>

        {/* Settings */}
        <View style={[styles.settingRow, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>عرض سعر المالية</Text>
          <Switch value={showFinancial} onValueChange={togglePriceSetting} />
        </View>

        {/* Change Password Toggle */}
        <Pressable
          onPress={() => setChangePassVisible(!changePassVisible)}
          style={[styles.settingRow, { backgroundColor: theme.backgroundElement }]}
        >
          <Text style={[styles.settingLabel, { color: theme.text }]}>تغيير كلمة المرور</Text>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>
            {changePassVisible ? '▲' : '▼'}
          </Text>
        </Pressable>
        {changePassVisible && (
          <View style={styles.changePassSection}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.backgroundElement, color: theme.text },
              ]}
              placeholder="كلمة المرور الجديدة"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Pressable onPress={handleChangePassword} style={[styles.smallBtn, { backgroundColor: theme.text }]}>
              <Text style={[styles.smallBtnText, { color: theme.background }]}>تحديث</Text>
            </Pressable>
          </View>
        )}

        {/* Add Category */}
        <Pressable
          onPress={() => { setEditingCategory(null); setCatFormVisible(true); }}
          style={[styles.addCatBtn, { backgroundColor: theme.backgroundElement }]}
        >
          <Text style={[styles.addCatText, { color: theme.text }]}>+ إضافة قسم</Text>
        </Pressable>

        {/* Empty State */}
        {sortedCats.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              لم يتم إضافة أي أقسام بعد
            </Text>
          </View>
        )}

        {/* Categories */}
        {sortedCats.map((cat) => (
          <CategoryAdminRow
            key={cat.id}
            category={cat}
            items={items.filter((i) => i.categoryId === cat.id)}
            onEditCategory={() => {
              setEditingCategory(cat);
              setCatFormVisible(true);
            }}
            onDeleteCategory={() => deleteCategory(cat.id)}
            onEditItem={(item) => {
              setEditingItem(item);
              setItemCategoryId(item.categoryId);
              setItemFormVisible(true);
            }}
            onDeleteItem={deleteItem}
            onAddItem={() => {
              setEditingItem(null);
              setItemCategoryId(cat.id);
              setItemFormVisible(true);
            }}
          />
        ))}
      </ScrollView>

      {/* Category Form Modal */}
      <CategoryForm
        visible={catFormVisible}
        initialName={editingCategory?.name}
        onSave={(name) => (editingCategory ? editCategory(name) : addCategory(name))}
        onCancel={() => { setCatFormVisible(false); setEditingCategory(null); }}
      />

      {/* Item Form Modal */}
      <ItemForm
        visible={itemFormVisible}
        initial={editingItem ?? undefined}
        onSave={(data) => (editingItem ? editItem(data) : addItem(data))}
        onCancel={() => {
          setItemFormVisible(false);
          setEditingItem(null);
          setItemCategoryId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Cairo_700Bold',
  },
  logout: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
  },
  chevron: {
    fontSize: 12,
  },
  changePassSection: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  smallBtn: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  smallBtnText: {
    fontSize: 15,
    fontFamily: 'Cairo_700Bold',
  },
  emptyState: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
  },
  addCatBtn: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  addCatText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
  },
});
