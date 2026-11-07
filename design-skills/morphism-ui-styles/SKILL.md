---
name: morphism-ui-styles
description: Implement Neumorphism, Glassmorphism, Claymorphism or Skeuomorphism with coherent material physics when a page or component calls for one of these aesthetics.
license: MIT
metadata:
  author: Design-Systems-Agent
  version: "1.0.0"
---

# Morphism Design Styles

Choose one material system per layout. Never mix these aesthetics in one layout. Use translucent or material-tinted shadows rather than opaque black. Preserve readable text and keyboard focus; shadows alone do not establish accessible contrast.

## Neumorphism

Parent and component must share the exact same background. Raise shapes with upper-left highlights and lower-right shadows; no structural borders. Use inset shadows for pressed states. Dark text #1E2938 on stone #E7E5E4 is a baseline; verify actual contrast before claiming AAA.

```css
.neo-parent, .neo-card { background: #E7E5E4; }
.neo-card {
  color: #1E2938;
  border: 0;
  border-radius: 20px;
  box-shadow: 6px 6px 12px #B0AEAD, -6px -6px 12px #FFFFFF;
}
.neo-card:active {
  box-shadow: inset 6px 6px 12px #B0AEAD, inset -6px -6px 12px #FFFFFF;
}
.neo-card:focus-visible { outline: 3px solid #006666; outline-offset: 4px; }
```

## Glassmorphism

Use a photographic or rich colored backdrop. Blur prevents visual collision; translucent luminous borders suggest glass edges. Make the fill sufficiently opaque for readable text and supply a solid fallback. Blur alone does not guarantee contrast.

```css
.glass {
  background: rgba(255, 255, 255, .8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, .07);
}
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: #f0f2f0; }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: #f0f2f0; backdrop-filter: none; }
}
```

## Claymorphism

Matte saturated pastels, generous rounding, outer shadows plus inner highlights and darkening. Avoid glassy reflections. Baseline coral #FF7676 and 32px radius.

```css
.clay {
  background: #FF7676;
  border-radius: 32px;
  box-shadow: 10px 10px 20px rgba(70, 30, 30, .12),
    inset -8px -8px 16px rgba(70, 30, 30, .15),
    inset 8px 8px 16px rgba(255, 255, 255, .4);
}
```

## Skeuomorphism

Choose one physical material per component: wood, metal, leather or plastic. Respect its directional light, bevels and textures. Do not mix materials within one component. Keep text crisp and high contrast.

```css
.metal-knob {
  background: linear-gradient(180deg, #EEEEEE, #CCCCCC);
  border: 1px solid #AAAAAA;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(30, 35, 40, .3),
    inset 0 2px 2px rgba(255, 255, 255, .6),
    inset 0 -2px 2px rgba(30, 35, 40, .1);
}
```

The supplied source had truncated tables and CSS. These examples restore valid complete syntax while preserving its material rules. This is a workspace skill source; automatic installation into protected .agents or user skill folders requires a writable session.
