import { ButtonLink, PageHero } from "@/components/Section";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[68px] md:pt-[104px]">
        <PageHero eyebrow="Error 404" title="This page could not be found." text="The page you are looking for does not exist or has moved.">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/courses" variant="outline">View courses</ButtonLink>
          </div>
        </PageHero>
      </main>
      <Footer />
    </>
  );
}
