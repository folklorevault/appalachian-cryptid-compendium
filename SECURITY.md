# Security Policy

## Scope

This policy covers the Appalachian Cryptid Compendium website (appalachiancryptid.com / cryptidberry.xyz), including its Next.js frontend, Sanity CMS backend, and any associated infrastructure.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

**Email:** katy@purpleglittermuse.net 

Please include:
- A description of the vulnerability
- Steps to reproduce the issue
- Any relevant screenshots or logs

**What to expect:**
- I'll acknowledge your report within 72 hours.
- I'll provide an update on the status within 7 days.
- If the vulnerability is confirmed, I'll work to patch it as quickly as possible and will credit you (unless you prefer to remain anonymous).

## What Qualifies

- Cross-site scripting (XSS) or injection vulnerabilities
- Authentication or authorization issues in the CMS or admin areas
- Exposed secrets, API keys, or sensitive configuration
- Server misconfigurations that could expose data

## Out of Scope

- Social engineering or phishing attempts
- Denial of service (DoS/DDoS) attacks
- Vulnerabilities in third-party services (Sanity, Vercel, etc.) — please report those to the respective providers
- Issues that require physical access to infrastructure

## Responsible Disclosure

Please do not publicly disclose a vulnerability until it has been addressed. I'm a solo developer and will work in good faith to resolve issues promptly, but I appreciate patience with timelines.

## Security Practices

This project follows these baseline practices:
- Environment variables for all secrets and API keys
- HTTPS enforced on all domains
- Dependencies reviewed and updated regularly
- Sanity CMS access restricted to authenticated users
- No user-submitted data is stored (no accounts, no forms collecting PII)
