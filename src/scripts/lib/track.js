// Analytics: pushes to a GTM-style dataLayer (loaded only after consent). Never send PII here.
export const track = (event, props = {}) => {
  (window.dataLayer = window.dataLayer || []).push({ event, ...props });
};
