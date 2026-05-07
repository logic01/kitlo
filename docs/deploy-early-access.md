# Deploy — Early-access page on AWS (kitlo.net)

This doc walks through deploying the standalone `/early-access` page to **kitlo.net** as a static site on AWS. Stack:

- **S3** — stores the built Angular bundle (private bucket, no public access).
- **CloudFront** — TLS termination, CDN, custom-domain routing, SPA-fallback rewrite.
- **ACM** — public TLS cert covering `kitlo.net` + `www.kitlo.net`.
- **Route 53** — alias records pointing the apex and `www` at the CloudFront distribution.
- **Formspree** — waitlist form endpoint (already wired in `WaitlistService.join`).

Expected cost at waitlist-test traffic: well under $1/month, mostly free-tier eligible for the first 12 months.

> The `apiUrl` in `environment.ts` still points at `/api`. Admin/dashboard/auth routes will silently 404 against `/api` once deployed — they're lazy-loaded, so users never download those chunks unless they navigate there. For a market-test waitlist, that's fine.

---

## Prerequisites

- AWS CLI installed and configured (`aws configure`) with permissions for S3, CloudFront, ACM, and Route 53.
- Route 53 hosted zone for `kitlo.net` already exists.
- Formspree form endpoint live: `https://formspree.io/f/xbdwkjrr`.

Verify the hosted zone ID — you'll reference it later:

```powershell
aws route53 list-hosted-zones-by-name --dns-name kitlo.net --query "HostedZones[0].Id" --output text
```

---

## 1. Request the TLS certificate (ACM, **us-east-1**)

CloudFront only accepts certificates from `us-east-1`, regardless of where everything else lives.

1. Open the **AWS Console → Certificate Manager → us-east-1 (N. Virginia)**.
2. **Request public certificate.**
3. Domain names — add **both**:
   - `kitlo.net`
   - `www.kitlo.net`
4. Validation method → **DNS validation**.
5. After requesting, click into the cert → **Create records in Route 53** (one click; ACM creates the `_xxxxx.kitlo.net` CNAME validation records automatically).
6. Wait for status to flip to **Issued** (1–10 min).

Copy the **Certificate ARN** — needed in step 4.

---

## 2. Create the S3 bucket

Bucket name: `kitlo-net`. Region: `us-east-1`.

```powershell
aws s3api create-bucket `
  --bucket kitlo-net `
  --region us-east-1
```

Keep "Block all public access" **ON** — CloudFront reads the bucket privately via Origin Access Control (OAC) in step 4. **Do not enable** S3 static website hosting.

---

## 3. Build and upload the Angular bundle

```powershell
cd C:\repo\kitlo\frontend
npm run build
aws s3 sync dist/kitlo/browser/ s3://kitlo-net/ --delete
```

The Angular app name is `kitlo` (from `angular.json`), so the build output lands at `dist/kitlo/browser/`.

---

## 4. Create the CloudFront distribution

Console → **CloudFront → Create distribution**.

| Field | Value |
|---|---|
| Origin domain | `kitlo-net.s3.us-east-1.amazonaws.com` (pick the bucket from the dropdown — **do not** pick the website endpoint variant) |
| Origin access | **Origin access control settings (recommended)** → Create new OAC → defaults |
| Bucket policy | After creating the OAC, CloudFront prompts you to copy a bucket policy — paste it into the bucket's **Permissions → Bucket policy** |
| Viewer protocol policy | **Redirect HTTP to HTTPS** |
| Allowed HTTP methods | GET, HEAD |
| Compress objects automatically | Yes |
| Default root object | `index.html` |
| Alternate domain names (CNAMEs) | `kitlo.net`, `www.kitlo.net` |
| Custom SSL certificate | the ACM cert from step 1 |
| Price class | **Use only North America and Europe** (cheapest tier) |
| WAF | Off (not needed for waitlist) |

**Custom error responses** (this is the SPA-routing fix — Angular's client-side router needs `index.html` returned for unknown paths):

| HTTP error code | Response page path | HTTP response code | TTL |
|---|---|---|---|
| 403 | `/index.html` | 200 | 0 |
| 404 | `/index.html` | 200 | 0 |

Create the distribution. Status will say **Deploying** for ~5 min, then flip to **Enabled**. Copy the distribution **Domain name** (looks like `d1234abcd.cloudfront.net`) and the **Distribution ID**.

---

## 5. Route 53 alias records

In the **kitlo.net** hosted zone, create two records:

**Apex (`kitlo.net`):**
- Record name: *(blank)*
- Record type: **A**
- Alias: **On**
- Route traffic to: **Alias to CloudFront distribution** → pick the distribution from step 4.

**`www.kitlo.net`:**
- Record name: `www`
- Record type: **A**
- Alias: **On**
- Route traffic to: **Alias to CloudFront distribution** → same distribution.

(Repeat both as **AAAA** records too if you want IPv6 — same alias target. Optional but recommended.)

DNS propagation is usually 1–5 minutes inside Route 53.

---

## 6. Allow the domain in Formspree

Formspree → **Settings → Security → Allowed Domains**. Add:

- `kitlo.net`
- `www.kitlo.net`
- `localhost:4200` (for local dev, if not already there)

Without this, form submissions silently 403 in production.

---

## 7. Verify

Open `https://kitlo.net/early-access` in a fresh browser tab. The form should render. Submit a test entry; you should receive an email at the address tied to the Formspree account within ~10 seconds.

If you also want `https://kitlo.net/` (root) to land on the early-access page, the simplest fix is to update `frontend/src/app/app.routes.ts` so the empty path redirects there, e.g.:

```ts
{ path: '', redirectTo: '/early-access', pathMatch: 'full' }
```

Then re-run the deploy step (section 8).

---

## 8. Future deploys (one-liner)

After any code change:

```powershell
cd C:\repo\kitlo\frontend
npm run build
aws s3 sync dist/kitlo/browser/ s3://kitlo-net/ --delete
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

The first 1,000 invalidation paths per month are free.

Optional convenience — drop a `deploy.ps1` at the repo root with those four lines and the distribution ID baked in.

---

## Troubleshooting

- **403 / "Access Denied" XML page at the URL** — the CloudFront OAC bucket policy isn't attached. Re-run the OAC step in section 4 and copy the policy CloudFront generates into the bucket's Permissions tab.
- **Page loads but a deep link like `/early-access` returns 403/404** — the SPA-fallback custom error responses (403 → `/index.html`, 404 → `/index.html`) aren't configured. Add them in the distribution's **Error pages** tab.
- **Form returns 403 in browser console** — the domain isn't in Formspree's allowed-domains list (section 6). Add it and retry; no redeploy needed.
- **Cert stuck in "Pending validation"** — the DNS validation CNAME wasn't created. In ACM, click into the cert and re-click **Create records in Route 53**.
- **`www.kitlo.net` works but `kitlo.net` doesn't** — the apex record is an A alias to CloudFront, not a CNAME. Route 53's "Alias" toggle is what makes apex aliases work; plain CNAMEs at the apex are invalid in DNS.

---

## What's intentionally not here

- **CI/CD.** Manual deploys are fine for a market-test waitlist. If you want auto-deploy on push, switch to **AWS Amplify Hosting** instead — it points at the GitHub repo, builds on commit, and handles SSL/SPA-routing automatically. ~$0.15/GB served, free tier covers low traffic.
- **Logging / analytics.** CloudFront access logs cost extra; skip them for now. The Formspree dashboard tracks waitlist signup volume, which is the only metric that matters at this stage.
- **`/api` backend.** The .NET backend is not deployed. Admin/dashboard/auth routes exist in the bundle but every API call will 404. This is intentional for the waitlist phase.
