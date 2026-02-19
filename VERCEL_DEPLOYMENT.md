# Vercel Deployment Configuration

## Overview

This repository has Vercel auto-deployments **disabled** to conserve deployment quota and avoid rate limit errors.

## Why Disable Auto-Deployments?

Vercel's automatic deployments trigger on every push, pull request, and merge. This can quickly consume your deployment quota, especially in active repositories with multiple contributors or frequent updates.

## Current Configuration

The `vercel.json` file contains:

```json
{
  "github": {
    "enabled": false,
    "silent": true
  },
  "git": {
    "deploymentEnabled": false
  }
}
```

### Configuration Explained

- **`"github": { "enabled": false }`** - Disables automatic deployments from GitHub integration
- **`"silent": true`** - Suppresses deployment notifications
- **`"git": { "deploymentEnabled": false }`** - Disables git-based automatic deployments

## Primary Deployment: GitHub Pages

This project is primarily deployed via **GitHub Pages**:
- URL: https://quintrix.github.io/qandy/
- Automatic deployment on merge to main branch
- No deployment quota limits
- No additional cost

## Manual Vercel Deployment (Optional)

If you need to deploy to Vercel manually:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

## Re-enabling Auto-Deployments (Not Recommended)

If you need to re-enable auto-deployments:

1. Delete or modify `vercel.json`:
   ```json
   {
     "github": {
       "enabled": true
     }
   }
   ```

2. Alternatively, remove the `vercel.json` file entirely

**Warning**: Re-enabling will consume deployment quota on every push/merge.

## Troubleshooting

### Check Fail Errors from Vercel

If you're still seeing check fail errors:

1. **Verify the configuration is merged** - Make sure `vercel.json` is on your main branch
2. **Check Vercel dashboard** - Confirm the project settings show deployments disabled
3. **Contact Vercel support** - If errors persist, contact Vercel support to verify integration status

### Deployment Not Found

This is expected! With auto-deployments disabled:
- PRs won't have Vercel preview deployments
- Merges won't trigger Vercel production deployments
- Use GitHub Pages links for preview instead

## Best Practices

1. **Use GitHub Pages for all testing** - It's unlimited and automatic
2. **Reserve Vercel for special cases** - Only deploy manually when Vercel-specific features are needed
3. **Monitor your quota** - Keep track at https://vercel.com/account/usage
4. **Document deployment strategy** - Make sure contributors know to use GitHub Pages

## Additional Resources

- [Vercel Configuration Documentation](https://vercel.com/docs/configuration)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Qandy on GitHub Pages](https://quintrix.github.io/qandy/)
