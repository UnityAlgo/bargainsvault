import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users, stores, blogs, coupons } from '../lib/db/schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const db = drizzle(pool)

async function main() {
  console.log('Seeding database...')

  // ─── Admin User ───────────────────────────────────────────────────────────
  const adminEmail = 'admin@bargainsvault.com'
  const adminPassword = 'Admin@123!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)
  await db.insert(users).values({ email: adminEmail, passwordHash }).onConflictDoNothing()
  console.log(`✓ Admin user: ${adminEmail} / ${adminPassword}`)

  // ─── Stores ───────────────────────────────────────────────────────────────
  const storeData = [
    { name: 'Amazon', slug: 'amazon', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Nike', slug: 'nike', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Walmart', slug: 'walmart', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg' },
    { name: 'Target', slug: 'target', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg' },
    { name: 'Best Buy', slug: 'best-buy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg' },
    { name: 'Adidas', slug: 'adidas', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'eBay', slug: 'ebay', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/EBay_logo.png' },
    { name: 'Sephora', slug: 'sephora', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Sephora_Logo.png' },
  ]

  const insertedStores = await db.insert(stores).values(storeData).onConflictDoNothing().returning()
  console.log(`✓ ${storeData.length} stores seeded`)

  // Reload stores to get IDs (handles onConflictDoNothing case)
  const allStores = await db.select().from(stores)
  const storeMap = Object.fromEntries(allStores.map(s => [s.slug, s.id]))

  // ─── Coupons ──────────────────────────────────────────────────────────────
  const couponData = [
    // Amazon
    { storeId: storeMap['amazon'], title: '20% Off Electronics', description: 'Get 20% off all electronics this weekend only.', type: 'copy' as const, code: 'AMZTECH20', expiresAt: new Date('2026-07-31') },
    { storeId: storeMap['amazon'], title: 'Free Prime Shipping', description: 'Free shipping on all orders over $25.', type: 'copy' as const, code: 'FREESHIP25', expiresAt: new Date('2026-12-31') },
    { storeId: storeMap['amazon'], title: '$10 Off $50+ Order', description: 'Save $10 when you spend $50 or more.', type: 'copy' as const, code: 'SAVE10NOW', expiresAt: new Date('2026-06-30') },
    { storeId: storeMap['amazon'], title: 'Summer Sale – Up to 40% Off', description: 'Browse the Amazon Summer Sale for huge discounts.', type: 'link' as const, linkUrl: 'https://www.amazon.com/deals', expiresAt: new Date('2026-08-31') },

    // Nike
    { storeId: storeMap['nike'], title: '15% Off Sitewide', description: 'Use code at checkout for 15% off everything.', type: 'copy' as const, code: 'NIKE15OFF', expiresAt: new Date('2026-05-31') },
    { storeId: storeMap['nike'], title: 'Buy 2 Get 1 Free Socks', description: 'Mix and match Nike socks.', type: 'copy' as const, code: 'NIKESOCKS3', expiresAt: new Date('2026-09-30') },
    { storeId: storeMap['nike'], title: 'New Arrivals – 10% Off', description: 'Shop the latest Nike arrivals with a 10% discount.', type: 'link' as const, linkUrl: 'https://www.nike.com/w/new', expiresAt: new Date('2026-06-30') },
    { storeId: storeMap['nike'], title: 'Nike Members Extra 10%', description: 'Sign in as a Nike member to unlock extra savings.', type: 'copy' as const, code: 'MEMBER10', expiresAt: new Date('2026-12-31') },

    // Walmart
    { storeId: storeMap['walmart'], title: '$5 Off Groceries $50+', description: 'Save $5 on grocery orders of $50 or more.', type: 'copy' as const, code: 'WMART5GROC', expiresAt: new Date('2026-06-15') },
    { storeId: storeMap['walmart'], title: 'Free Same-Day Delivery', description: 'Walmart+ members get free same-day delivery.', type: 'link' as const, linkUrl: 'https://www.walmart.com/plus', expiresAt: new Date('2026-12-31') },
    { storeId: storeMap['walmart'], title: '30% Off Clothing', description: 'Save on apparel for the whole family.', type: 'copy' as const, code: 'WMCLOTH30', expiresAt: new Date('2026-07-31') },

    // Target
    { storeId: storeMap['target'], title: '25% Off Home Decor', description: 'Refresh your home and save 25%.', type: 'copy' as const, code: 'TGTHOME25', expiresAt: new Date('2026-05-31') },
    { storeId: storeMap['target'], title: 'Target Circle: $10 Off $50', description: 'Exclusive Target Circle offer for members.', type: 'copy' as const, code: 'CIRCLE10', expiresAt: new Date('2026-08-31') },
    { storeId: storeMap['target'], title: 'Baby Sale – Up to 30% Off', description: 'Save on essentials for babies and toddlers.', type: 'link' as const, linkUrl: 'https://www.target.com/c/baby', expiresAt: new Date('2026-06-30') },
    { storeId: storeMap['target'], title: 'Free Pickup on $35+', description: 'Order online, pick up for free in-store or curbside.', type: 'copy' as const, code: 'TGTPICKUP', expiresAt: new Date('2026-12-31') },

    // Best Buy
    { storeId: storeMap['best-buy'], title: '$50 Off Laptops $500+', description: 'Save $50 on any laptop priced $500 or more.', type: 'copy' as const, code: 'BBLAPTOP50', expiresAt: new Date('2026-07-31') },
    { storeId: storeMap['best-buy'], title: 'TV Deals – 20% Off', description: 'Big discounts on 4K and OLED TVs.', type: 'link' as const, linkUrl: 'https://www.bestbuy.com/site/tvs', expiresAt: new Date('2026-08-31') },
    { storeId: storeMap['best-buy'], title: 'Free Installation on Appliances', description: 'Get free installation with select appliance purchases.', type: 'copy' as const, code: 'BBFREEINSTALL', expiresAt: new Date('2026-09-30') },

    // Adidas
    { storeId: storeMap['adidas'], title: '20% Off First Order', description: 'Welcome discount for new customers.', type: 'copy' as const, code: 'ADINEW20', expiresAt: new Date('2026-12-31') },
    { storeId: storeMap['adidas'], title: 'Sale: Up to 50% Off', description: 'Browse Adidas outlet for huge savings.', type: 'link' as const, linkUrl: 'https://www.adidas.com/us/sale', expiresAt: new Date('2026-06-30') },
    { storeId: storeMap['adidas'], title: 'Free Shipping on $100+', description: 'No shipping fees on orders over $100.', type: 'copy' as const, code: 'ADIFREE100', expiresAt: new Date('2026-12-31') },

    // eBay
    { storeId: storeMap['ebay'], title: '10% Off Your Next Purchase', description: 'Limited coupon for registered eBay users.', type: 'copy' as const, code: 'EBAY10PCT', expiresAt: new Date('2026-05-31') },
    { storeId: storeMap['ebay'], title: 'Electronics Deals of the Day', description: 'Daily deals on top electronics brands.', type: 'link' as const, linkUrl: 'https://www.ebay.com/deals', expiresAt: new Date('2026-12-31') },
    { storeId: storeMap['ebay'], title: '$15 Off Refurbished Tech', description: 'Save $15 on certified refurbished items.', type: 'copy' as const, code: 'EBREFU15', expiresAt: new Date('2026-08-31') },

    // Sephora
    { storeId: storeMap['sephora'], title: '15% Off Skincare', description: 'Refresh your routine and save on skincare.', type: 'copy' as const, code: 'SEPHSKIN15', expiresAt: new Date('2026-06-30') },
    { storeId: storeMap['sephora'], title: 'Free 3-Piece Gift Set', description: 'Free gift with purchases over $65.', type: 'copy' as const, code: 'SEPHGIFT3', expiresAt: new Date('2026-07-31') },
    { storeId: storeMap['sephora'], title: 'Beauty Insider Sale', description: 'Exclusive savings for Beauty Insider members.', type: 'link' as const, linkUrl: 'https://www.sephora.com/sale', expiresAt: new Date('2026-05-31') },
  ]

  await db.insert(coupons).values(couponData.filter(c => c.storeId != null))
  console.log(`✓ ${couponData.length} coupons seeded`)

  // ─── Blogs ────────────────────────────────────────────────────────────────
  const blogData = [
    {
      title: '10 Amazon Hacks to Save More Money in 2026',
      slug: '10-amazon-hacks-save-money-2026',
      excerpt: 'Discover insider tricks to maximize your Amazon savings — from hidden coupons to price tracking tools.',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800',
      content: `Amazon is one of the most popular online retailers in the world, and for good reason — their vast selection and competitive prices make it a go-to for millions of shoppers. But did you know there are several hidden tricks that can help you save even more?

## 1. Clip Digital Coupons

Before adding anything to your cart, head to the Amazon Coupons page. Many products have digital coupons you can "clip" for instant savings at checkout. These range from 5% to 50% off and are constantly updated.

## 2. Use Subscribe & Save

For items you buy regularly — like coffee, vitamins, or cleaning supplies — Subscribe & Save gives you up to 15% off when you set up recurring deliveries. You can skip or cancel anytime.

## 3. Track Prices with CamelCamelCamel

Amazon prices fluctuate constantly. Use CamelCamelCamel (free) to see the price history of any product and set alerts when prices drop to your target.

## 4. Buy Amazon Warehouse Deals

Amazon Warehouse sells returned or lightly damaged items at a steep discount — often 20–50% off. Most items are in "Like New" or "Very Good" condition.

## 5. Check Third-Party Sellers

For many products, third-party sellers on Amazon list the same item cheaper than Amazon itself. Always compare before buying.

## 6. Use Amazon Trade-In

Got old tech lying around? Amazon's Trade-In program lets you exchange old devices for Amazon gift cards.

## 7. Shop During Lightning Deals

Lightning Deals are time-limited offers that can save you 20–70%. Check the Deals page regularly or enable alerts in the Amazon app.

## 8. Stack Coupons with Promo Codes

You can sometimes combine a clipped coupon with a promo code at checkout for double savings. Try it!

## 9. Use the Wish List Trick

Add items to your wish list and wait. Amazon sometimes sends you a targeted discount when an item in your list drops in price.

## 10. Prime Day & Black Friday

Plan big purchases around Amazon's mega-sale events. Prime Day (July) and Black Friday/Cyber Monday offer some of the best discounts of the year.

With these hacks, you can easily save hundreds of dollars a year on Amazon purchases.`,
    },
    {
      title: 'Best Nike Deals Right Now: Sneakers You Can\'t Miss',
      slug: 'best-nike-deals-right-now',
      excerpt: 'We rounded up the hottest Nike discounts available this week — from running shoes to lifestyle classics.',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      content: `Nike is constantly running promotions, but it can be hard to keep track of them all. We've done the legwork for you and compiled the best Nike deals available right now.

## Nike Sale Section

The Nike Sale section is your first stop. You'll find discounts of up to 50% on running shoes, training gear, and lifestyle sneakers. The selection rotates frequently, so check back often.

## Member Exclusive Discounts

If you have a free Nike Member account, you get access to exclusive discounts and early access to sales. It takes two minutes to sign up and the savings are worth it.

## Air Max 90 – Classic at a Discount

The Air Max 90 regularly appears in Nike's sale section. This timeless silhouette pairs well with any outfit and is available in dozens of colorways.

## React Infinity Run – For the Serious Runner

Nike's React Infinity Run is designed to reduce injury risk while delivering a comfortable, responsive ride. Look for last-season colorways on sale for up to 30% off.

## Nike Outlet

The Nike Outlet (factory store and online) stocks previous-season styles at permanent discounts. It's the best place to find deep deals year-round.

## When to Shop Nike

- **End of Season**: March and September bring major clearance events
- **Back to School**: August is a great time for shoe deals
- **Black Friday**: Nike offers sitewide discounts of 20–30%

## Our Top Picks This Week

1. **Nike Air Force 1** – Classic white, 20% off with code NIKE15OFF
2. **Nike Pegasus 41** – Top-rated running shoe, sale price
3. **Nike Tech Fleece Hoodie** – Premium comfort, 25% off

Stay tuned to BargainsVault for the latest Nike coupon codes and deal alerts.`,
    },
    {
      title: 'How to Save Big at Walmart: A Complete Guide',
      slug: 'how-to-save-big-at-walmart',
      excerpt: 'Walmart offers more savings opportunities than most people realize. Here\'s how to take full advantage.',
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1608303588026-884930af2559?w=800',
      content: `Walmart is the world's largest retailer, and it's packed with ways to save money — if you know where to look. Here's a comprehensive guide to getting the most out of every Walmart shopping trip.

## Walmart+ Membership

For $12.95/month, Walmart+ gives you free same-day delivery, free shipping with no minimum, member prices on fuel, and early access to deals. If you shop at Walmart regularly, the membership pays for itself quickly.

## Price Match Guarantee

Walmart will match the price of identical items sold by competitors including Amazon, Target, and Best Buy. Just show the associate the lower price at checkout.

## Rollback Deals

Keep an eye out for the "Rollback" tag in stores and online — these are temporary price cuts on everyday items that can save you 20–40%.

## Grocery Pickup

Order groceries online and pick them up curbside for free. This eliminates impulse purchases and lets you shop with a clear budget.

## Walmart Cash Back Credit Card

The Walmart Rewards Card offers 5% back on Walmart.com purchases, 2% back in-store, and 2% at restaurants and travel. For heavy Walmart shoppers, this card can save hundreds per year.

## Weekly Ad & Clearance

Check the Walmart weekly ad every Thursday for new sales. Also browse the Clearance section — items marked down 50–90% are hidden gems.

## Download the Walmart App

The app has exclusive app-only deals, a barcode scanner to check prices, and lets you view your pickup order status.

## Timing Your Shopping

- **Early morning on weekdays**: Best selection and freshly stocked shelves
- **After major holidays**: Holiday merchandise goes 75–90% off
- **End of season**: Clothing clearance hits its lowest prices

With these strategies, a typical family can save $1,000–$2,000 per year on their Walmart shopping.`,
    },
    {
      title: 'Top 5 Best Buy Deals for Tech Lovers This Month',
      slug: 'top-5-best-buy-deals-tech-lovers',
      excerpt: 'From laptops to 4K TVs, Best Buy has some incredible offers this month. Here are the ones worth your attention.',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
      content: `Best Buy is the go-to destination for electronics, appliances, and home theater gear. This month, they're running some genuinely impressive deals. Here are our top picks.

## 1. Samsung 65" 4K QLED TV – 25% Off

Samsung's QLED lineup delivers vibrant colors and deep blacks thanks to Quantum Dot technology. At 25% off, this is one of the best TV deals we've seen this quarter. Use code BBTECH25 at checkout.

## 2. MacBook Air M3 – $150 Off

Apple's MacBook Air with the M3 chip is a powerhouse for students and professionals. Best Buy occasionally runs limited-time discounts that beat Apple's own pricing. Stock is limited.

## 3. Sony WH-1000XM5 Headphones – 30% Off

These are widely regarded as the best noise-canceling headphones available. At 30% off, they're an exceptional value. Great for commuting, working from home, or travel.

## 4. Dyson V15 Detect Vacuum – $100 Off

Dyson's flagship cordless vacuum comes with a laser dust detection system that literally illuminates particles you'd miss. $100 off makes this premium vacuum much more accessible.

## 5. Xbox Series S Bundle – $50 Off + Free Game

Best Buy has an exclusive Xbox Series S bundle with a controller and one free game. At $50 off the regular price, it's the best entry point into next-gen gaming.

## Best Buy Price Match

Remember: Best Buy will price match Amazon, Walmart, Target, and other major retailers. If you find a better deal elsewhere, they'll honor it.

## Geek Squad Protection

Consider adding Geek Squad Protection to expensive purchases. For a flat yearly fee, you get accident coverage, 24/7 support, and free repairs.

Check BargainsVault for exclusive Best Buy coupon codes updated daily.`,
    },
    {
      title: 'Sephora Beauty Insider: How to Maximize Your Rewards',
      slug: 'sephora-beauty-insider-maximize-rewards',
      excerpt: 'Sephora\'s Beauty Insider program is one of the best loyalty programs in retail. Here\'s how to squeeze every drop of value from it.',
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      content: `Sephora's Beauty Insider program rewards loyal shoppers with points, free samples, birthday gifts, and exclusive sale access. Here's how to get the most from it.

## The Three Tiers

**Insider (Free)**: Earn 1 point per $1 spent, birthday gift, free beauty classes.

**VIB ($350/year spend)**: 1.25 points per $1, double points days, 10–15% off sale events.

**Rouge ($1,000/year spend)**: 1.5 points per $1, free standard shipping, unlimited Beauty Services, Rouge Reward certificates.

## Redeeming Points Wisely

Don't redeem points for small discounts. Instead, save up for bigger rewards:
- 500 points = $10 off (2¢ per point)
- 750 points = $15 off (2¢ per point)
- 2,000 points = $100 reward certificate (5¢ per point!) ← **Best value**

## Beauty Insider Exclusive Events

Sephora runs two major sale events per year (spring and fall) where Beauty Insider members get 10–20% off sitewide. Rouge members get early access.

## Stack Your Savings

- Pay with a cash back credit card (Citi or Chase recommended)
- Apply a promo code at checkout
- Clip any available coupons on the app
- Combine with Beauty Insider points

## Free Samples

At checkout online, Sephora lets you pick 2–3 free samples. This is a great way to try new products before committing.

## The Birthday Gift

Every year during your birthday month, you get a free deluxe sample set worth $20–$30. Rouge members get a bigger gift.

## Sephora App

Download the Sephora app for:
- Augmented reality makeup try-on
- App-exclusive flash offers
- Easy points tracking

With a smart strategy, even a basic Insider member can save $200–$400 per year at Sephora.`,
    },
    {
      title: 'Adidas vs Nike: Which Brand Gives You More for Your Money?',
      slug: 'adidas-vs-nike-which-brand-better-value',
      excerpt: 'Two titans of sportswear face off. We compare quality, price, and discounts to help you decide where to spend your money.',
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=800',
      content: `Nike and Adidas dominate the global sportswear market, but which one offers better value for money? We break it down across several categories.

## Price Range Comparison

Both brands span a wide price range:

| Category | Nike | Adidas |
|---|---|---|
| Entry-level sneakers | $60–$80 | $55–$75 |
| Mid-range performance | $100–$130 | $90–$120 |
| Premium/flagship | $150–$250+ | $140–$220+ |

Adidas tends to be slightly cheaper at the mid-range, while Nike dominates the premium tier.

## Technology & Innovation

**Nike**: React foam, Air Max cushioning, Flyknit upper — the industry benchmark for running comfort.

**Adidas**: Boost foam (widely praised as the best cushioning in the industry), Primeknit upper, Continental rubber outsoles for grip.

*Verdict*: For running, Adidas Boost is hard to beat. For basketball and training, Nike has the edge.

## Sale Frequency

Both brands run regular sales, but their strategies differ:

- **Nike**: Relies on coupon codes and member exclusives. Their Sale section rotates weekly.
- **Adidas**: Runs deeper outlet discounts (up to 70%) but less frequently.

## Resale Value

Nike wins here — Air Jordans and limited Dunks retain or increase in value. Adidas Yeezy releases also hold value but are less predictable.

## Sustainability

Adidas has made stronger public commitments to sustainability, with their Parley ocean plastic line and recycled materials initiative. Nike's Move to Zero program is solid but lagging behind.

## Our Verdict

**For everyday value**: Adidas — especially during outlet sales.
**For performance running**: Adidas Boost platform.
**For style & hype**: Nike — the cultural cachet is unmatched.
**For the best deals**: Follow both on BargainsVault and buy whichever has the better coupon that week.`,
    },
    {
      title: '7 Ways to Find Hidden eBay Deals You\'re Missing',
      slug: '7-ways-find-hidden-ebay-deals',
      excerpt: 'eBay is a treasure trove of bargains — but only if you know the right search techniques. Here are 7 tactics pros use.',
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      content: `eBay has over 1.7 billion listings at any given time. Most buyers only scratch the surface. Here are 7 advanced techniques to find deals that other shoppers miss.

## 1. Search for Misspellings

Sellers who misspell product names in their listings get far fewer bids and views — meaning lower prices for you. Tools like Fat Fingers (fatfingers.com) automate misspelling searches for any product.

## 2. Use "Completed Listings" Filter

Before bidding, filter by "Completed Listings" to see what items actually sold for — not just what sellers are asking. This gives you a realistic price baseline.

## 3. Set Up Saved Searches with Alerts

Save any search and enable email/app notifications. When a new listing matches your criteria, eBay alerts you immediately — giving you first-mover advantage on auctions.

## 4. Bid in the Last 10 Seconds (Sniping)

"Bid sniping" means placing your maximum bid seconds before an auction ends. Services like Gixen (free) and BidNip automate this. It prevents price wars and often wins auctions at lower prices.

## 5. Filter by "Best Offer"

Many fixed-price listings accept "Best Offer." Don't pay full price — make an offer 15–25% below the asking price. Sellers often accept or counter.

## 6. Buy Broken/For Parts Listings

Electronics listed as "for parts or not working" are often just items with a dead battery or minor issue. If you're handy, you can fix them for $10 and sell for a significant profit — or just use them yourself.

## 7. Check Seller Clearances

Some power sellers periodically list bulk lots of merchandise at steep discounts to clear inventory. Search for "lot" or "bundle" in categories you're interested in.

## Bonus: Stack with eBay Coupons

eBay regularly sends coupon codes to registered users (10–15% off). Check BargainsVault for the latest eBay promo codes before making any purchase.

With these techniques, experienced eBay shoppers routinely buy items at 50–70% below retail prices.`,
    },
    {
      title: 'Black Friday 2026: How to Prepare and Win the Best Deals',
      slug: 'black-friday-2026-how-to-prepare',
      excerpt: 'Black Friday is months away but the preparation starts now. Here\'s a proven strategy to score the best deals without the stress.',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
      content: `Black Friday 2026 falls on November 27th. Whether you're shopping online or in-store, preparation is the difference between amazing deals and disappointment. Here's your complete playbook.

## Start Your Wish List Now

The biggest mistake shoppers make is waiting until Black Friday to decide what they want. Start your list today. For each item, note:
- Current price
- Target price (what you'd happily pay)
- Alternative products

## Track Prices Starting October

Use price tracking tools like CamelCamelCamel (Amazon), Google Shopping, or Honey to set price alerts 4–6 weeks before Black Friday. You'll know if a "deal" is real or manufactured.

## Know Your Retailers' Strategies

**Amazon**: Deals start in early November with "Black Friday Countdown" events. The best deals go live on Thanksgiving evening.

**Walmart**: In-store midnight openings plus a huge online push. Focus on TVs and appliances.

**Best Buy**: Deep discounts on flagship electronics. Their doorbuster laptop deals sell out in minutes.

**Target**: Strong toy and home goods deals. Target Circle members get early access.

**Nike & Adidas**: Both typically offer 20–30% sitewide. Stock up on seasonal gear.

## The Best Categories

- **TVs**: Historically the deepest discounts (30–50% off). 65" 4K TVs routinely hit $299–$399.
- **Laptops**: $100–$200 off mid-range models is standard.
- **Gaming**: Console bundles, game deals, accessory discounts.
- **Small Appliances**: Air fryers, coffee makers, robot vacuums.
- **Clothing**: 40–60% off at most apparel retailers.

## Avoid These Common Mistakes

1. **Don't buy just because it's "on sale"** — if you don't need it, it's not a deal.
2. **Watch out for inflated pre-sale prices** — some retailers raise prices weeks before to make discounts look bigger.
3. **Read the fine print on TVs** — "doorbuster" TVs are often inferior models made specifically for Black Friday.

## Our Black Friday Checklist

- [ ] Build your wish list by October 1st
- [ ] Install price tracking tools
- [ ] Sign up for retailer emails (deals are often emailed first)
- [ ] Check BargainsVault for pre-verified coupon codes
- [ ] Set a total budget and stick to it

Bookmark BargainsVault — we'll publish verified Black Friday coupon codes from all major retailers starting November 1st.`,
    },
    {
      title: 'Target Circle vs Walmart+: Which Loyalty Program Wins?',
      slug: 'target-circle-vs-walmart-plus-comparison',
      excerpt: 'Two of America\'s biggest retailers offer loyalty programs with very different value propositions. We break down the pros and cons.',
      featured: false,
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      content: `Target Circle and Walmart+ are both designed to reward loyal shoppers, but they work very differently. Here's a side-by-side comparison to help you decide which is worth your time and money.

## Cost

**Target Circle**: Free to join. No paid tier required.

**Walmart+**: $12.95/month or $98/year. No free tier.

*Advantage*: Target Circle (it's free)

## Delivery Benefits

**Target Circle**: Free 2-day shipping on orders over $35. Same-day delivery via Shipt costs extra ($99/year separately).

**Walmart+**: Free same-day delivery on grocery and general merchandise orders over $35 with no extra fee. Includes unlimited free shipping on most Walmart.com items.

*Advantage*: Walmart+ (better delivery value, especially for groceries)

## Cash Back & Rewards

**Target Circle**: Earn 1% back on all purchases as Target Circle earnings (redeemable on future purchases). Plus, you get 5% back with the Target RedCard.

**Walmart+**: No points system. The value comes from delivery savings and fuel discounts.

*Advantage*: Target Circle (with RedCard combo)

## Fuel Discounts

**Target Circle**: No fuel benefit.

**Walmart+**: Save 10¢/gallon at Exxon, Mobil, and Walmart fuel stations. Could save $100–$200/year depending on driving habits.

*Advantage*: Walmart+

## Exclusive Deals & Early Access

**Target Circle**: Members get early access to Target deals and exclusive offers. Target Circle Days (similar to Prime Day) offer sitewide discounts.

**Walmart+**: Members get early access to Black Friday deals and some exclusive markdowns.

*Advantage*: Roughly equal

## Our Verdict

**Get Target Circle if**: You shop at Target regularly, don't need same-day delivery, and want to maximize cash back (especially with the RedCard).

**Get Walmart+ if**: You buy groceries frequently, want same-day delivery, and drive a lot (the fuel savings can pay for the membership).

**Best combo**: Target Circle (free) + Walmart+ (paid, if you'll use delivery). Many savvy shoppers use both.`,
    },
    {
      title: 'The Ultimate Guide to Coupon Stacking in 2026',
      slug: 'ultimate-guide-coupon-stacking-2026',
      excerpt: 'Coupon stacking is the art of combining multiple discounts on a single purchase. Master these techniques and save 50–80% regularly.',
      featured: true,
      featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      content: `Coupon stacking is when you combine two or more discounts on a single purchase. Done right, it's possible to save 50–80% off retail prices. Here's a complete guide to doing it legally and effectively.

## What Is Coupon Stacking?

Stacking means layering multiple discount types:
1. A store sale price
2. A manufacturer coupon
3. A store coupon
4. Cash back from a portal or credit card
5. A loyalty program reward

Not all stores allow this, but many do — and those that do present incredible savings opportunities.

## The Best Stores for Stacking

**CVS**: Combine ExtraCare rewards + weekly sale + paper coupon + digital coupon. Often results in free or near-free items.

**Target**: RedCard 5% + Target Circle offer + paper/digital coupon + sale price. Extremely stackable.

**Amazon**: Prime discount + Subscribe & Save + clipped coupon + promo code. Up to 30% stacked savings possible.

**Walgreens**: myWalgreens cash + paper coupon + sale = near-free deals on personal care items frequently.

## Online Coupon Stacking Strategy

1. **Find the best promo code** (BargainsVault has verified codes)
2. **Click through a cash back portal** (Rakuten, TopCashback) before visiting the store
3. **Activate any store loyalty offers** (Target Circle, Amazon clipped coupons)
4. **Pay with a rewards credit card** (2–5% back)

Each layer compounds your savings.

## Cash Back Portals

Browser extensions like Honey, Rakuten, and Capital One Shopping automatically apply the best coupon code and earn you cash back. Install all three — they don't conflict.

## Credit Cards That Maximize Savings

| Card | Best For |
|---|---|
| Citi Double Cash | 2% back everywhere |
| Chase Freedom Flex | 5% back at quarterly rotating categories |
| Amazon Prime Visa | 5% back at Amazon |
| Target RedCard | 5% back at Target |

## Advanced Technique: Price Match + Stack

Buy an item at Target using a Target Circle offer, then price match to Walmart's lower price. You get the Walmart price WITH the Target Circle savings on top. Completely legitimate.

## Things to Avoid

- Don't buy things you don't need just to "save" — that's not saving, it's spending.
- Don't use expired coupons (you'll waste time at checkout).
- Always read the fine print on exclusions.

Stacking takes practice, but once you develop the habit, it becomes second nature. Bookmark BargainsVault for daily verified codes across all major retailers.`,
    },
  ]

  await db.insert(blogs).values(blogData).onConflictDoNothing()
  console.log(`✓ ${blogData.length} blogs seeded`)

  console.log('\n=== Seed complete! ===')
  console.log(`Admin login:\n  Email: ${adminEmail}\n  Password: ${adminPassword}`)
  await pool.end()
}

main().catch(console.error)
