import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

/** Public marketing site: header, footer and WhatsApp button. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[104px]">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
