"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gapi: any;
  }
}

export const GoogleSignInButton = () => {
  useEffect(() => {
    const scriptId = "google-platform-js";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderGapiButton();
      };
      document.body.appendChild(script);
    } else {
      renderGapiButton();
    }

    function renderGapiButton() {
      const container = document.getElementById("my-signin2");

      if (window.gapi?.signin2 && container) {
        window.gapi.signin2.render("my-signin2", {
          scope: "profile email",
          width: container.offsetWidth,
          height: 45,
          longtitle: true,
          theme: "dark",
          onsuccess: (user: any) =>
            console.log(
              "Google 로그인 성공:",
              user.getBasicProfile().getName()
            ),
          onfailure: (error: any) =>
            console.error("Google 로그인 실패:", error),
        });
      } else {
        console.warn("gapi.signin2가 아직 준비되지 않았습니다.");
      }
    }
  }, []);

  return (
    <div className="w-full h-[45px] flex items-center justify-center overflow-hidden">
      <div
        id="my-signin2"
        className="w-full h-full"
        style={{ maxWidth: "100%", minHeight: 45 }}
      />
    </div>
  );
};
