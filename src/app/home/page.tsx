import Header from "@/components/home/Header"
import Columns from "@/components/home/Columns"
import Tape from "@/components/home/Tape"
import Footer from "@/components/footer/Footer"
export default function homenav(){
    return(
        <main className="relative bg-[#111111] pt-18">
            {/* Hero Section */}
            <Header />
            {/* Columnas*/}
            {/* <Columns /> */}
            {/*Tape*/}
            <div className="mb-10">
            <Tape />
            </div>
            {/* Footer */}
            <Footer />
        </main>
    )
}