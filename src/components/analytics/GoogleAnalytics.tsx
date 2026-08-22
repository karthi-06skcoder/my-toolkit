import { useEffect } from "react";

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

    window.dataLayer =
      window.dataLayer || [];

    window.gtag = function (...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag(
      "js",
      new Date()
    );

    window.gtag(
      "config",
      measurementId
    );

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