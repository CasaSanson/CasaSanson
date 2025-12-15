"use client";
import Footer from "@/components/footer/Footer";
import Flipbook from "@/components/journal/Flipbook";
import Collage from "@/components/journal/Collage";
import Letter from "@/components/journal/Letter";

export default function Journal() {
  return (
    <div>
      <main className="bg-white  bg-center h-full mt-[11vh] w-screen pt-18 relative">
        <section className="h-auto  w-full mx-auto  border-b border-black">
          <Flipbook/>
          <Collage/>
        </section>
        {/*Letter */}
        <section className="py-16 mb-24 bg-[url(/papel_arroz_bg.jpg)] bg-cover w-full mx-auto">
          <Letter/> 
        </section>
       <Footer />
      </main> 
    </div>
  );
}