"use client";
import Footer from "../../components/footer/Footer";
import AboutComponent from "@/components/about/About";

export default function About() {
  
    return (
        <main className="bg-white min-h-screen w-full mx-auto mt-[10%]">
          <AboutComponent/>
          <Footer/>
        </main>
    );
}