# dropp

Link-in-bio with built-in digital product sales. Think Linktree, but you can also sell digital products straight from your profile page — Stripe Checkout in, file delivery out.

🌐 **Live:** [dropp-roan.vercel.app](https://dropp-roan.vercel.app)

---

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database + Auth:** Supabase (Postgres + password auth)
- **Payments:** Stripe Checkout + webhook handler
- **Drag-to-reorder:** @dnd-kit
- **Hosting:** Vercel

## Features

- Password auth (magic link ready)
- Username onboarding flow
- Link editor — add, edit, delete, toggle on/off, drag-to-reorder
- Public profile page at `/[username]`
- Digital product listings with Stripe Checkout
- Webhook handler at `/api/webhook` (`checkout.session.completed`)
- Page analytics — views + per-link clicks, last 30 days
- Landing page with pricing
- Dashboard nav (Links / Products / Analytics)

## Revenue model

| Plan | Price | Notes |
|------|-------|-------|
| Free | $0/mo | Unlimited links, 5% transaction fee |
| Pro  | $19/mo | 0% transaction fees |

## Schema

```
profiles     — id, username, display_name, bio, avatar_url, is_pro
links        — id, profile_id, title, url, enabled, position, type, price_cents
page_views   — id, profile_id, created_at
link_clicks  — id, link_id, created_at
```

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys
npm run dev
```

### Required env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

## Roadmap

- [ ] Switch Stripe to live mode for launch
- [ ] Email buyer download link post-purchase (currently logged only)
- [ ] Pro plan subscription gate
- [ ] Avatar upload via Supabase Storage
- [ ] Custom domain support
- [ ] Theme picker for public pages

## License

MIT
