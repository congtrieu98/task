import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/lib/auth/Provider";
import Navbar from "@/components/Navbar";
import TrpcProvider from "@/lib/trpc/Provider";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { Knock } from "@knocklabs/node";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/utils";

<meta
  name="format-detection"
  content="telephone=no, date=no, email=no, address=no"
/>;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions)) as Session;
  if (session) {
    const knockClient = new Knock(process.env.KNOCK_SECRET_API_KEY);
    const knockUser = await knockClient.users.identify(session?.user?.id, {
      name: session?.user?.name as string,
      email: session?.user?.email as string,
    });
    console.log(session);
    console.log(knockUser);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <NextAuthProvider>
            <TrpcProvider>
              <main className="max-w-sm mx-auto py-4">
                <Navbar />
                {children}
              </main>
            </TrpcProvider>
          </NextAuthProvider>

          <Toaster />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
