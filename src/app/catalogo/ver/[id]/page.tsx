"use client"
import React, { useState, useEffect } from "react"
import Selected from "@/components/shop/selected/Selected"

export default function TiendaVerPage({ params }: { params: { id: string } }) {
    const { id } = params
    return (
        <div className="min-h-screen w-full py-4 sm:py-12 px-3 sm:px-4 bg-white">
          <Selected
          params={{ id }}/>  
        </div>
    )
}