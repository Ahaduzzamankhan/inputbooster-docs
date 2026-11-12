/**
 * The page transition.
 *
 * This is a CSS animation rather than a Motion `initial` style on purpose.
 * A server-rendered inline style is re-serialised by the animation engine on
 * the client (`opacity:0` becomes `opacity: 0;`), and React compares the two
 * strings during hydration, so the difference is reported as a hydration
 * mismatch. A CSS animation touches no attribute, so the server HTML and the
 * client render stay identical.
 *
 * `app/template.tsx` remounts this on every navigation, which is what
 * replays the animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
