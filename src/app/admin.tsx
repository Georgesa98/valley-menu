import { useCallback, useState } from 'react';
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
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Category, MenuItem } from '@/lib/types';
import {
  getCategories,
  getMenuItems,
  getShowFinancialPrice,
  setShowFinancialPrice,
  addCategory,
  updateCategory,
  deleteCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  generateId,
  setAdminPassword,
} from '@/lib/db/client';
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

  useFocusEffect(
    useCallback(() => {
      if (authenticated) {
        setCategories(getCategories());
        setItems(getMenuItems());
        setShowFinancial(getShowFinancialPrice());
      }
    }, [authenticated]),
  );

  const refreshState = useCallback(() => {
    setCategories(getCategories());
    setItems(getMenuItems());
    setShowFinancial(getShowFinancialPrice());
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleAddCategory = (name: string) => {
    addCategory(generateId(), name, categories.length + 1);
    refreshState();
    setCatFormVisible(false);
  };

  const handleEditCategory = (name: string) => {
    if (!editingCategory) return;
    updateCategory(editingCategory.id, name);
    refreshState();
    setEditingCategory(null);
    setCatFormVisible(false);
  };

  const handleDeleteCategory = (catId: string) => {
    deleteCategory(catId);
    refreshState();
  };

  const handleAddItem = (data: Omit<MenuItem, 'id' | 'categoryId' | 'order'>) => {
    const catId = itemCategoryId;
    if (!catId) return;
    const catItems = items.filter((i) => i.categoryId === catId);
    addMenuItem({
      ...data,
      id: generateId(),
      categoryId: catId,
      order: catItems.length + 1,
    });
    refreshState();
    setItemFormVisible(false);
    setItemCategoryId(null);
  };

  const handleEditItem = (data: Omit<MenuItem, 'id' | 'categoryId' | 'order'>) => {
    if (!editingItem) return;
    updateMenuItem(editingItem.id, data);
    refreshState();
    setEditingItem(null);
    setItemFormVisible(false);
    setItemCategoryId(null);
  };

  const handleDeleteItem = (item: MenuItem) => {
    deleteMenuItem(item.id);
    refreshState();
  };

  const togglePriceSetting = (value: boolean) => {
    setShowFinancialPrice(value);
    setShowFinancial(value);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون ٤ أحرف على الأقل');
      return;
    }
    await setAdminPassword(newPassword);
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
            onDeleteCategory={() => handleDeleteCategory(cat.id)}
            onEditItem={(item) => {
              setEditingItem(item);
              setItemCategoryId(item.categoryId);
              setItemFormVisible(true);
            }}
            onDeleteItem={handleDeleteItem}
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
        onSave={(name) => (editingCategory ? handleEditCategory(name) : handleAddCategory(name))}
        onCancel={() => { setCatFormVisible(false); setEditingCategory(null); }}
      />

      {/* Item Form Modal */}
      <ItemForm
        visible={itemFormVisible}
        initial={editingItem ?? undefined}
        onSave={(data) => (editingItem ? handleEditItem(data) : handleAddItem(data))}
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
