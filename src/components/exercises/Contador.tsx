"use client"
import React from 'react'
import { useState } from 'react'


export default function Contador() {
  const [contador, setContador] = useState(0)

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto items-center flex flex-col">
        <h1 className="text-red-500 text-2xl">
          Contador
        </h1>
        <p className="text-blue-500 text-2xl">{contador}</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setContador(contador - 1)} className="col-span-1 bg-green-500 p-3 text-2xl">     
            -
          </button>
          <button onClick={() => setContador(contador + 1)} className="col-span-1 bg-green-800 p-3 text-2xl">
            +
          </button>
        </div>
      </div>
    </main>
  )
}
