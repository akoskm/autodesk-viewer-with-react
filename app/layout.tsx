import "./globals.css";
import "@fortawesome/fontawesome-free/css/brands.css";
import "@fortawesome/fontawesome-free/css/solid.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autodesk Viewer Demo - Innotek.dev",
  description:
    "Demo application with Next.js, React, Autodesk Viewer, and Autodesk Platform Services in a custom application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script
          strategy="beforeInteractive"
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0.*/viewer3D.min.js"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
