/**
 * Theme ("night shift") plumbing shared by the root layout's pre-paint script
 * and the header toggle. The `.dark` class on <html> drives every token in
 * globals.css. Light is the default for everyone; dark only applies once a
 * visitor picks it with the header toggle (the OS setting is ignored).
 */
export const THEME_STORAGE_KEY = "acb-theme";

/**
 * Runs inline in <head> before first paint so a dark-mode visitor never sees
 * a flash of the light page. Kept dependency-free and wrapped in try/catch:
 * localStorage throws in some private windows, and the page must still render.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s==="dark";var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
