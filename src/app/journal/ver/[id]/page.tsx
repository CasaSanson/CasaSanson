"use client"
import { useParams } from "next/navigation";

export default function Verjournal(){
     const params = useParams();
     const { id } = params;
    return(
        <>
        <p>{params.id}</p>
        </>
    )
}