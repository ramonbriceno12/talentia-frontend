'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import GTM from "@/components/google/GTM";
import GA from "@/components/google/GA";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <title>Talentia - Encuentra Candidatos de Alta Calidad con Nuestra IA</title>
        <meta name="description" content="Nuestra IA conecta tu empresa con los mejores talentos, pre-evaluados y listos para trabajar en tu equipo." />
        <meta name="keywords" content="talento, candidatos, contratación, IA, reclutamiento, trabajos, empresa" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Talentia" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content="https://talentiave.com/img/favicon.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="Talentia - Encuentra Candidatos de Alta Calidad" />
        <meta property="og:description" content="Nuestra IA conecta tu empresa con los mejores talentos, pre-evaluados y listos para trabajar en tu equipo." />
        <meta property="og:url" content="https://talentiave.com/" />
        <meta property="og:type" content="website"/>
        <meta name="twitter:image" content="https://talentiave.com/img/favicon.png" />
        <meta name="twitter:title" content="Talentia - Encuentra Candidatos de Alta Calidad" />
        <meta name="twitter:description" content="Nuestra IA conecta tu empresa con los mejores talentos, pre-evaluados y listos para trabajar en tu equipo." />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/img/favicon.png" />

      </head>

      <body
      >
        <GTM />
        <GA />
        {children}
        <script type="text/javascript" id="hs-script-loader" async defer src="https://js-na2.hs-scripts.com/241997332.js"></script>
      </body>
    </html>
  );
}
