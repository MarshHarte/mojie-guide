# Mojie (魔戒机场) — Official Website Links and User Guide **(Updated 2026-10-08)**

[简体中文](README.md) · [繁體中文](README.zh-TW.md) · **English** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Русский](README.ru.md)

This project is officially published and maintained by Mojie. It provides current website links, address update dates, historical performance reports, and guidance on access problems, plans, clients, and subscriptions. A static access page is also included.

**Website addresses updated on 2026-10-08 (Beijing time, UTC+8)**

[Official links](#official-links) · [Performance reports](#performance) · [Troubleshooting](#troubleshooting) · [Plans and clients](#plans) · [FAQ](#faq)

<a id="official-links"></a>

## Official Mojie website links

The official Mojie team maintains the website addresses below. Open a link or copy it for later use. Refer to this list when addresses change.

| Entry | Address |
| --- | --- |
| Access link 1 | [mojiegjc.com](https://mojiegjc.com/) |
| Access link 2 | [mojieggw.com](https://mojieggw.com/) |
| Access link 3 | [mojiegjsq.com](https://mojiegjsq.com/) |
| Access link 4 | [mojie-vpn.com](https://mojie-vpn.com/) |

Choose any address. If it is unavailable on your network, try another. Several domains may lead to the same registration service; they do not represent independent proxy nodes or separate backup services.

<a id="performance"></a>

## Historical performance tests and analysis

This section contains archived test screenshots and analysis. All six images show tests dated **2026-05-25**; these are not new measurements or live monitoring results. Actual performance varies by region, internet provider, time, and node. The images retain their original labels; the text below explains the key findings in English.

Speed values retain the **MB** and **KB** labels shown in the images and are not relabeled as Mbps. TLS RTT, HTTPS latency, and download speed are different measurements. All test times below are in Beijing time (CST, UTC+8).

### 1.1 China Unicom evening peak performance

Test time shown: **2026-05-25 20:11:58 CST**. Environment: Shaanxi China Unicom · 1 Gbps · single thread.

[![Full historical Mojie China Unicom evening test](assets/performance/unicom-evening.jpg)](assets/performance/unicom-evening.jpg)

The Hong Kong WAP optimized node recorded an average speed of **50.83 MB** and a peak of **55.65 MB**. The India optimized node averaged **50.13 MB**. Some Japan and Germany nodes showed **0.00B** or returned no latency result; compare them using the full table.

### 1.2 China Telecom evening peak performance

Test time shown: **2026-05-25 20:18:24 CST**. Environment: Zhongshan China Telecom · 1 Gbps · single thread.

[![Full historical Mojie China Telecom evening test](assets/performance/telecom-evening.jpg)](assets/performance/telecom-evening.jpg)

The Taiwan optimized node averaged **25.55 MB**, while the Hong Kong WAP optimized node reached **34.97 MB** at its peak. The same node performed differently on China Telecom and China Unicom. Peak speed alone does not describe sustained download performance.

### 1.3 China Mobile evening peak performance

Test time shown: **2026-05-25 20:26:09 CST**. Environment: Shenzhen China Mobile · 1 Gbps · single thread.

[![Full historical Mojie China Mobile evening test](assets/performance/mobile-evening.jpg)](assets/performance/mobile-evening.jpg)

The Singapore optimized 3 node averaged **51.86 MB** and peaked at **78.03 MB**. The Hong Kong optimized 2 node averaged **48.14 MB**. Some Taiwan and United States nodes performed less well. Compare latency, average speed, and variability when choosing a node.

### 2.1 Streaming service access report

Test time shown: **2026-05-25 20:22:50 CST**. Environment: Jiangsu China Telecom · 2 Gbps.

[![Full historical Mojie streaming access report](assets/performance/streaming-unlock.png)](assets/performance/streaming-unlock.png)

The report covers YouTube, Netflix, Disney+, Bilibili, TikTok, DAZN, Abema, Bahamut Anime, OpenAI, and Steam. Results include detected access regions, failures, and **N/A**. The region in a node's name may differ from the region identified by a platform.

### 2.2 AI service access report

Test time shown: **2026-05-25 20:22:11 CST**. Environment: Liaoyang, Liaoning China Unicom · 1 Gbps · marked x16 in the image.

[![Full historical Mojie AI service access report](assets/performance/ai-unlock.jpg)](assets/performance/ai-unlock.jpg)

The report covers OpenAI, Copilot, Gemini, Meta AI, Claude, Perplexity, and Sora. Results vary by platform: some Japan nodes failed the Gemini check, while some Hong Kong WAP nodes failed checks for OpenAI, Claude, and Sora. The report does not support a claim that every node can access every service.

### 3. Ingress and egress network analysis

Test time shown: **2026-05-25 20:21:35 CST**. Environment: Shaanxi China Unicom · 1 Gbps.

[![Full historical Mojie ingress and egress analysis](assets/performance/network-analysis.png)](assets/performance/network-analysis.png)

The image lists ingress and egress regions, ASNs, organizations, and node mappings, with a summary of **“3 → 9, failures = 6.”** Node labels may differ from the actual egress region: some UK optimized nodes were recorded with an egress region of **FR**. These records do not describe a permanently fixed network topology.

<a id="troubleshooting"></a>

## When a Mojie website link does not open

| What you see | What to check first | What it tells you |
| --- | --- | --- |
| Page timeout or DNS error | Note the domain and time; check whether other websites open | Access failed in the current environment; it does not establish that the service has stopped |
| Certificate or insecure connection warning | Stop entering account details, verify the domain and device time, and wait for resolution | Resolve the certificate or connection issue before signing in; do not bypass the warning |
| The page opens, but your existing account does not work | Check account details, the login page, and the error; contact support through the account page | Website access and account login are separate steps |
| The website works, but the client does not | Check subscription validity, remaining data, and client configuration | Website access and proxy node connections require separate checks |
| Prices or plan rules differ between pages | Check the current plan details, validity period, and support terms in the account page | Use the current terms before purchasing or renewing |

When reporting a problem, include the domain, Beijing time, steps taken, error message, and final page address. Do not post passwords, payment information, or subscription URLs publicly.

<a id="plans"></a>

## What to check about plans and clients

Compare the following information in your account page:

- **Billing and data:** Monthly or usage-based billing, data expiry, and whether adding credit and buying a plan are separate actions.
- **Device limits:** Allowed devices or simultaneous connections, and compatibility with your phone, computer, and client.
- **Performance:** Results from the same region, provider, and time period are more useful than a speed screenshot without a stated environment.
- **Support:** Available support channels, refund conditions, and service incident notifications.

Obtain clients through verified service instructions or the client's own official release channels. Subscription URLs may contain personal credentials; do not include them in public issues or screenshots.

<a id="faq"></a>

## Frequently asked questions

### Where can I find the latest official Mojie website address?

Use the links above; the address update date appears near the top of this document. Open a link or bookmark the access page. If a domain is temporarily unavailable, try another listed address.

### How do I sign in with an existing account or get help?

Open a website link and choose the sign-in option. If an error occurs, record the message, domain, and time, then contact support through the account page. Do not share passwords, payment details, or subscription URLs in public issues.

### How do website links, subscription URLs, and nodes differ?

A website link lets you read service information or manage your account. A subscription URL supplies configuration to a client and may contain a personal key. A node is the network service used by the client. A working website does not prove that a node works or that a speed test has been completed.

### Do multiple domains guarantee independent backup routes?

No. Multiple addresses let you try another domain when one is unavailable, but they may lead to the same website. They do not guarantee independence or represent different or faster proxy nodes.

### Where can I see Mojie plan prices and promotions?

Check the account page for current plans, prices, and promotion terms. Review data expiry, device limits, and refund rules before buying, and check for changes before renewing. Actual performance also depends on region, provider, and time.

### Does the address update date refresh automatically?

No. It changes when the address list is updated. Editing general text or rebuilding the page does not automatically refresh it.

<a id="connection-terms"></a>

## VPN, proxy subscriptions and client software

VPN usually means a virtual private network. Chinese “jichang” services are subscription-based proxies; the broader label “accelerator” does not establish a particular protocol or game-acceleration capability. “科学上网” and “魔法” are informal terms, not plan features or speed guarantees. Use the account documentation to choose the supported client and subscription format.

## Updates and feedback

Actual changes are recorded in this repository's commit history. Report broken links, unexpected destinations, or documentation errors through an issue or a suggested correction. Use the account page's support channels for account, plan, and payment matters, and keep personal credentials out of public reports.
