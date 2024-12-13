declare global {
  interface Window {
    gtag: (...args: any[]) => void; // Extend the window interface to include gtag
  }
}

export const useAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label || undefined, // Use undefined instead of falsy value
      });
    }
  };

  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-Z3BVVB6QT1', {
        page_path: url,
      });
    }
  };

  return { trackEvent, trackPageView };
};
