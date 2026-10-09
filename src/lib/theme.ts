/**
 * Theme ("night shift") plumbing shared by the root layout's pre-paint script
 * and the header toggle. The `.dark` class on <html> drives every token in
 * globals.css; with no saved choice the site follows the OS setting.
 */
export const THEME_STORAGE_KEY = "acb-theme";

/**
 * Runs inline in <head> before first paint so a dark-mode visitor never sees
 * a flash of the light page. Kept dependency-free and wrapped in try/catch:
 * localStorage throws in some private windows, and the page must still render.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
