"use client";
import { useState } from 'react'

export default function Swith(){
    const [Switch, setSwith] = useState(true)
    const bgClass = Switch ? "bg-yellow-200" : "bg-black";

    return(
        <main>
            <div className='border-2 border-black mx-auto bg-white flex flex-col mt-10 h-[80vh] w-[40%]'>
                <div className='grid grid-cols-2 px-3'>
                    <button 
                        className='bg-gray-800 text-white col-span-1'
                        onClick={()=> setSwith(false)}
                    >
                       dark
                    </button>
                    <button 
                        className='bg-yellow-800 text-white col-span-1'
                        onClick={()=> setSwith(true)}
                    >
                       light
                    </button>
                </div>
                <div className={`${bgClass} mx-auto mt-20 border-2 border-black h-[40vh] w-[30%]`}>


                </div>

            </div>
        </main>
    )
}