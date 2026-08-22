# Security Policy

## Supported Versions

Security updates are provided for the latest release on the `main` branch.

| Version | Supported |
| ------- | --------- |
| `main`  | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. Do not create a public GitHub issue.
2. Please use GitHub's private vulnerability reporting feature on the repository.
3. Provide details to reproduce the issue, proof of concept, and affected environments.

## Self-Hosting Security Notes

When deploying SEO Intelligence in production:
- Set a strong `JWT_SECRET` using `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
- Do not expose Redis directly to public networks.
- Configure `FRONTEND_URL` to match your production domain.
