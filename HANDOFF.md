# 1 Oak Advisory — site rebuild from client content

The site was originally built on limited information and described 1 Oak Advisory as an **advisory firm**
selling valuation, note-sale and REO-disposition services to banks and credit unions. The client's content
(`assets/*.pdf` and `assets/dropbox files from Mike/`) describes a different business: **an institutional
buyer of residential second mortgages and HELOCs**, purchasing for its own account and managing the assets
after purchase. All pages were rewritten against that content, which is now the source of truth.

## Pages

| File | Source | Notes |
| --- | --- | --- |
| `index.html` | `1 OAK ADVISORY - HOME.pdf` | Home |
| `what-we-buy.html` | `WHAT WE BUY.pdf` | Seven acquisition-focus categories |
| `sell-your-loans.html` | `SELL YOUR LOANS TO 1 OAK.pdf` | Five-step acquisition process |
| `originators.html` | `ORIGINATORS.pdf` | Originators, forward flow, banks/CUs, funds |
| `about.html` | `ABOUT 1 OAK ADVISORY.pdf` | Founded 2012; philosophy; three disciplines |
| `contact.html` | `LET.pdf` | Loan-tape intake form |
| `disclosures.html` | — | Rewritten for a principal-buyer model. **Draft — needs counsel.** |
| `services.html` | — | Retired URL. Redirects to `what-we-buy.html`. |

Navigation: Home · What We Buy · Sell Your Loans · Originators · About · **Submit a Tape**.
Disclosures sits in the footer.

## Needs the client before launch

1. **Form endpoint.** `contact.html` posts to `https://formspree.io/f/REPLACE_WITH_YOUR_ID`. Until that is
   replaced with a real endpoint, submissions go nowhere. The page carries a visible email fallback
   (`inquiries@1oakadvisory.com`) so a seller is never stranded, but the form itself is inert.
   Note: **file attachments require a paid Formspree plan** (or another multipart-capable intake). On a
   free plan the "Upload Loan Tape" field is silently dropped.
2. **Phone number and office address.** The original build carried a placeholder phone and a non-existent
   street address. Both were removed rather than published as fact — an invented address is a particular
   problem on a page that also sets legal venue. `TODO (client)` comments mark where they go:
   every page footer, `contact.html`, and `disclosures.html`.
3. **Legal review of `disclosures.html`.** It is a good-faith draft written to match the acquisition
   model — principal purchaser, no advisory or brokerage relationship, indicative pricing non-binding,
   institutional counterparties only, NPI handling, no claimed licenses or registrations. It has not been
   reviewed by an attorney. Confirm in particular: (a) that 1 Oak transacts as principal for its own
   account, (b) that it does not originate consumer loans, (c) the correct governing-law state — "New York"
   is carried over from the previous version and is a placeholder, and (d) the revision date.
4. **Confidentiality wording.** The bar across the bottom of every page reads "Information submitted to
   1 Oak Advisory for review is treated confidentially." None of the supplied PDFs make a confidentiality
   statement, so this is an addition — please confirm the wording. The same applies to the loan-tape
   guidance on `contact.html` ("leave borrower names, Social Security numbers and account numbers out of
   an initial tape").
5. **Form field decisions.** The fields come from `LET.pdf` as supplied. Two worth revisiting:
   *Asset Type* is one required select that mixes product (Closed-End Second, HELOC) with performance
   (Performing, Non-Performing, EPD, Scratch-and-Dent), so a seller with performing closed-end seconds
   cannot answer it cleanly; and *Approximate UPB* is free text, so values will arrive unnormalised
   ("$2.5MM", "2500000"). Currently required: Name, Company, Email, Seller Type, Asset Type.
6. **Domain.** Canonical and Open Graph URLs assume `https://www.1oakadvisory.com/`.

## What was not carried over

Nothing in the supplied content maps to the old Services page (asset valuation, portfolio analysis, note
sales, REO disposition, BPO coordination, investor network access), so it was retired. `services.html`
remains as a meta-refresh stub pointing at `what-we-buy.html`; if the host supports redirects, replace it
with a 301.

No facts were invented. The only hard fact anywhere on the site is "Founded in 2012", from the About PDF.
There are no statistics, transaction volumes, team names, client names, testimonials, licenses or
geographic claims.

## Build notes

Static HTML/CSS/JS, no build step. `css/styles.css` holds the design system; components added for this
content are grouped at the end of the file (`.spec-list`, `.tenets`, `.process`, `.lifecycle`, `.cta`,
`.section__note`, and the loan-tape form styles), followed by accessibility corrections.

Alongside the content work, the following were fixed: the site no longer renders blank without JavaScript;
`prefers-reduced-motion` is honoured (including returning the native cursor); keyboard focus is visible on
every control; each page has a skip link and a `<main>` landmark; muted text now meets WCAG AA; the footer
collapses correctly on phones; the six-item nav has room at every width; and the pages print legibly.
