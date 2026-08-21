export const trackEvent = (
  eventName: string,
  parameters?: Record<
    string,
    string | number | boolean
  >
) => {
  if (
    typeof window === "undefined" ||
    !window.gtag
  ) {
    return;
  }

  window.gtag(
    "event",
    eventName,
    parameters
  );
};