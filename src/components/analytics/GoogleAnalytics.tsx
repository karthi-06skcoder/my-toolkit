import { useEffect } from "react";

function GoogleAnalytics() {
  const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    if (
      document.querySelector(
        `script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`
      )
    ) {
      return;
    }

    const script =
      document.createElement("script");

    script.async = true;
    script.src =
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    document.head.appendChild(script);

    const inlineScript =
      document.createElement("script");

    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: false
      });
    `;

    document.head.appendChild(
      inlineScript
    );

    return () => {
      script.remove();
      inlineScript.remove();
    };
  }, [measurementId]);

  return null;
}

export default GoogleAnalytics;