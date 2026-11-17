/**
 * SafeKid browser map configuration.
 * This is a browser-visible MapTiler key by design (client-side map rendering).
 * Restrict the key to the deployed HTTPS origin in the MapTiler account.
 * The build-time VITE_MAP_STYLE_URL value may override this default.
 */
export const DEFAULT_MAP_STYLE_URL = 'https://api.maptiler.com/maps/streets-v4-pastel/style.json?key=HGLlJY48KG0tqlPoDXHZ';
