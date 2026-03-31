"use client";

import { useEffect } from "react";

/**
 * Analytics component that loads Google Analytics 4 and Facebook Pixel
 * IDs are read from environment variables
 */
export function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    if (gaId) {
      // Load gtag.js
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gtagScript);

      // Initialize dataLayer and gtag function
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      }
      gtag("js", new Date());
      gtag("config", gaId, {
        send_page_view: false, // We track page views manually via our analytics system
      });

      // Make gtag available globally
      (window as unknown as { gtag: typeof gtag }).gtag = gtag;
    }

    // Facebook Pixel
    const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (fbPixelId) {
      // Load fbq.js via script tag
      const fbScript = document.createElement("script");
      fbScript.async = true;
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }
  }, []);

  return null;
}

/**
 * Script for Google Analytics 4 to be placed in head (alternative method)
 */
export function GAScript() {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!gaId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}

/**
 * Script for Facebook Pixel to be placed in head (alternative method)
 */
export function FBScript() {
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  if (!fbPixelId) return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${fbPixelId}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}
