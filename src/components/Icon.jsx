import React from "react";
import { icons } from "../icons.generated";

/**
 * Drop-in replacement for the icon-font and iconify markup this site used.
 *
 * Two modes, matching what each library actually produced in the DOM:
 *
 *  - default: keeps the original <i> wrapper, so rules like `.skills-tile i`
 *    and inline `fontSize` still size the glyph. The svg is 1em, exactly the
 *    box a font glyph occupied.
 *  - `raw`: renders the svg *as* the element, which is what iconify did when
 *    it swapped out a `<span class="iconify">` — width/height styles only
 *    apply to replaced elements like svg, never to an inline span.
 *
 * Colour comes from `currentColor` as it did for the font; emoji keep theirs.
 */
const Icon = ({ name, raw = false, className, style, children, ...rest }) => {
  const icon = icons[name];
  if (!icon) return null;

  const svg = (
    <svg
      className={raw && className ? `icon ${className}` : "icon"}
      style={raw ? style : undefined}
      viewBox={icon.viewBox}
      fill={icon.mono ? "currentColor" : undefined}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.inner }}
      {...(raw ? rest : {})}
    />
  );

  if (raw) return svg;

  return (
    <i className={className} style={style} {...rest}>
      {svg}
      {children}
    </i>
  );
};

export default Icon;
