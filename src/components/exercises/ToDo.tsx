"use client" // Aquí se pone esto siempre
import React from "react" // Importamos react
import { useState } from 'react' // Importamos use State


export default function toDo() {
  const [Lista, setLista] = useState<string[]>([]);
  const [Tarea, setTarea] = useState("");
  function handleChange (e:React.ChangeEvent<HTMLInputElement>) {
  }


  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto items-center flex-col flex">
        <h1 className="text-2xl text-black">
          Mis Tareas
        </h1>
        <input className="bg-black text-white "
          placeholder="Escribe un texto"
          onChange={handleChange}
          value={Tarea}
          />
        <button onClick={() => {
          setLista(prev => [...prev, Tarea]);
          setTarea(""); // limpia el input
        }}>
          Agregar
        </button>
        <button onClick={() => {
          setLista([]);
          setTarea(""); // limpia el input
        }}>
          Borrar
        </button>
      </div>
      <ul>
  {Lista.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>


    </main>
  )

}

