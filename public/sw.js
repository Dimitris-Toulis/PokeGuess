import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { imageCache } from "workbox-recipes";
precacheAndRoute(self.__WB_MANIFEST);

imageCache({
	matchCallback: options =>
		options.url.pathname.includes("https://raw.githubusercontent.com/PokeAPI/sprites/"),
	plugins: [
		new ExpirationPlugin({
			maxAgeSeconds: 604800,
		}),
	],
});

registerRoute(
	({ request, url }) =>
		["style", "script"].includes(request.destination) && url.origin == self.origin,
	new CacheFirst({
		cacheName: "static-assets",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 40,
			}),
		],
	})
);

registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

self.addEventListener("message", event => {
	if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
