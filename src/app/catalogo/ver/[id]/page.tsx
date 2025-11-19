"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/products"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AccordionComponent } from "@/components/Accordion"
import Selected from "@/components/SHOP/SELECTED/Selected"

export default function TiendaVerPage({ params }: { params: { id: string } }) {
    const { id } = params
    return (
        <div className="min-h-screen w-full py-4 sm:py-12 px-3 sm:px-4 bg-white">
          <Selected
          params={{ id }}/>  
        </div>
    )
}