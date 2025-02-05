'use client';

import { useEffect } from 'react';

const GA_TRACKING_ID = 'G-87E9JHR99G';

export default function GA() {
  useEffect(() => {
    if (!window) return;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    const scriptInline = document.createElement('script');
    scriptInline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
    `;
    document.head.appendChild(scriptInline);
  }, []);

  return null;
}
