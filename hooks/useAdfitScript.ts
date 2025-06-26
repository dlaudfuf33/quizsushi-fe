import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const useAdfitScript = () => {
  const pathname = usePathname();

  useEffect(() => {
    const scriptId = "kakao-adfit-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.onload = () => {
        observeAndLoad();
      };
      document.body.appendChild(script);
    } else {
      observeAndLoad();
    }

    function observeAndLoad() {
      const observer = new MutationObserver((mutations, obs) => {
        const insElement = document.querySelector(".kakao_ad_area");
        if (insElement) {
          window.kakao?.adfit?.load?.();
          obs.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // 타이머 fallback도 함께
      setTimeout(() => {
        window.kakao?.adfit?.load?.();
      }, 500);
    }
  }, [pathname]);
};
