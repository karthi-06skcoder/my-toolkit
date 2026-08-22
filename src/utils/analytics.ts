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

export const trackToolUsage = (
  toolName: string,
  toolCategory: string
) => {
  trackEvent("tool_used", {
    tool_name: toolName,
    tool_category: toolCategory,
  });
};

export const trackToolSearch = (
  searchTerm: string
) => {
  if (!searchTerm.trim()) {
    return;
  }

  trackEvent("tool_search", {
    search_term: searchTerm.trim(),
  });
};