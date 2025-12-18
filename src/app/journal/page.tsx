"use client";
import Footer from "@/components/footer/Footer";
import Flipbook from "@/components/journal/Flipbook";
import Collage from "@/components/journal/Collage";
import Letter from "@/components/journal/Letter";

export default function Journal() {
  return (
    <div>
      <main className="bg-gradient-to-b from-cs-ivory to-cs-nude  bg-center h-full mt-[11vh] w-screen pt-18 relative">
        <section className="h-auto  w-full mx-auto  border-b border-black">
          <div className="hidden md:block">
            <Flipbook />
          </div>
          <div className="block sm:hidden">
            <Collage />
          </div>

        </section>
        {/*Letter */}
        <section className="py-16 mb-24  bg-cover w-full mx-auto">
          <Letter />
        </section>
        <Footer />
      </main>
    </div>
  );
}