---
layout: ../../layouts/GuideLayout.astro
title: "MCP Tools for Amazon Sellers: A Verified Directory (October 2026)"
description: "Which MCP servers can an Amazon seller actually connect to Claude, ChatGPT, or Cursor today? A directory of seller-account, research, ads, tariff, and sourcing MCP tools — with access requirements and what CrossAgent Lab verified itself."
canonicalPath: /guides/amazon-seller-mcp-tools/
lang: en
---

# MCP Tools for Amazon Sellers: A Verified Directory

**Short answer:** as of October 2026, an Amazon seller can connect three kinds of MCP servers to Claude, ChatGPT, Cursor, or Codex: (1) servers that read *your own* Seller Central / SP-API / Ads account, (2) servers that serve *public* marketplace data (price history, keywords, ASIN research) with no seller login, and (3) specialist servers for tariffs, freight, and sourcing. The directory below lists every such tool CrossAgent Lab has documented, what it takes to access it, and — unlike most listicles — **what we verified ourselves and what we did not**.

**How to read the verification column.** "Probed" means the Lab sent an anonymous request to the endpoint and recorded the response (date given). "Docs only" means the entry rests on the vendor's public pages, README, or a public post, and the Lab did not complete sign-up or OAuth. Prices are the vendor's page prices at the date of the case, not negotiated rates.

**Last compiled:** 2026-10-30 (Asia/Shanghai). Maintained by [CrossAgent Lab](https://crossagent.maoxunxing.com/ai-instructions/). For the strategy view — layers, US-only limits, human-in-the-loop patterns — see the companion guide: [Amazon Seller MCP & Ads Agents for Cross-Border Sellers](https://crossagent.maoxunxing.com/guides/amazon-seller-mcp-cross-border/).

---

## A. Your own account data (Seller Central, SP-API, Ads)

These connect to *your* store. Expect OAuth or Login-with-Amazon, and treat write access as off-limits until you have read the vendor's approval flow.

| Tool | What it connects | Access | Lab verification |
|---|---|---|---|
| [Amazon Selling Partner plugin](/cases/amazon-selling-partner-claude-plugin/) | Amazon's first-party connector: listings, inventory, sales analytics into Claude and Amazon Quick; actions need human approval | US Seller Central beta (announced 2026-09-23); international to follow | Docs only (Amazon announcement); Lab did not log into Seller Central |
| [DataDoe Amazon MCP](/cases/datadoe-amazon-seller-vendor-ads-mcp/) | One remote endpoint for Seller Central + Vendor Central + Amazon Ads; writes off by default, dry-run before apply | Amazon OAuth 2.0, no own SP-API app needed; 14-day trial, then $97/month (page price) | **Probed 2026-10-27:** anonymous initialize → HTTP 401 with Bearer challenge and OAuth resource metadata — endpoint live, auth enforced |
| [Tirnav SP-API + Ads MCP](/cases/tirnav-amazon-spapi-ads-mcp/) | SP-API and Ads API as read-first tools so an agent can join stock risk with ad waste; writes draft/approval-gated | Per the public guide; seller's own credentials | Docs only |
| [SellerForge MCP](/cases/reddit-sellerforge-amazon-mcp/) | Reads SellerForge records: account health, FBA inventory, reimbursements, POA, listing audit scores — cannot change Seller Central or Ads | Read-only version stated free by the author | Docs only (Reddit post + product page) |
| [Amazon official Local MCP](/cases/amzn-sp-api-local-mcp/) | Amazon's own npm package: an SP-API development assistant plus a workflow server for Claude / Cursor | Live calls need Login-with-Amazon; other tools run without credentials | Docs only (official discussion #382) |
| [OpenTabs](/cases/reddit-opentabs-amazon-seller-browser-mcp/) | Local Chrome extension + MCP exposing the internal APIs of sites you are already logged into; Seller Central / Vendor Central / Ads named as uses in comments — no OAuth/LWA route | MIT open source; runs on your machine | **Checked 2026-10-27:** repo had an eBay plugin but no seller-central plugin directory; Lab did not install it or log into Seller Central. Treat the seller use as community-reported, not packaged |

## B. Market & product research (public data, no seller login)

These answer "what is happening in the marketplace" — price history, keywords, niche and competitor data. None of them needs your Seller Central account.

| Tool | What it serves | Access | Lab verification |
|---|---|---|---|
| [Keepa official MCP](/cases/keepa-amazon-mcp/) | Price history and Buy Box stats, Product Finder, deals, category best sellers, storefronts, price tracking | Active Keepa API subscription; OAuth or Bearer key; calls spend the same tokens as REST | **Probed 2026-10-26:** anonymous initialize → HTTP 401 (subscription enforced) |
| [AMZScout MCP](/cases/amzscout-mcp-niche-validation/) | Structured niche and competitor intelligence into Claude / ChatGPT / Cursor | Hosted endpoint per the GitHub README | Docs only |
| [SoldScope MCP](/cases/soldscope-mcp-live-amazon-data/) | Keyword research, product search, live ASIN pulls inside MCP clients | Per the product page | Docs only |
| [Sorftime Seller Agent MCP](/cases/sorftime-mcp-blue-ocean-research/) | Marketplace queries that return ranked "blue-ocean" opportunity shortlists | Per the public tutorial | Docs only |
| [Glade API (MCP)](/cases/hn-glade-api-amazon-data-mcp/) | Amazon public data — product, search, offer, review, seller, category, deal, estimates — over REST, GraphQL, or MCP; 17 operations, 13 marketplaces claimed | 100 free units on signup (vendor claim); not affiliated with Amazon | Docs only (Show HN) |
| [SoldFetch MCP](/cases/hn-soldfetch-ebay-sold-listings-mcp/) | Adjacent marketplace: eBay sold/active listings, category search, item details (US/UK/DE) | API key; signup claims 100 free units | **Probed 2026-10-27:** anonymous initialize → HTTP 401, no listings returned |

## C. Advertising

| Tool | What it does | Access | Lab verification |
|---|---|---|---|
| [Amazon Ads official MCP](/cases/amazon-ads-mcp-server-open-beta/) | Amazon's own Ads MCP Server (open beta, 2026-02-02): natural language to Ads API — accounts, reports, and end-to-end Sponsored Products drafts that still need human review before launch | Global open beta for partners with active Ads API credentials | Docs only (Amazon Ads announcement) |
| [DataDoe Amazon MCP](/cases/datadoe-amazon-seller-vendor-ads-mcp/) | Also covers Amazon Ads in the same endpoint as Seller/Vendor (see section A) | See section A | See section A |

## D. Tariffs, freight & compliance

Cross-border sellers hit this layer at the border, not in the ad console: HS/HTS classification, landed cost, duty and screening.

| Tool | What it does | Access | Lab verification |
|---|---|---|---|
| [FreightUtils MCP](/cases/freightutils-freight-mcp-cited-tools/) | 25 read-only freight tools with cited outputs: CBM math, HS lookup, ADR, UK duty | No login to evaluate; Pro £19/month (page price) | **Probed live 2026-10-26:** initialize/tools/list/health HTTP 200, 25 tools; an HS lookup for "cotton t-shirt" returned HS 610910; a CBM calculation returned the correct 9.6 m³ |
| [Gateway Lines Tariff MCP](/cases/gateway-lines-tariff-mcp/) | Free tariff calculator from a licensed ocean NVOCC: landed cost, HTS classification, policy changes — 3 read-only tools | Guests: 10 lookups/week by email; freight customers unlimited | Docs only |
| [border.bot MCP](/cases/border-bot-hs-landed-cost-mcp/) | Product URL or description → destination HS/HTS code + duty, tax, fees, landed cost | OAuth 2.1; prepaid credit packs, 10 free credits; classify/landed-cost 1 credit each | Docs only; Lab did not complete OAuth or run a paid call |
| [EximAgent MCP](/cases/eximagent-trade-mcp-hs-tariff-ofac/) | HS lookup, corridor tariffs, OFAC SDN screening (advisory), importer discovery from shipment records | OAuth 2.1 + Google sign-in; free credits, then balance-based | Docs only; no live tool calls |
| [Avalara Cross-Border MCP](/cases/avalara-cross-border-mcp-hs-tariff/) | Duty rates, punitive duties, PGA codes, import restrictions by HS code | Avalara account + OAuth | Docs only (Avalara developer docs) |
| [Easyship MCP](/cases/easyship-mcp-crossborder-shipping/) | 25 shipping tools across 550+ couriers: rates, labels, address validation, landed cost, tracking | Easyship account + API token; rate fetches free, labels/pickups consume credits | Docs only (official blog + docs) |

## E. Sourcing

| Tool | What it does | Access | Lab verification |
|---|---|---|---|
| [Shopme MCP](/cases/shopme-cn-ecommerce-search-mcp/) | Search Taobao / Tmall / Xiaohongshu products from ChatGPT or a custom agent | Hosted endpoint; open-source package claims zero-key search | **Probed 2026-10-24 — negative result:** tool list readable, but anonymous guest search returned "unavailable" and the npm package was 404. Listed so you do not have to rediscover this |

## F. Adjacent: if you also sell on Shopify

| Tool | What it does | Access | Lab verification |
|---|---|---|---|
| [ShopsForBots MCP](/cases/shopsforbots-agent-ready-shops-mcp/) | A directory of ~500k shops with machine-readable signals, queryable by agents (UCP / declared MCP) | Anonymous read | **Probed live 2026-10-27:** initialize/tools/list HTTP 200, 4 tools; stats returned 500,128 shops (all Shopify); a sample shop lookup returned a readiness score of 63 |
| [Kifly MCP](/cases/hn-kifly-agent-commerce-mcp/) | Sync your catalog into an agent-searchable MCP (22 tools); checkout returns a payment link — no tool completes a purchase alone | Seller account; storefront agent for Shopify / WooCommerce | **Probed 2026-10-26:** initialize/tools/list HTTP 200 (22 tools); product search without a credential → HTTP 401 |
| [Adchestra](/cases/hn-adchestra-google-ads-mcp-shopify/) | Hosted read/write Google Ads MCP built by Shopify sellers (Ads + GA4 + GTM); every write needs an in-agent approval | Hosted; per Show HN | Docs only |

---

## How to choose

- **You want to ask questions about your own store** (orders, inventory, fees, "which ASINs are wasting ad spend") → section A. Start read-only; every credible tool above keeps writes off by default or behind a human approval.
- **You want market answers without connecting your account** → section B. Keepa is the only first-party data-vendor endpoint in this list; the rest are third-party data services — check their numbers against a second source before a buying decision.
- **You ship across borders** → section D is the layer most sellers discover last and pay for first (a wrong HS code costs more than a wrong bid). FreightUtils and Gateway Lines can be evaluated free today.
- **Any tool not in this directory** can be checked the same way we check ours: send an anonymous `initialize`, read the auth challenge, and see whether the vendor's claims survive contact with their own endpoint. Every Lab case page shows its working.

## FAQ

**What MCP tools are available for Amazon sellers?**
Three groups: account connectors for your own Seller Central / SP-API / Ads data (Amazon's Selling Partner plugin, DataDoe, Tirnav-style SP-API servers, Amazon's official Local MCP), public-data research servers (Keepa, AMZScout, SoldScope, Sorftime, Glade), and specialists for ads (Amazon Ads MCP), tariffs and freight (FreightUtils, border.bot, EximAgent, Avalara, Easyship, Gateway Lines), and sourcing (Shopme). The tables above give access requirements and verification status for each.

**Which of these MCP tools are free?**
Free to evaluate: FreightUtils (anonymous read), Gateway Lines Tariff MCP (10 guest lookups/week), Amazon's official Local MCP (non-live tools), SellerForge's read-only MCP (stated free), and signup-credit offers from Glade (100 units) and border.bot (10 credits) — vendor claims, checked on the dates in the table. Keepa requires a paid API subscription; DataDoe is $97/month after a 14-day trial (page price).

**Which tools did CrossAgent Lab actually test?**
The Lab anonymously probed DataDoe, Keepa, SoldFetch, FreightUtils, ShopsForBots, Kifly, OpenTabs (repository check), and Shopme, and recorded HTTP responses and tool lists on the dates shown. FreightUtils and ShopsForBots answered anonymously; the account-data endpoints correctly refused anonymous access. Entries marked "Docs only" rest on vendor pages or public posts, and say so.

**Can an MCP tool change my listings, prices, or ads by itself?**
In this directory, no tool writes by default: DataDoe keeps write actions off until enabled with dry-run, Amazon's plugin and Ads MCP route changes through human approval, SellerForge is read-only, and Kifly's checkout stops at a payment link. If a tool you evaluate offers unguarded writes to Seller Central, that is a finding in itself.

---

*Corrections and new tools: [submit a case](https://crossagent.maoxunxing.com/submit/) or email me@maoxunxing.com. This directory is maintained by CrossAgent Lab; see [what CrossAgent Lab is — and is not](https://crossagent.maoxunxing.com/ai-instructions/).*
