"use client";

import { useEffect, useRef } from "react";

type HCaptchaProps = {
  siteKey: string;
  onVerify: (token: string) => void;
};

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: HTMLElement,
        params: { sitekey: string; callback: (token: string) => void },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

let hcaptchaScriptPromise: Promise<void> | null = null;

function ensureHCaptchaScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.hcaptcha) {
    return Promise.resolve();
  }

  if (hcaptchaScriptPromise) {
    return hcaptchaScriptPromise;
  }

  hcaptchaScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.hcaptcha = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load hCaptcha script"));
    document.head.appendChild(script);
  });

  return hcaptchaScriptPromise;
}

export function HCaptcha({ siteKey, onVerify }: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onVerifyRef = useRef(onVerify);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    let isActive = true;

    void ensureHCaptchaScript().then(() => {
      if (!isActive || !containerRef.current || widgetIdRef.current !== null) {
        return;
      }

      if (!window.hcaptcha) {
        return;
      }

      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerifyRef.current(token);
        },
      });
    });

    return () => {
      isActive = false;
      if (window.hcaptcha && widgetIdRef.current !== null) {
        window.hcaptcha.reset(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  return <div ref={containerRef} />;
}
