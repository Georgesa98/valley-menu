import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CATEGORY_ORDER = [
  'مشروبات ساخنة',
  'مشروبات باردة',
  'غربي',
  'شرقي',
  'مشروبات كحولية',
  'بيتزا',
  'باريستا',
  'مقبلات باردة',
  'مقبلات ساخنة',
  'سلطات',
  'باستا',
  'سندويش',
  'اراكيل',
] as const;

type Category = (typeof CATEGORY_ORDER)[number];

type Row = {
  name: string;
  nameEn: string;
  consumerPrice: number;
};

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function parseCsv(text: string): string[][] {
  const cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  return cleaned
    .split('\n')
    .filter((l) => l.length > 0)
    .map(parseCsvLine);
}

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

function categorize(rawName: string): Category {
  const n = rawName.trim();

  if (n.startsWith('كيلو ') || n.startsWith('نصف كيلو ')) {
    return categorize(n.replace(/^نصف كيلو |^كيلو /, ''));
  }

  if (n.startsWith('بيتزا')) return 'بيتزا';
  if (
    n.startsWith('بيرة') ||
    n.includes('عرق') ||
    n.includes('فودكا') ||
    n.includes('ويسكي') ||
    n.includes('نبيذ') ||
    n === 'جمايكا كحول' ||
    n === 'كوكتيل كحولي' ||
    n.includes('تاكيلا')
  )
    return 'مشروبات كحولية';
  if (n.startsWith('معسل') || n.startsWith('نربيش')) return 'اراكيل';
  if (n.startsWith('باستا') || n.startsWith('فوتو')) return 'باستا';
  if (
    n.includes('شاورما') ||
    n.includes('همبرغر') ||
    n.includes('هبرغر') ||
    n.includes('هوت دوغ') ||
    n.includes('بوب كورن')
  )
    return 'سندويش';
  if (
    n.startsWith('سلطة') ||
    n === 'فتوش' ||
    n.startsWith('صحن فتوش') ||
    n.startsWith('صحن خضار') ||
    n.startsWith('صحن خس') ||
    n.startsWith('صحن زيتون') ||
    n.startsWith('صحن تبولة') ||
    n === 'جاط خضار'
  )
    return 'سلطات';
  if (
    n.startsWith('كابوتشينو') ||
    n.startsWith('نسكافيه') ||
    n.startsWith('ميلو') ||
    n.startsWith('ميلك شيك') ||
    n.startsWith('كوكتيل حليب') ||
    n.startsWith('كوكتيل فواكه') ||
    n === 'ايس كافيه' ||
    n === 'ايس تي' ||
    n === 'جمايكا بدون كحول'
  )
    return 'باريستا';
  if (
    n.startsWith('قهوة') ||
    n.startsWith('ركوة قهوة') ||
    n.startsWith('شاي') ||
    n.startsWith('ابريق شاي') ||
    n.startsWith('زهورات') ||
    n.startsWith('ابريق زهورات') ||
    n === 'كمون و ليمون' ||
    n.startsWith('هوت شوكليت')
  )
    return 'مشروبات ساخنة';
  if (
    n === 'مياه معدني' ||
    n.startsWith('كولا') ||
    n.startsWith('سفن') ||
    n.startsWith('عصير') ||
    n.startsWith('ابريق عصير') ||
    n === 'ريد بول' ||
    n === 'صودا' ||
    n === 'اينرجي' ||
    n.startsWith('بوظة') ||
    n === 'بولو'
  )
    return 'مشروبات باردة';
  if (
    n === 'وجبة فالي ستار' ||
    n.startsWith('كريب') ||
    n.startsWith('كوردون') ||
    n.startsWith('فاهيتا') ||
    n.startsWith('بيكاتا') ||
    n.startsWith('ستيك') ||
    n.startsWith('سكالوب') ||
    n.startsWith('ستروغانوف') ||
    n === 'سوبريم' ||
    n === 'تشاينيز' ||
    n === 'كريسبي' ||
    n === 'سبايسي' ||
    n === 'كرانشي' ||
    n === 'مكسيكانو' ||
    n === 'تشكن نغت' ||
    n === 'تشيكن داينمت' ||
    n === 'تشيكن بانيه' ||
    n === 'دجاج بالكاري' ||
    n.startsWith('تشيكن رول بالاعشاب') ||
    n.startsWith('شرحات') ||
    n === 'صحن ميكس' ||
    n === 'تشكن الاكينغ' ||
    n === 'تشيكن الاكيف'
  )
    return 'غربي';
  if (
    n.startsWith('كباب') ||
    n.startsWith('شيش') ||
    n.startsWith('شقف') ||
    n.startsWith('مشاوي') ||
    n.startsWith('فروج') ||
    n.startsWith('فخاد') ||
    n.startsWith('طوشكا') ||
    n.startsWith('ماريا') ||
    n.startsWith('جبنة كردية') ||
    n.startsWith('سجق بالعجين') ||
    n.startsWith('كبة عالسيخ') ||
    n.startsWith('كافتا') ||
    n === 'معجوقة' ||
    n.startsWith('صحن ارز') ||
    n.startsWith('وجبة')
  )
    return 'شرقي';
  if (
    n.startsWith('بطاطا') ||
    n.startsWith('برك') ||
    n === 'كبة صاجية' ||
    n.startsWith('سجق رول') ||
    n.startsWith('خبز بالثوم') ||
    n.startsWith('نقانق') ||
    n.includes('جوانح') ||
    n === 'كيلو جوانح' ||
    n === 'نصف كيلو جوانح' ||
    n.startsWith('مفركة') ||
    n.startsWith('باذنجان') ||
    n === 'كبة حميص' ||
    n.startsWith('جبنة مقلي') ||
    n.startsWith('موزاريلا') ||
    n.startsWith('سودة') ||
    n.startsWith('سبرينغ') ||
    n === 'شوربة' ||
    n.startsWith('كشكة') ||
    n.startsWith('سوركي')
  )
    return 'مقبلات ساخنة';
  return 'مقبلات باردة';
}

function main() {
  const csvPath = resolve(ROOT, 'assets/data/menu.csv');
  const jsonPath = resolve(ROOT, 'assets/data/import.json');
  const raw = readFileSync(csvPath, 'utf8');
  const rows = parseCsv(raw);
  const [, ...dataRows] = rows;

  const byCategory = new Map<Category, Row[]>();
  for (const cat of CATEGORY_ORDER) byCategory.set(cat, []);

  let droppedNoPrice = 0;
  let droppedEmpty = 0;

  for (const row of dataRows) {
    const [, nameRaw, nameEnRaw, consumerPriceRaw] = row;
    const name = normalize(nameRaw ?? '');
    const nameEn = normalize(nameEnRaw ?? '');
    const priceStr = (consumerPriceRaw ?? '').trim();

    if (!name) {
      droppedEmpty++;
      continue;
    }
    if (priceStr === '') {
      droppedNoPrice++;
      continue;
    }
    const consumerPrice = Number(priceStr);
    if (!Number.isFinite(consumerPrice) || consumerPrice <= 0) {
      droppedNoPrice++;
      continue;
    }

    const cat = categorize(name);
    byCategory.get(cat)!.push({ name, nameEn, consumerPrice });
  }

  let droppedDuplicate = 0;
  for (const [cat, items] of byCategory) {
    const seen = new Set<string>();
    const deduped: Row[] = [];
    for (const it of items) {
      const key = `${it.name}|${it.nameEn}`;
      if (seen.has(key)) {
        droppedDuplicate++;
        continue;
      }
      seen.add(key);
      deduped.push(it);
    }
    byCategory.set(cat, deduped);
  }

  const items: Array<Record<string, unknown>> = [];
  let totalItems = 0;
  for (const cat of CATEGORY_ORDER) {
    const list = byCategory.get(cat)!;
    list.forEach((it, idx) => {
      items.push({
        categoryName: cat,
        name: it.name,
        nameEn: it.nameEn,
        description: '',
        consumerPrice: it.consumerPrice,
        financialPrice: it.consumerPrice,
        order: idx + 1,
        isAvailable: true,
      });
      totalItems++;
    });
  }

  const output = {
    categories: CATEGORY_ORDER.map((name, i) => ({ name, order: i + 1 })),
    items,
  };

  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`Wrote ${jsonPath}`);
  console.log(`Categories: ${output.categories.length}`);
  console.log(`Items:      ${totalItems}`);
  console.log(`Dropped:    ${droppedNoPrice} (no price), ${droppedDuplicate} (duplicate), ${droppedEmpty} (empty name)`);
  console.log('');
  console.log('Per-category breakdown:');
  for (const cat of CATEGORY_ORDER) {
    const n = byCategory.get(cat)!.length;
    console.log(`  ${String(CATEGORY_ORDER.indexOf(cat) + 1).padStart(2)}. ${cat}: ${n}`);
  }
}

main();
