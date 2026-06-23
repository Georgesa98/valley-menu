# Valley Menu — Build Plan

## Tech Stack
Expo SDK 56 + expo-router + React Native + AsyncStorage + Cairo font + RTL

## Data Schema

```typescript
interface Category {
  id: string
  name: string
  order: number
}

interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  consumerPrice: number    // سعر المستهلك
  financialPrice: number   // سعر المالية
  order: number
  isAvailable: boolean
}

interface MenuSettings {
  showFinancialPrice: boolean
}
```

## Storage
- AsyncStorage keys: `menu_categories`, `menu_items`, `menu_settings`, `admin_password`
- Password: hashed with a simple hash (SHA-256 via Web Crypto API or a lightweight hash)
- Seed data on first launch if storage is empty

## Routes

```
src/app/
  _layout.tsx              ← Root: RTL + Cairo font load + Tab nav
  (tabs)/
    _layout.tsx            ← Tab bar: القائمة | لوحة التحكم
    index.tsx              ← Menu screen (customer)
    admin.tsx              ← Admin screen (password + full CRUD)
```

## Phases

### Phase 1: Foundation
- Install `@expo-google-fonts/cairo`
- Create `src/lib/types.ts` — types
- Create `src/lib/storage.ts` — AsyncStorage CRUD helpers
- Create `src/lib/seed.ts` — Arabic seed data (4 categories + ~12 items)
- Create `src/lib/settings.ts` — settings load/save, password hash/verify
- Rewrite `src/app/_layout.tsx` — RTL + Cairo + Tab navigator
- Create `src/app/(tabs)/_layout.tsx` — 2-tab layout
- Update `src/constants/theme.ts` — add Cairo
- Clean up unused files

### Phase 2: Customer Menu Screen
- Create `src/components/menu/menu-item-card.tsx`
- Create `src/components/menu/category-section.tsx`
- Create `src/components/menu/category-pills.tsx`
- Create `src/app/(tabs)/index.tsx` — menu screen

### Phase 3: Admin Screen
- Create `src/components/admin/admin-login.tsx`
- Create `src/components/admin/category-form.tsx`
- Create `src/components/admin/item-form.tsx`
- Create `src/components/admin/category-admin-row.tsx`
- Create `src/app/(tabs)/admin.tsx` — admin screen with login gate, settings toggle, CRUD

## Password
- Stored hashed using a simple SHA-256 via expo-crypto or Web Crypto
- Default: `admin123`
- Admin can change it in the admin panel

## Defaults
| Setting | Default |
|---|---|
| Password | `admin123` |
| showFinancialPrice | `false` |
| Currency | ₪ |
