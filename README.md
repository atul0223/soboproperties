# SoBo Properties

An architectural editorial website concept inspired by the user's Software Thekedar site. Plain HTML, CSS and JavaScript; Node 22+ for local tooling. No third-party runtime packages.

```powershell
npm run dev
```

Open http://127.0.0.1:4173. `npm run check` checks JavaScript syntax; `npm run build` copies the static website into `dist/` and verifies that the two generated image assets exist.

## Implemented

Responsive navigation, lifestyle-based neighborhood explorer with URL state, four neighborhood guide dialogs, three editorial field notes, and a property brief builder with clipboard copy and an Instagram link. No form data is transmitted or persisted. Content works without JavaScript except interactive filters and dialogs.

## Requested tool setup

All four requested npm/npx installations were attempted but blocked by the execution environment's network proxy (ECONNREFUSED). No external tool was successfully installed. UI UX Pro Max was targeted at the workspace `.tools` prefix because machine-global installation is outside the writable root. `Leonxlnx/taste` also returns 404 through web lookup; the author's current repository is `Leonxlnx/taste-skill`.

Retry from a network-enabled terminal using `powershell -File scripts/install-design-tools.ps1`. The script uses the corrected Taste repository, a workspace-local CLI prefix, and retains the requested `getdesign ... add clau` argument. The getdesign preset name could not be verified. Vercel's web design skill and its current interface guidelines were read through the web tool and applied during implementation, but were not installed by the CLI.

`design-skills/morphism-ui-styles/SKILL.md` contains the repaired user-supplied skill, including complete CSS for all four styles. It is a source artifact rather than an automatically discovered installation: this session protects `.agents`, `.codex` and global skill folders against writes. The same skill can be copied into an agent skills folder in a writable session. Existing frontend taste instructions were available and used.

## Before launch

Instagram profile access was unavailable, so official branding, logo, business name, contact details, service scope and property inventory remain unconfirmed. All images are illustrative AI-generated architecture; all neighborhood content is general inspiration. The preview is marked `noindex,nofollow`. Confirm business details and replace concept imagery with approved assets before removing that tag. No fake stock, prices, reviews, staff, awards or RERA identifiers are included.

## Image assets

Generated with the built-in image-generation tool and copied into this project:

- `assets/hero.png`: wide editorial image of a conceptual South Mumbai sea-facing apartment balcony, pale sea and skyline on the left, limestone structure and glass doors on the right, calm morning light, no people or text.
- `assets/interior.png`: vertical editorial image of a conceptual contemporary Mumbai living room, limestone floor, cream sofa, floor-to-ceiling windows, sea and hazy skyline, afternoon side light, no people or text.

Full image prompts are recorded in `assets/image-prompts.json`.

## 3D motion update

The hero now uses a dependency-free WebGL architectural model with three towers, recessed glazing, facade fins, planted balconies, floor separation and scroll-driven camera changes across three chapters. Idle orbit and pointer movement animate the model. The page adds perspective tilts, scroll reveals, a moving typography ribbon and CSS scroll-linked photo parallax. Pause control, offscreen/tab suspension, reduced-motion support and photo fallback are included. Native browser automation is unavailable; shader rendering and visual layout still require browser review.
