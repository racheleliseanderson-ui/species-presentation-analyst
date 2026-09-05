# Response headers, and what each one is actually buying

Declared in `vite.config.ts`, as nitro **route rules**, and therefore written
into `.vercel/output/config.json` by the build. The application had none of
these before 2026-09-05 — the only header rule anywhere was `no-store` on
`/api`, in `vercel.json`.

The location matters and is not a style choice. This project deploys through the
Build Output API: nitro produces a finished output directory and Vercel serves
what `config.json` in it says. Header rules in `vercel.json` configure a build
Vercel performs itself, so relying on them for a prebuilt output is a guess that
reads like a guarantee. Route rules end up inside the artifact, which means the
claim is checkable — `src/lib/deploy-config.test.ts` opens the generated
`config.json` and reads them back, and the nitro server applies them locally too,
so `curl -I` against a local production build shows exactly what production will
send.

## Content-Security-Policy

The honest reading of this policy: it stops a third-party origin from executing
script, loading a font, or opening a socket, and it does **not** stop an inline
injection. `script-src` carries `'unsafe-inline'` because two boot scripts run
before first paint (field mode and theme, both `dangerouslySetInnerHTML` in
`src/routes/__root.tsx`) and TanStack Start inlines its hydration payload. A
nonce would remove that hole and is the one real upgrade available here; it
needs the nonce threaded from the server render into both boot scripts and the
framework's own script tags, which is a change to the render path rather than a
change to a config file, so it is written down as the next step rather than
half-done.

`frame-ancestors 'none'` (with `X-Frame-Options: DENY` for older agents) is safe
because nothing embeds this application. The one thing that used to — the
app-builder sandbox's preview host bridge — was removed the same day, and the
fleet handoffs between the seven Hook applications are links carrying a packet
in the URL fragment, never iframes.

`connect-src 'self'` is deliberately narrow. Every network call this app makes
goes to its own `/api` routes; Supabase is read **server side** in the route
handler, never from the browser. If that ever changes, this line is what will
break first, and that is the point of it.

`img-src` allows `data:` and `blob:` because the shared plate kit rasterizes a
drawing to a canvas and hands it back as a data URL when somebody saves a card.

## The rest

| Header | Buying |
| --- | --- |
| `X-Content-Type-Options: nosniff` | A `.webp` mislabelled by a proxy cannot be executed as script. |
| `Referrer-Policy: strict-origin-when-cross-origin` | An outbound agency-regulations link carries the origin, never the species path somebody was reading. |
| `Cross-Origin-Opener-Policy: same-origin` | A window opened from here cannot reach back into it. |
| `Permissions-Policy` | This app asks for no device permissions at all. Saying so explicitly means a future dependency cannot quietly start asking. |

Geolocation is denied on purpose and not by oversight: the fleet's packet
contract strips coordinates in both directions, and an application that cannot
request a position cannot leak one.
