"use client"
import React, { useState, useEffect } from "react"
import Selected from "@/components/shop/selected/Selected"

export default function TiendaVerPage({ params }: { params: { id: string } }) {
    const { id } = params
    return <Selected params={{ id }} />
}