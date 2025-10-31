import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/debug(.*)",
  "/unauthorized",
]);

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL || "jono@silicondales.com";

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // Protect the route - this will redirect to sign-in if not authenticated
    await auth.protect();
    
    // Get the user ID and fetch full user details
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    // Fetch the user's email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;
    
    // Debug logging
    if (process.env.DEBUG_MODE === 'true') {
      console.log('User email:', userEmail);
      console.log('Allowed email:', ALLOWED_EMAIL);
    }
    
    if (userEmail !== ALLOWED_EMAIL) {
      console.log(`Access denied: ${userEmail} attempted to access dashboard. Only ${ALLOWED_EMAIL} is allowed.`);
      // Unauthorized access - redirect to a custom unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

