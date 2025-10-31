export async function isAppOwner(userId: string): Promise<boolean> {
  // Add your app owner ID(s) here
  const APP_OWNER_IDS = [process.env.CLERK_OWNER_ID || ""];
  return APP_OWNER_IDS.includes(userId);
}

export function getAppOwnerIds(): string[] {
  const ownerIds = process.env.CLERK_OWNER_ID;
  if (!ownerIds) return [];
  return ownerIds.split(",").map((id) => id.trim());
}

