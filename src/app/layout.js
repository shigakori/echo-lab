import "./globals.css";

import ClientLayout from "@/client-layout";

import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: {
    default: "Echo Lab Studio — Shigakori",
    template: "%s | Echo Lab Studio",
  },
  description: "Creative Studio MWT Website Template — Shigakori",
  keywords: [
    "creative studio",
    "web design",
    "digital art",
    "Echo Lab",
    "Shigakori",
    "portfolio",
    "design agency",
    "creative agency",
    "web development",
    "UI/UX design",
  ],
  authors: [{ name: "Echo Lab Studio" }],
  creator: "Echo Lab Studio",
  publisher: "Echo Lab Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://echo-lab-studio.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://echo-lab-studio.com",
    siteName: "Echo Lab Studio",
    title: "Echo Lab Studio — Shigakori",
    description: "Creative Studio MWT Website Template — Shigakori",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Echo Lab Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo Lab Studio — Shigakori",
    description: "Creative Studio MWT Website Template — Shigakori",
    images: ["/images/og-image.jpg"],
    creator: "@shigakori",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    var ATTRS=["bis_skin_checked","data-new-gr-c-s-check-loaded","data-gr-ext-installed"]; 
    function clean(root){
      ATTRS.forEach(function(a){
        try{root.querySelectorAll("["+a+"]").forEach(function(n){n.removeAttribute(a)})}catch(_){}
      });
    }
    clean(document);
    var observer = new MutationObserver(function(mutations){
      for (var i=0;i<mutations.length;i++){
        var m = mutations[i];
        if (m.type === 'attributes' && ATTRS.indexOf(m.attributeName) !== -1){
          try{m.target.removeAttribute(m.attributeName)}catch(_){}
        }
        if (m.addedNodes && m.addedNodes.length){
          for (var j=0;j<m.addedNodes.length;j++){
            var node = m.addedNodes[j];
            if (node && node.nodeType === 1){ clean(node); }
          }
        }
      }
    });
    observer.observe(document, {subtree:true, childList:true, attributes:true, attributeFilter: ATTRS});
    window.addEventListener('DOMContentLoaded', function(){
      try{clean(document)}catch(_){}
      setTimeout(function(){ try{observer.disconnect()}catch(_){} }, 3000);
    });
  }catch(e){}
})();`,
          }}
        />
        <ViewTransitions>
          <ClientLayout>{children}</ClientLayout>
        </ViewTransitions>
      </body>
    </html>
  );
}
