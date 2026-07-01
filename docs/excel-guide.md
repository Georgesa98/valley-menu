# Excel-to-App Data Feeding Guide

This guide explains how to prepare your menu data in Excel and import it into the app.

---

## Data Structure

The data is split into **two tables**:

1. **Categories** — main groups like: Drinks, Food, Desserts
2. **Items** — individual entries inside each category like: Cola, Shawarma, Kanafeh

---

## Sheet 1: Categories

| Column | Type | Required? | Description |
|--------|------|-----------|-------------|
| `name` | text | Yes | Category name in Arabic (e.g., مشروبات باردة) |
| `order` | number | Yes | Display order (1 = first, 2 = second...) |

### Example

| name | order |
|------|-------|
| مشروبات باردة | 1 |
| مشروبات ساخنة | 2 |
| مأكولات | 3 |
| حلويات | 4 |

---

## Sheet 2: Items

| Column | Type | Required? | Description |
|--------|------|-----------|-------------|
| `categoryName` | text | Yes | The category this item belongs to (must match `name` in the Categories sheet exactly) |
| `name` | text | Yes | Item name in Arabic (e.g., كولا) |
| `nameEn` | text | Yes | Item name in English (e.g., Cola) — can be empty, but the column must exist |
| `description` | text | No | Item description (e.g., Carbonated soft drink) |
| `consumerPrice` | number | Yes | Consumer price (shown to the customer by default) |
| `financialPrice` | number | Yes | Financial/wholesale price (shown if toggled in admin settings) |
| `order` | number | Yes | Display order within the category (1 = first) |
| `isAvailable` | boolean (true/false) | Yes | Is the item currently available? Accepted values: `true` or `false` |

### Example

| categoryName | name | nameEn | description | consumerPrice | financialPrice | order | isAvailable |
|-------------|------|--------|-------------|---------------|----------------|-------|-------------|
| مشروبات باردة | كولا | Cola | Carbonated drink | 5000 | 4000 | 1 | true |
| مشروبات باردة | فانتا | Fanta | Orange soda | 5000 | 4000 | 2 | true |
| مأكولات | شاورما | Shawarma | Chicken shawarma | 15000 | 12000 | 1 | true |
| حلويات | كنافة | Kanafeh | Nablus cheese pastry | 20000 | 16000 | 1 | false |

---

## Converting Excel to JSON (Step by Step)

### Method 1: CSV → JSON converter (recommended)

1. In Excel, for each sheet go to **File → Save As → CSV UTF-8 (.csv)**
   - Save the Categories sheet as `categories.csv`
   - Save the Items sheet as `items.csv`
2. Open [csvjson.com](https://www.csvjson.com/csv2json) or any similar converter
3. Upload `categories.csv` → you'll get the JSON for categories
4. Upload `items.csv` → you'll get the JSON for items
5. Merge them into a single file like this:

```json
{
  "categories": [
    // paste categories JSON here
  ],
  "items": [
    // paste items JSON here
  ]
}
```

### Method 2: Write the JSON directly

If you're comfortable with JSON, you can write the file directly:

```json
{
  "categories": [
    { "name": "مشروبات باردة", "order": 1 },
    { "name": "مأكولات", "order": 2 }
  ],
  "items": [
    {
      "categoryName": "مشروبات باردة",
      "name": "كولا",
      "nameEn": "Cola",
      "description": "",
      "consumerPrice": 5000,
      "financialPrice": 4000,
      "order": 1,
      "isAvailable": true
    }
  ]
}
```

---

## Importing the File into the App

1. Open the app and go to **لوحة التحكم** (Admin Panel)
2. Log in (default password: `admin123`)
3. Tap the **📦 Import / Export** button
4. Tap **📥 Import from file**
5. Select the JSON file you prepared
6. A confirmation message will tell you how many items were added

### Important Notes

- **Existing data is NOT wiped** — imports only add new categories and items
- If a category name already exists, **it's skipped** and the existing category ID is reused
- If an item has the **same Arabic name AND English name in the same category**, **it's skipped** (no duplicates)
- To start completely fresh, clear the app data from your device's settings, or delete and reinstall

---

## Forgot Admin Password? (Hard Reset)

If you can't remember the admin password, you can reset it to the default `admin123`
from the login screen — no data loss (categories, items, and settings stay intact).

**On the admin login screen:**

1. Tap the **empty area below the دخول button**, inside the card, **10 times quickly**.
   A small `...` will appear after 3 taps, then show `5/10`, `6/10`, etc. as you tap.
2. On the 10th tap, a confirmation message says **"تم إعادة تعيين كلمة المرور إلى admin123"**.
3. Log in with `admin123` and tap **دخول**.
4. Once inside, use **تغيير كلمة المرور** to set a new password.

> **Notes**
> - The tap counter resets after 2 seconds of inactivity, so tap quickly.
> - The reset only changes the password hash; all your menu data is preserved.
> - If you don't see `...` after a few taps, you're tapping outside the card — aim
>   just below the button but still inside the white card area.

---

## Tips
