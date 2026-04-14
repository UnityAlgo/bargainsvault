/**
 * Large-scale seed script
 * Generates: 1 admin + 20 users, 20 stores, 200+ coupons, 40+ blogs
 * Safe to re-run — uses onConflictDoNothing throughout.
 */

import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users, stores, blogs, coupons } from '../lib/db/schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const db = drizzle(pool)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function futureDate(daysMin: number, daysMax: number): Date {
  const days = daysMin + Math.floor(Math.random() * (daysMax - daysMin))
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

/** Simple slug: lowercase, spaces → hyphens, strip non-alphanumeric */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ─── Static data pools ────────────────────────────────────────────────────────

const STORE_LIST = [
  { name: 'Amazon', slug: 'amazon', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Nike', slug: 'nike', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Walmart', slug: 'walmart', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg' },
  { name: 'Target', slug: 'target', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg' },
  { name: 'Best Buy', slug: 'best-buy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg' },
  { name: 'Adidas', slug: 'adidas', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'eBay', slug: 'ebay', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/EBay_logo.png' },
  { name: 'Sephora', slug: 'sephora', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Sephora_Logo.png' },
  { name: 'H&M', slug: 'hm', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg' },
  { name: 'ZARA', slug: 'zara', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg' },
  { name: 'Apple', slug: 'apple', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', slug: 'samsung', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Costco', slug: 'costco', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg' },
  { name: 'Home Depot', slug: 'home-depot', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/TheHomeDepot.svg' },
  { name: 'IKEA', slug: 'ikea', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg' },
  { name: 'Nordstrom', slug: 'nordstrom', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Nordstrom_logo.svg' },
  { name: 'Macy\'s', slug: 'macys', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Macy%27s_New_2019_Logo.svg' },
  { name: 'Gap', slug: 'gap', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Gap_logo.svg' },
  { name: 'Old Navy', slug: 'old-navy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Old_Navy_logo.svg' },
  { name: 'Wayfair', slug: 'wayfair', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Wayfair_logo.svg' },
]

// Coupon template pools
const DISCOUNT_AMOUNTS = [5, 10, 15, 20, 25, 30, 40, 50]
const PCT_DISCOUNTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70]
const MIN_ORDER_AMOUNTS = [25, 35, 50, 75, 100, 150, 200]
const CATEGORIES = [
  'Electronics', 'Clothing', 'Shoes', 'Home Decor', 'Groceries',
  'Beauty', 'Furniture', 'Toys', 'Sports', 'Kitchen', 'Garden', 'Books',
]

const CODE_PREFIXES = ['SAVE', 'GET', 'DEAL', 'OFF', 'VIP', 'FLASH', 'HOT', 'BIG', 'MEGA', 'SUPER']
// const CODE_SUFFIXES  = ['NOW', 'TODAY', 'WEEK', 'DEAL', 'GO', 'YES', 'WIN', 'FLY', 'MAX', 'PRO']

function randomCode(storeName: string): string {
  const abbr = storeName.replace(/[^A-Z]/g, '').slice(0, 3).toUpperCase() || 'STR'
  const prefix = pick(CODE_PREFIXES)
  const num = Math.floor(Math.random() * 90 + 10)
  return `${prefix}${abbr}${num}`
}

interface CouponTemplate {
  title: string
  description: string
  type: 'copy' | 'link'
  codeOrUrl: string
}

function generateCouponTemplates(storeName: string, storeSlug: string): CouponTemplate[] {
  const templates: CouponTemplate[] = []

  // % off sitewide
  for (let i = 0; i < 3; i++) {
    const pct = pick(PCT_DISCOUNTS)
    templates.push({
      title: `${pct}% Off Sitewide`,
      description: `Get ${pct}% off your entire order at ${storeName}. Limited time offer.`,
      type: 'copy',
      codeOrUrl: randomCode(storeName),
    })
  }

  // $ off with minimum
  for (let i = 0; i < 3; i++) {
    const amt = pick(DISCOUNT_AMOUNTS)
    const min = pick(MIN_ORDER_AMOUNTS)
    templates.push({
      title: `$${amt} Off Orders $${min}+`,
      description: `Save $${amt} when you spend $${min} or more at ${storeName}.`,
      type: 'copy',
      codeOrUrl: randomCode(storeName),
    })
  }

  // category discount
  for (let i = 0; i < 2; i++) {
    const cat = pick(CATEGORIES)
    const pct = pick(PCT_DISCOUNTS)
    templates.push({
      title: `${pct}% Off ${cat}`,
      description: `Exclusive ${pct}% discount on all ${cat} items at ${storeName}.`,
      type: 'copy',
      codeOrUrl: randomCode(storeName),
    })
  }

  // free shipping
  const minShip = pick(MIN_ORDER_AMOUNTS)
  templates.push({
    title: `Free Shipping on $${minShip}+`,
    description: `No shipping fees on orders over $${minShip} at ${storeName}.`,
    type: 'copy',
    codeOrUrl: randomCode(storeName),
  })

  // flash sale link
  templates.push({
    title: `Flash Sale – Up to ${pick(PCT_DISCOUNTS)}% Off`,
    description: `Limited-time flash sale now live at ${storeName}. No code needed.`,
    type: 'link',
    codeOrUrl: `https://www.${storeSlug.replace(/-/g, '')}.com/deals`,
  })

  // new customer
  const ncPct = pick([10, 15, 20])
  templates.push({
    title: `${ncPct}% Off Your First Order`,
    description: `New customers save ${ncPct}% on their first purchase at ${storeName}.`,
    type: 'copy',
    codeOrUrl: randomCode(storeName),
  })

  // clearance link
  templates.push({
    title: `Clearance – Up to ${pick([40, 50, 60, 70])}% Off`,
    description: `Shop ${storeName}'s clearance section for deep discounts.`,
    type: 'link',
    codeOrUrl: `https://www.${storeSlug.replace(/-/g, '')}.com/clearance`,
  })

  // BOGO
  const bogoItem = pick(CATEGORIES)
  templates.push({
    title: `Buy 1 Get 1 50% Off ${bogoItem}`,
    description: `Mix and match ${bogoItem.toLowerCase()} items at ${storeName}. Second item 50% off.`,
    type: 'copy',
    codeOrUrl: randomCode(storeName),
  })

  return templates
}

// ─── Blog generation ──────────────────────────────────────────────────────────

const BLOG_TEMPLATES: Array<{
  titleFn: (store: string) => string
  excerptFn: (store: string) => string
  contentFn: (store: string) => string
  featured: boolean
  image: string
}> = [
    {
      featured: true,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      titleFn: s => `${s} Coupon Codes That Actually Work This Month`,
      excerptFn: s => `We tested every ${s} promo code floating around the internet. Here are the ones that are live and verified right now.`,
      contentFn: s => `Finding working coupon codes for ${s} can feel like a full-time job. Half the codes you find online are expired, store-specific, or just plain fake. We did the dirty work so you don't have to.

## How We Verify Codes

Our team tests every code against a real cart before publishing. We check:
- Is the discount applied correctly?
- Are there hidden exclusions?
- When does it expire?

Only codes that pass all three checks make our list.

## This Month's Best ${s} Codes

### 1. Sitewide Percentage Off
The most popular type of ${s} code gives you a flat percentage off your entire order. These are the easiest to use and have the broadest applicability. Look for codes in the 10–20% range — anything higher is rare but worth grabbing when it appears.

### 2. Dollar-Off Threshold Codes
These require a minimum purchase (e.g., "$15 off $75+"). They're fantastic if you're already planning a larger order. Stack one of these with a category sale and you can hit 30–40% effective savings.

### 3. Free Shipping Codes
${s} occasionally releases free shipping codes with no minimum. These are rare and go fast — set up a deal alert on BargainsVault to get notified the moment one drops.

### 4. New Customer Welcome Codes
If you've never ordered from ${s} before, check for a new customer discount. These typically offer 10–20% off your first purchase and don't require a minimum.

## When Are New Codes Released?

${s} tends to release new codes around:
- The beginning of each month
- Major holidays (Memorial Day, Labor Day, Black Friday)
- Seasonal transitions (end of summer, end of winter)

## Pro Tip: Stack With Cash Back

Before you even enter a code, click through a cash back portal like Rakuten or Honey. You'll earn 2–8% back on top of your coupon savings. Over a year, this compounds significantly.

Bookmark this page — we update our ${s} codes daily.`,
    },
    {
      featured: false,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      titleFn: s => `Is ${s}'s Loyalty Program Worth It? Our Honest Review`,
      excerptFn: s => `Loyalty programs promise big rewards but often underdeliver. We put ${s}'s program through its paces to find out if it's actually worth your time.`,
      contentFn: s => `${s} runs one of the more recognizable loyalty programs in retail, but does it actually deliver value? After six months of testing, here's our honest assessment.

## The Basics

The ${s} loyalty program is free to join and earns you points on every purchase. Points can be redeemed for discounts on future orders. Standard earn rate: 1 point per dollar spent.

## How Points Stack Up

| Points | Value | Effective Discount |
|--------|-------|--------------------|
| 500    | $5    | ~1%                |
| 1,000  | $10   | ~1%                |
| 5,000  | $75   | ~1.5%              |

At the base level, the program returns about 1–1.5% of spending. That's underwhelming compared to a good cash back credit card (2–5%).

## Where It Gets Better

The real value is in **member-only events**. ${s} runs periodic double or triple points days where you can earn 3–4x the usual rate. Shopping exclusively during these windows pushes your effective return to 3–4%.

Loyalty members also get early access to sales. Being first in line for a 30% sitewide sale often means the difference between snagging your size or missing out.

## Tiered Benefits

Most loyalty programs tier rewards by annual spend:
- **Base tier**: Standard earn rate + birthday discount
- **Mid tier** (~$300/yr): 1.25x earn rate + exclusive deals
- **Top tier** (~$750/yr): 1.5x earn rate + free shipping + priority service

If you're already spending $500+ at ${s} annually, hitting mid-tier status is worth intentionally consolidating your purchases.

## Our Verdict

**Sign up**: Yes — it's free and there's no reason not to.
**Actively optimize**: Only if you spend $300+ per year there.
**Use as primary loyalty focus**: Probably not — better returns elsewhere.

The sweet spot is combining the ${s} loyalty program with a cash back credit card and shopping during member events. That combination can push your effective savings to 6–8%.`,
    },
    {
      featured: true,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      titleFn: s => `${s} Black Friday 2026: Everything We Know So Far`,
      excerptFn: s => `Black Friday at ${s} is one of the most anticipated shopping events of the year. Here's what to expect and how to prepare.`,
      contentFn: s => `Black Friday 2026 is shaping up to be a massive event for ${s} shoppers. Based on historical patterns and early signals, here's our preview of what to expect.

## When Does It Start?

${s} has shifted to a pre-Black Friday strategy over the past few years. Expect:
- **Early November**: "Early Access" deals for loyalty members
- **Week of Thanksgiving**: Rolling daily deals released each morning
- **Thanksgiving Day**: Major sitewide discount goes live
- **Black Friday**: Doorbusters and limited-quantity deals

## Expected Discount Levels

Based on the past three years, here's what ${s} typically offers on Black Friday:

| Category | Expected Discount |
|----------|-------------------|
| Electronics | 20–40% off |
| Clothing & Shoes | 30–50% off |
| Home & Garden | 25–45% off |
| Beauty | 20–35% off |
| Toys & Games | 30–60% off |

## The Best Strategy

### Step 1: Build Your Wishlist Now
Add items to your ${s} wishlist today. Some retailers send targeted discounts to wishlist items before public sales go live.

### Step 2: Price Track from October
Install Honey or a similar price tracker. You'll see the real price history and know whether a "Black Friday deal" is actually a discount or just a reset to normal price.

### Step 3: Set BargainsVault Alerts
We'll publish all verified ${s} Black Friday codes as soon as they go live. Set up an alert for ${s} on our site to get notified instantly.

### Step 4: Check for Code Stacking
On Black Friday, it's worth testing whether promo codes stack with sale prices. ${s} sometimes allows this for a limited window — it can push total savings to 50–60%.

## Items to Prioritize

Focus your Black Friday ${s} shopping on:
1. Big-ticket items where even 20% saves serious money
2. Items you've been watching drop in price
3. Gift purchases — the holiday timing is perfect

Stay tuned to BargainsVault for live updates as Black Friday 2026 approaches.`,
    },
    {
      featured: false,
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
      titleFn: s => `5 Things You Didn't Know You Could Save On at ${s}`,
      excerptFn: s => `Most shoppers only scratch the surface of what ${s} offers. These five hidden savings opportunities are hiding in plain sight.`,
      contentFn: s => `You probably know the basics of saving at ${s} — sale sections, promo codes, loyalty points. But these five tricks go deeper and can unlock savings most shoppers never access.

## 1. The Price Adjustment Window

${s} offers price adjustments for a limited window after purchase (typically 7–14 days). If an item you bought goes on sale within that window, contact customer service and request a price match. You'll get the difference back as store credit or to your original payment method.

Most shoppers are unaware of this policy. Set a reminder to check the price of anything you buy for two weeks after purchase.

## 2. Abandoned Cart Discounts

Add items to your cart, then leave the site without buying. ${s} (and most major retailers) has automated workflows that trigger a discount email within 24–48 hours for high-intent shoppers. The discount is typically 5–15% off the items you left.

This works best if you're signed in to your account and have purchase history.

## 3. Product Bundles vs. Individual Items

When buying multiple related products, check if ${s} offers a bundle. Bundles are frequently priced at 10–25% less than buying the same items separately. The bundle listing isn't always surfaced prominently — you may need to search for it.

## 4. Email-Exclusive Codes

${s}'s marketing emails often contain coupon codes that don't appear on deal sites. If you're not on their list, sign up with a secondary email to capture these. Check the promotions tab of your email before every purchase.

## 5. Open-Box / Returned Items

${s} sells returned and lightly used items at significant discounts through their outlet or warehouse program. Condition is graded clearly (like new, very good, good, acceptable). "Very Good" items are typically indistinguishable from new at 20–40% less.

## Bonus: The Live Chat Discount

Before placing a large order, open a live chat with ${s} customer service and mention you found a competitor price or that you're a long-time customer. Agents have discretionary discount codes they can apply — typically 5–10%. It takes two minutes and works more often than you'd think.

Stack any of these with a verified BargainsVault code and you're looking at compounded savings that add up fast.`,
    },
    {
      featured: false,
      image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800',
      titleFn: s => `${s} vs Competitors: Who Has the Best Deals Right Now?`,
      excerptFn: s => `We compared ${s}'s current pricing and promotions against its top competitors to see where your money goes furthest.`,
      contentFn: s => `With so many retailers competing for your wallet, it pays to compare before you buy. We put ${s} up against its closest competitors across five key categories.

## Methodology

We compared identical or near-identical products across ${s} and its top 3 competitors. We factored in:
- Base price
- Active coupon codes
- Shipping costs
- Return policy
- Loyalty program value

## Category 1: Everyday Essentials

For everyday consumables (cleaning supplies, personal care, household items), ${s} lands in the middle of the pack. Their Subscribe & Save equivalent beats competitors on convenience, but base prices lag Amazon and Walmart by 5–10%.

**Winner**: Walmart for base price, ${s} for convenience.

## Category 2: Clothing & Apparel

This is where ${s} shines. Their private-label clothing offers significantly better value than department store alternatives at comparable quality. Active promo codes push the gap further.

**Winner**: ${s} — especially with a 20%+ coupon code.

## Category 3: Electronics

Electronics pricing is competitive industry-wide, but ${s}'s price matching policy is one of the strongest. Combined with their return policy, buying electronics at ${s} carries less risk.

**Winner**: Tie between ${s} and Best Buy, depending on the item.

## Category 4: Home Goods

IKEA dominates on flat-pack furniture value, but for home accessories and decor, ${s} offers a better mix of price and quality. Their seasonal sales push them ahead.

**Winner**: ${s} for decor; IKEA for furniture.

## Category 5: Gift Cards & Digital Goods

${s} regularly sells discounted gift cards for restaurants, streaming services, and experiences — typically 5–15% off face value.

**Winner**: ${s}

## Overall Verdict

${s} offers the best value in clothing and home goods, and is competitive in electronics thanks to price matching. Where it lags is in grocery/essentials pricing versus Walmart and Amazon.

**Smart strategy**: Use ${s} for apparel and home goods with a coupon code, and shop Walmart or Amazon for staples. Check BargainsVault for whichever has the better active code before each purchase.`,
    },
  ]

// Blog topics not tied to a specific store
const GENERIC_BLOG_TEMPLATES: Array<{
  title: string
  slug: string
  excerpt: string
  featured: boolean
  image: string
  content: string
}> = [
    {
      title: 'The Best Cash Back Credit Cards for Shoppers in 2026',
      slug: 'best-cash-back-credit-cards-2026',
      excerpt: 'Pair the right credit card with your coupon strategy and you can earn 5–10% back on nearly every purchase.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      content: `Credit cards are the invisible layer on top of every coupon strategy. The right card turns a 20% coupon into a 24% discount. Here are the best cash back cards for active deal-seekers in 2026.

## The Gold Standard: Chase Freedom Flex

5% back on rotating quarterly categories (often includes Amazon, Walmart, or grocery stores), 3% on dining, 1% everywhere else. The quarterly categories alone can save $75+ per quarter if you max them out.

**Best for**: Shoppers who can remember to activate quarterly categories.

## Flat-Rate King: Citi Double Cash

2% back on everything — 1% when you buy, 1% when you pay. No categories to track, no activation required. The simplicity makes it the easiest card to extract value from.

**Best for**: People who want maximum simplicity.

## Amazon Loyalists: Amazon Prime Visa

5% back at Amazon and Whole Foods, 2% at restaurants and drug stores, 1% everywhere else. If you spend $200+/month on Amazon, this card pays for itself many times over.

**Best for**: Heavy Amazon shoppers with Prime.

## Store-Specific Power Moves

- **Target RedCard**: 5% off every Target purchase — effectively a permanent 5% coupon
- **Costco Citi Visa**: 4% on gas, 3% on restaurants/travel, 2% at Costco
- **Walmart Rewards Card**: 5% back on Walmart.com, 2% in-store

## How to Stack Cards

The pro move is using multiple cards:
1. Quarterly category card (Chase Freedom Flex) for categories that rotate in
2. Flat-rate card (Citi Double Cash) for everything else
3. Store-specific card for your most frequent retailer

## A Word of Caution

Cash back cards only add value if you pay your balance in full every month. Carrying a balance at 20%+ APR wipes out years of rewards in months.

**The formula**: Promo code + cash back portal + cash back credit card = 15–25% effective savings on almost any purchase.`,
    },
    {
      title: 'How Price Tracking Tools Can Save You Hundreds Per Year',
      slug: 'price-tracking-tools-save-hundreds',
      excerpt: 'Never overpay again. These free price tracking tools alert you the moment prices drop to your target.',
      featured: false,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
      content: `Price tracking tools are the most underutilized weapon in a deal-seeker's arsenal. Set them up once and they work silently in the background, alerting you when it's time to buy.

## Why Prices Fluctuate So Much

Retailers use dynamic pricing algorithms that adjust prices dozens of times per day based on:
- Competitor prices
- Inventory levels
- Time of day and week
- User browsing behavior (yes, really)
- Seasonal demand

A product that costs $89.99 today might have been $64.99 last month and could drop again next week. Without tracking, you'd never know.

## The Best Free Tools

### CamelCamelCamel (Amazon)
The gold standard for Amazon price tracking. Shows the complete price history of any Amazon product and lets you set email alerts for target prices. Free forever.

**How to use**: Paste any Amazon product URL, set a price alert, and forget it until you get the email.

### Google Shopping Price Alerts
Google's shopping tab now shows price history for many products across multiple retailers. Enable "Track price" on any product listing to get notifications via Google account.

### Honey (Browser Extension)
Beyond finding coupon codes, Honey's Droplist feature tracks prices on Amazon, eBay, Walmart, and many others. It notifies you when tracked items drop.

### Capital One Shopping
Similar to Honey, with price tracking across 30,000+ retailers and automatic coupon application.

## Setting Up a Smart Alert System

1. **Amazon wishlist + CamelCamelCamel**: For all Amazon purchases over $30
2. **Google Price Track**: For electronics and appliances across retailers
3. **Honey Droplist**: For clothing and lifestyle items

## Real Savings Example

A $349 air fryer was tracked for 6 weeks. During a flash sale it hit $218 — a $131 saving. The alert triggered overnight and the purchase was made before the sale ended. Without tracking, this opportunity would have been invisible.

## The Patience Dividend

Price tracking rewards patience. Items regularly cycle through discounts of 20–40%. For non-urgent purchases, setting an alert and waiting almost always results in a better price than buying at discovery.

Combine tracking with BargainsVault coupon codes and you're capturing both the price floor and an additional percentage off.`,
    },
    {
      title: 'Cyber Monday 2026: The Complete Survival Guide',
      slug: 'cyber-monday-2026-survival-guide',
      excerpt: 'Cyber Monday is the biggest online shopping day of the year. Here\'s how to navigate it without overspending or missing the real deals.',
      featured: true,
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
      content: `Cyber Monday 2026 lands on November 30th. The internet will be flooded with "deals" — most of which are just normal prices with a holiday label. Here's how to cut through the noise.

## The Reality of Cyber Monday

Research consistently shows that only about 30% of "Cyber Monday deals" represent genuine price lows. The rest are either inflated baseline prices with cosmetic discounts, or products that will be equally cheap in January.

Your job is to be in that 30%.

## Before Cyber Monday: The Setup (November 1–29)

### Install Your Tools
- CamelCamelCamel browser extension
- Honey or Capital One Shopping
- Rakuten (for cash back)

### Build Your Actual List
Write down the 5–10 items you genuinely want to buy. Knowing your targets prevents impulse spending, which is exactly what retailers are engineering toward.

### Track Prices Now
Add every item on your list to a price tracker today. By Cyber Monday, you'll have 3–4 weeks of price history — enough to know if a deal is real.

## Cyber Monday Morning: The Play-By-Play

**6:00 AM**: Most major retailers drop their best codes at midnight or 6 AM. Check BargainsVault's Cyber Monday page first for verified codes.

**8:00 AM**: Flash deals on electronics often go live early. Best Buy and Amazon surface their best laptop and TV deals early to drive traffic.

**12:00 PM**: Second wave of codes typically drops midday. Some retailers hold back 5–10% off codes for afternoon cart-abandonment campaigns.

**8:00 PM**: Final wave, often the deepest. Retailers want to clear inventory before midnight.

## The Best Categories on Cyber Monday

| Category | Typical Discount | Watch Out For |
|----------|-----------------|---------------|
| Laptops | 15–25% | Previous-gen specs at "new" prices |
| TVs | 20–40% | Budget-tier models in premium branding |
| Headphones | 20–35% | Usually genuine — compare CamelCamel |
| Clothing | 30–50% | Check return policies |
| Software | 40–70% | Best genuine deals of the year |

## The Golden Rule

If you don't need it before December 26th, wait. January clearance sales often beat Cyber Monday prices on many categories, and the crowds are gone.`,
    },
    {
      title: 'How to Never Pay Full Price: A System for Chronic Overpayers',
      slug: 'never-pay-full-price-system',
      excerpt: 'Full price is for people without a system. Here\'s the complete workflow that ensures you always buy at the lowest possible price.',
      featured: false,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      content: `Paying full retail price is almost always optional. With the right workflow, you can consistently pay 15–40% less on virtually every non-emergency purchase. Here's the system.

## The Core Principle

Every purchase has four savings dimensions:
1. **Base price**: Is this the lowest the item has ever been?
2. **Coupon codes**: Is there an active code?
3. **Cash back**: Am I earning a percentage back?
4. **Timing**: Is there a better time to buy this?

A full-price purchase ignores all four. A optimized purchase captures all four.

## The 60-Second Pre-Purchase Checklist

Before completing any checkout:

☐ Check price history (CamelCamelCamel for Amazon, Google Shopping elsewhere)
☐ Search BargainsVault for the retailer's current codes
☐ Click through Rakuten or Honey for cash back activation
☐ Is there a better time to buy? (sale event, end of season, etc.)

If you're in a hurry, the minimum version is: check BargainsVault for a code + activate Rakuten. Two minutes, consistent savings.

## Building the Habit

The system only works if it's automatic. Here's how to build the habit:

1. **Browser setup**: Install Honey, Rakuten, and CamelCamelCamel extensions. They surface opportunities passively.
2. **Bookmark BargainsVault**: Make it your default first stop for any retailer.
3. **Rules for impulse purchases**: For anything over $50, sleep on it for 24 hours. Most impulse urges fade; the ones that don't are legitimate purchases.
4. **Separate "want now" from "want"**: Keep a running list of things you want. Patience is the highest-ROI saving strategy.

## For Large Purchases ($200+)

Add the following:
- Check multiple retailers for price comparison
- Look for open-box, refurbished, or last-season options
- Consider whether a credit card sign-up bonus applies (new accounts often offer $150–$300 bonuses)
- Check if a corporate/student/military discount applies to you

## Annual Savings Estimate

Applying this system consistently to a typical household's discretionary spending of $8,000/year yields:
- Coupon codes: ~$600 saved (7.5%)
- Cash back: ~$160 saved (2%)
- Price timing: ~$400 saved (5%)

**Total: ~$1,160/year** — roughly 14.5% off all discretionary spending, in exchange for about 2–3 minutes per purchase.`,
    },
    {
      title: 'The Psychology of Sales: Why We Buy Things We Don\'t Need',
      slug: 'psychology-of-sales-why-we-overspend',
      excerpt: 'Retailers spend billions engineering environments that make us spend more. Understanding the psychology helps you fight back.',
      featured: false,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      content: `Every design decision in a retail environment — physical or digital — is optimized to get you to spend more. Understanding these techniques is the first step to resisting them.

## The Anchoring Effect

When you see a product marked "Was $199, Now $99," your brain anchors to the $199 and perceives the $99 as a bargain — regardless of whether $199 was ever a real price. Retailers know this and routinely inflate "original" prices.

**Counter-move**: Always check price history before buying. If the item has never been $199, the "deal" is manufactured.

## Artificial Scarcity

"Only 3 left!" "Sale ends in 4:23:17!" These countdown timers and low-stock warnings create urgency that bypasses rational decision-making. The scarcity is often fake — the timer resets or the stock replenishes.

**Counter-move**: Walk away for 24 hours. If the "urgency" was artificial, the item will still be available. If the deal genuinely ends, you'll have saved yourself from an impulse purchase.

## Free Shipping Thresholds

"Add $12.47 more for free shipping!" You end up spending $20 on something you didn't need to avoid paying $6 for shipping. The math never works out in your favor.

**Counter-move**: Calculate the real cost. If spending $20 to avoid $6 shipping means you're paying $14 for nothing, just pay the shipping.

## The Loyalty Points Illusion

Points feel like free money, but they're designed to increase purchase frequency and spend. Research shows loyalty program members spend 15–20% more per year than non-members, often wiping out the "earned" rewards.

**Counter-move**: Treat loyalty points as a small bonus on purchases you were going to make anyway — never as a reason to buy.

## Loss Aversion in Coupons

Expiring coupons are particularly effective because loss aversion is twice as powerful as equivalent gain. "You'll LOSE this $10 off coupon if you don't use it by Sunday" is more motivating than "Gain $10 off if you shop Sunday."

**Counter-move**: Ask: "Would I buy this without the coupon?" If no, the coupon is costing you money, not saving it.

## The Healthy Framing

Deals, discounts, and coupons are genuinely useful tools — when applied to things you already need or want. The goal isn't to avoid sales, it's to make sure the purchase decision came before the discount, not because of it.

Use BargainsVault to save on purchases you've already decided to make. That's the healthy version of deal-seeking.`,
    },
  ]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting large-scale seed...\n')

  // ── Users ────────────────────────────────────────────────────────────────

  const adminEmail = 'admin@bargainsvault.com'
  const adminPassword = 'Admin@123!'

  const testUsers = [
    { email: 'editor@bargainsvault.com', password: 'Editor@123!' },
    { email: 'writer@bargainsvault.com', password: 'Writer@123!' },
    { email: 'moderator@bargainsvault.com', password: 'Mod@123!' },
    { email: 'john.doe@example.com', password: 'John@123!' },
    { email: 'jane.smith@example.com', password: 'Jane@123!' },
    { email: 'alice@example.com', password: 'Alice@123!' },
    { email: 'bob@example.com', password: 'Bob@123!' },
    { email: 'carol@example.com', password: 'Carol@123!' },
    { email: 'david@example.com', password: 'David@123!' },
    { email: 'eva@example.com', password: 'Eva@123!' },
    { email: 'frank@example.com', password: 'Frank@123!' },
    { email: 'grace@example.com', password: 'Grace@123!' },
    { email: 'henry@example.com', password: 'Henry@123!' },
    { email: 'iris@example.com', password: 'Iris@123!' },
    { email: 'jack@example.com', password: 'Jack@123!' },
    { email: 'karen@example.com', password: 'Karen@123!' },
    { email: 'leo@example.com', password: 'Leo@123!' },
    { email: 'mia@example.com', password: 'Mia@123!' },
    { email: 'noah@example.com', password: 'Noah@123!' },
    { email: 'olivia@example.com', password: 'Olivia@123!' },
  ]

  const allUserData = [
    { email: adminEmail, password: adminPassword },
    ...testUsers,
  ]

  // Hash passwords in parallel batches
  const userValues = await Promise.all(
    allUserData.map(async u => ({
      email: u.email,
      passwordHash: await bcrypt.hash(u.password, 10), // cost 10 for speed
    }))
  )

  await db.insert(users).values(userValues).onConflictDoNothing()
  console.log(`✓ ${userValues.length} users seeded (admin + ${testUsers.length} test users)`)

  // ── Stores ────────────────────────────────────────────────────────────────

  await db.insert(stores).values(STORE_LIST).onConflictDoNothing()
  const allStores = await db.select().from(stores)
  const storeMap = Object.fromEntries(allStores.map(s => [s.slug, s.id]))
  console.log(`✓ ${allStores.length} stores seeded`)

  // ── Coupons ───────────────────────────────────────────────────────────────

  const couponRows: Array<{
    storeId: number
    title: string
    description: string
    type: 'copy' | 'link'
    code?: string
    linkUrl?: string
    expiresAt: Date
  }> = []

  for (const store of allStores) {
    const templates = generateCouponTemplates(store.name, store.slug)
    for (const t of templates) {
      couponRows.push({
        storeId: store.id,
        title: t.title,
        description: t.description,
        type: t.type,
        ...(t.type === 'copy' ? { code: t.codeOrUrl } : { linkUrl: t.codeOrUrl }),
        expiresAt: futureDate(30, 365),
      })
    }
  }

  // Insert in batches of 50 to avoid parameter limits
  const BATCH = 50
  for (let i = 0; i < couponRows.length; i += BATCH) {
    await db.insert(coupons).values(couponRows.slice(i, i + BATCH))
  }
  console.log(`✓ ${couponRows.length} coupons seeded (avg ${Math.round(couponRows.length / allStores.length)} per store)`)

  // ── Blogs ─────────────────────────────────────────────────────────────────

  const blogRows: Array<{
    title: string
    slug: string
    excerpt: string
    content: string
    featured: boolean
    featuredImage: string
  }> = []

  const usedSlugs = new Set<string>()

  // Store-specific blogs (one template per store)
  for (const store of allStores) {
    // Pick 2 random templates per store
    const picked = pickN(BLOG_TEMPLATES, 2)
    for (const tpl of picked) {
      const title = tpl.titleFn(store.name)
      const slug = slugify(title)
      // Ensure uniqueness
      let attempt = slug
      let counter = 2
      while (usedSlugs.has(attempt)) {
        attempt = `${slug}-${counter++}`
      }
      usedSlugs.add(attempt)

      blogRows.push({
        title,
        slug: attempt,
        excerpt: tpl.excerptFn(store.name),
        content: tpl.contentFn(store.name),
        featured: tpl.featured,
        featuredImage: tpl.image,
      })
    }
  }

  // Generic blogs
  for (const g of GENERIC_BLOG_TEMPLATES) {
    if (!usedSlugs.has(g.slug)) {
      usedSlugs.add(g.slug)
      blogRows.push({
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        content: g.content,
        featured: g.featured,
        featuredImage: g.image,
      })
    }
  }

  // Insert blogs in batches
  for (let i = 0; i < blogRows.length; i += BATCH) {
    await db.insert(blogs).values(blogRows.slice(i, i + BATCH)).onConflictDoNothing()
  }
  console.log(`✓ ${blogRows.length} blogs seeded`)

  // ── Summary ───────────────────────────────────────────────────────────────

  console.log(`
╔══════════════════════════════════════════════════╗
║              SEED COMPLETE                       ║
╠══════════════════════════════════════════════════╣
║  Users   : ${String(userValues.length).padEnd(36)}║
║  Stores  : ${String(allStores.length).padEnd(36)}║
║  Coupons : ${String(couponRows.length).padEnd(36)}║
║  Blogs   : ${String(blogRows.length).padEnd(36)}║
╠══════════════════════════════════════════════════╣
║  ADMIN LOGIN                                     ║
║  Email   : admin@bargainsvault.com               ║
║  Password: Admin@123!                            ║
╚══════════════════════════════════════════════════╝
`)

  await pool.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
