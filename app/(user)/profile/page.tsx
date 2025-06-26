import { MemberAPI } from "@/lib/api/member.api";
import { getCookieHeader } from "@/lib/serverUtils";
import { MyPageClient } from "./clientPage";

export default async function Page() {
  const cookie = await getCookieHeader();

  const [profileRes] = await Promise.all([MemberAPI.getUserProfile(cookie)]);

  return <MyPageClient userData={profileRes} />;
}
