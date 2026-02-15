import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Ajoute explicitement les routes d'auth
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhook(.*)' // Si tu en as un plus tard
]);

export default clerkMiddleware(async (auth, request) => {
  // Si ce n'est pas une route publique, on protège
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};