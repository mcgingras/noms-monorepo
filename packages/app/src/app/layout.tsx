import type { Metadata } from "next";
import { OnChainProvider } from "@/components/OnChainProvider";
import Navigation from "@/components/Navigation";
// import PageTransitionLoader from "@/components/PageTransitionLoader";
import PageTransitionLoaderTwo from "@/components/PageTransitionLoaderTwo";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
        <PageTransitionLoaderTwo />
        <OnChainProvider>
          <div className="flex flex-col min-h-screen max-h-screen p-4 text-white">
            <Navigation />
            {children}
            <Toaster />
          </div>
        </OnChainProvider>
      </body>
    </html>
  );
}
