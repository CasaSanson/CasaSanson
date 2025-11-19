"use client";
import Footer from "@/components/FOOTER/Footer";
import Flipbook from "@/components/JOURNAL/Flipbook";
import Collage from "@/components/JOURNAL/Collage";
import Letter from "@/components/JOURNAL/Letter";

export default function Journal() {
  return (
    <div>
      <main className="bg-white  bg-center h-[60vh] mt-[6vh] w-screen pt-18 relative">
        <section className="h-auto w-full mx-auto  border-b border-black">
          <Flipbook/>
          <Collage/>
        </section>
        {/*Letter */}
        <section className="py-16 mb-24 bg-[#FDE6BB] w-full mx-auto">
          <Letter/> 
        </section>
       <Footer />
      </main> 
    </div>
  );
}