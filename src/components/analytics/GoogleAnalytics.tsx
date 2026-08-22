import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: string,
      ...args: unknown[]
    ) => void;
  }
}

function GoogleAnalytics() {
  const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) {
      console.warn(
        "Google Analytics Measurement ID is missing"
      );
      return;
    }

    // Initialize dataLayer
    window.dataLayer =
      window.dataLayer || [];

    // Define gtag directly on window
    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args);
    };

    // Send initial GA command
    window.gtag("js", new Date());

    window.gtag("config", measurementId);

    // Load Google Analytics script only once
    const existingScript =
      document.querySelector(
        `script[src*="googletagmanager.com/gtag/js"]`
      );

    if (!existingScript) {
      const script =
        document.createElement("script");

      script.async = true;

      script.src =
        `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

      document.head.appendChild(script);
    }
  }, [measurementId]);

  return null;
}

export default GoogleAnalytics;