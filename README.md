# Streamline backend for Vercel

This is **only the API server**, with no HTML frontend.

1. Upload this directory's contents to a GitHub repository.
2. Import that repository into Vercel. Framework Preset: Other. No build command.
3. Under Project Settings > Environment Variables, add `ALLOWED_ORIGINS` set to the *exact* origin of your separate frontend, e.g. `https://example.com` (no trailing slash). Multiple origins can be comma-separated. Redeploy after changing environment variables.
4. Check `https://YOUR-PROJECT.vercel.app/api/health`.
5. For information: `https://YOUR-PROJECT.vercel.app/api/info?id=dQw4w9WgXcQ`.
6. Configure the frontend's `config.js` with your deployment's URL.

This API fetches public YouTube oEmbed metadata. It does NOT proxy YouTube pages or stream video bytes. Actual playback is through YouTube's official iframe embedded in the separate frontend.

Some videos cannot be embedded or do not expose oEmbed metadata. An allowed CORS origin is not authentication, and the API endpoint is publicly callable from non-browser clients.
