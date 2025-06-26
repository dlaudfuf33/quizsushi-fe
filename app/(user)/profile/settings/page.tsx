import { MemberAPI } from "@/lib/api/member.api";
import { getCookieHeader } from "@/lib/serverUtils";
import { SettingsClient } from "./clientPage";

export default async function SettingsPage() {
  const cookie = await getCookieHeader();

  try {
    const userProfile = await MemberAPI.getUserProfile(cookie);

    return <SettingsClient userProfile={userProfile} />;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }
}
