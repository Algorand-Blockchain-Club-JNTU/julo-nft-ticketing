import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/ui/header";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-black text-white antialiased")}>
        <Providers>
          <SiteHeader />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

