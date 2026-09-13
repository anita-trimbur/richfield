# richfield

Static website built with [Next.js](https://nextjs.org) (App Router) and [Tailwind CSS](https://tailwindcss.com) v4.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # static export to ./out
npm start          # serve ./out locally
npm run typecheck
```

`next.config.ts` sets `output: "export"`, so the site has no server runtime. Deploy the contents of `out/` to any static host.
