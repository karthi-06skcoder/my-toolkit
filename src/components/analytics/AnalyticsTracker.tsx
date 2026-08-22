import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnalyticsTracker() {
  const location =
    useLocation();

  useEffect(() => {
    const measurementId =
      import.meta.env
        .VITE_GA_MEASUREMENT_ID;

    if (
      !measurementId ||
      !window.gtag
    ) {
      return;
    }

    window.gtag(
      "config",
      measurementId,
      {
        page_path:
          location.pathname +
          location.search,
      }
    );
  }, [
    location.pathname,
    location.search,
  ]);

  return null;
}

export default AnalyticsTracker;