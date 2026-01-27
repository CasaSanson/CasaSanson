import Header from "@/components/home/Header"
import Tape from "@/components/home/Tape"
import Footer from "@/components/footer/Footer"
import LastRelease from "@/components/shop/LastRelease"
export default function homenav(){
    return(
        <main className="relative bg-[#111111] pt-18">
            {/* Hero Section */}
            <Header />
            {/* Columnas*/}
            <LastRelease/>
            {/*Tape*/}
            <div className="mb-10">
            <Tape />
            </div>
            {/* Footer */}
        </main>
    )
}