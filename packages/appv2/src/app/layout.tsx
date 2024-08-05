import type { Metadata } from "next";
import { OnChainProvider } from "@/components/OnChainProvider";
import Navigation from "@/components/Navigation";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noms",
  description: "Premiere ERC-6551 NFT collectable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        {/* <PageTransitionLoader /> */}
        <OnChainProvider>
          <div className="flex flex-col min-h-screen max-h-screen p-4 text-white">
            <Navigation />
            {children}
          </div>
        </OnChainProvider>
      </body>
    </html>
  );
}
