/**
 * Bulk Product Type Updater for Fancy Garments
 * ─────────────────────────────────────────────
 * This script connects to your MongoDB Atlas database and
 * auto-assigns productType and isNewArrival to all existing
 * products that don't have them yet.
 *
 * Classification Rules:
 *   1. Keyword matching in product NAME (highest priority)
 *   2. Fallback by category (Men/Women/Kids) + subCategory
 *
 * Run:  node scripts/bulkUpdateProducts.cjs
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ── schema (mirror of productModel.js) ──────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:        String,
  category:    String,
  subCategory: String,
  productType: { type: String, default: '' },
  isNewArrival:{ type: Boolean, default: false },
  date:        Number,
}, { strict: false, timestamps: true });

const Product = mongoose.models.product || mongoose.model('product', productSchema);

// ── keyword → productType map (case-insensitive) ─────────────────────────────
const KEYWORD_MAP = [
  // ── MUST come BEFORE shirts to avoid "T-shirt" → shirts ─────────────────────
  { keywords: ['t-shirt', 'tshirt', 't shirt', 'tee', 'polo', 'graphic tee', 'round neck', 'striped round'],  type: 'tshirts'   },
  // ── women / girls ───────────────────────────────────────────────────────────
  { keywords: ['top', 'tops', 'crop', 'blouse', 'cami', 'camisole', 'tank', 'leotard'],                        type: 'tops'      },
  { keywords: ['dress', 'gown', 'frock', 'maxi', 'midi', 'mini dress', 'draped', 'lehenga'],                   type: 'dresses'   },
  { keywords: ['skirt'],                                                                                         type: 'skirts'    },
  // ── men / boys ──────────────────────────────────────────────────────────────
  { keywords: ['shirt', 'formal shirt', 'casual shirt', 'check shirt', 'flannel', 'hoodie', 'sweatshirt', 'blazer', 'jacket', 'oxford'],  type: 'shirts' },
  { keywords: ['short', 'shorts', 'bermuda', 'cargo short'],                                                    type: 'shorts'    },
  { keywords: ['trouser', 'trousers', 'chino', 'chinos', 'formal pant'],                                        type: 'trousers'  },
  { keywords: ['trackpant', 'track pant', 'jogger', 'sweatpant', 'lounge pant'],                                type: 'trackpants'},
  // ── unisex ──────────────────────────────────────────────────────────────────
  { keywords: ['jean', 'jeans', 'denim', 'skinny', 'slim fit jean', 'boyfriend'],                               type: 'jeans'     },
];

// ── subCategory fallback map (when name keywords don't match) ────────────────
// key: "GENDER|SUBCATEGORY"  →  productType
const SUBCATEGORY_FALLBACK = {
  'Women|Topwear':    'tops',
  'Women|Bottomwear': 'skirts',
  'Women|Winterwear': 'tops',
  'Men|Topwear':      'shirts',
  'Men|Bottomwear':   'trousers',
  'Men|Winterwear':   'shirts',
  'Kids|Topwear':     'tops',
  'Kids|Bottomwear':  'shorts',
  'Kids|Winterwear':  'tops',
};

// ── helpers ──────────────────────────────────────────────────────────────────
function classifyByName(name) {
  if (!name) return '';
  const lower = name.toLowerCase();
  for (const { keywords, type } of KEYWORD_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return type;
  }
  return '';
}

function classifyBySubCategory(category, subCategory) {
  return SUBCATEGORY_FALLBACK[`${category}|${subCategory}`] || 'tshirts';
}

// Whether a product looks "new" — added in the last 90 days
function isRecent(dateMs) {
  if (!dateMs) return false;
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  return dateMs > ninetyDaysAgo;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB Atlas…');
  await mongoose.connect(uri);
  console.log('✅  Connected!\n');

  const products = await Product.find({});
  const FORCE = process.argv.includes('--force');
  console.log(`📦  Found ${products.length} products in database. ${FORCE ? '(--force: re-classifying all)' : ''}\n`);

  let updated = 0;
  let skipped = 0;
  const typeCount = {};

  for (const product of products) {
    // Skip products already tagged (unless --force)
    if (!FORCE && product.productType && product.productType.trim() !== '') {
      skipped++;
      continue;
    }

    // Step 1: try name keyword matching
    let productType = classifyByName(product.name);

    // Step 2: fallback to subCategory mapping
    if (!productType) {
      productType = classifyBySubCategory(product.category, product.subCategory);
    }

    // Step 3: detect if new arrival
    const productIsNewArrival = isRecent(product.date);

    // Track stats
    typeCount[productType] = (typeCount[productType] || 0) + 1;

    // Update in DB
    await Product.updateOne(
      { _id: product._id },
      { $set: { productType, isNewArrival: productIsNewArrival } }
    );

    console.log(
      `  ✔  [${String(updated + 1).padStart(3, '0')}] "${product.name}" ` +
      `(${product.category}) → productType: "${productType}" | newArrival: ${productIsNewArrival}`
    );
    updated++;
  }

  console.log('\n────────────────────────────────────────────');
  console.log(`✅  Done! Updated: ${updated} | Skipped (already tagged): ${skipped}`);
  console.log('\n📊  Product type breakdown:');
  Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const bar = '█'.repeat(Math.min(count, 30));
      console.log(`   ${type.padEnd(12)} ${bar} (${count})`);
    });

  await mongoose.disconnect();
  console.log('\n🔌  Disconnected. All done!');
}

run().catch(err => {
  console.error('❌  Script failed:', err.message);
  process.exit(1);
});
