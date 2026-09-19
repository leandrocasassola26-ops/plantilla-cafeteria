"use client"

import { useState } from "react"
import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { promociones } from "@/lib/config"

const filtros = ["TODAS", "DESAYUNOS", "BRUNCH", "MERIENDA", "TAKE AWAY"]

export default function Promos() {
  const [filtro, setFiltro] = useState("TODAS")
  const visibles = filtro === "TODAS" ? promociones : promociones.filter(promo => promo.categoria === filtro)

  return <ClientShell active="promos">
    <section className="page-head"><small>BENEFICIOS LUMEN</small><h1>Sabores para disfrutar</h1><p>Conocé qué incluye cada propuesta y su precio final antes de pedir.</p></section>
    <div className="filter-row">{filtros.map(item => <button key={item} className={filtro === item ? "active" : ""} onClick={() => setFiltro(item)}>{item}</button>)}</div>
    <section className="promo-grid">{visibles.map((promo,index) => <article key={promo.id} className={index === 0 ? "featured" : ""}><div className="promo-tag">{promo.categoria}</div><small>PROMOCIÓN VIGENTE</small><h2>{promo.nombre}</h2><ul>{promo.incluye.map(detalle => <li key={detalle}>✓ {detalle}</li>)}</ul><div className="promo-price"><div><del>${promo.anterior.toLocaleString("es-AR")}</del><b>${promo.precio.toLocaleString("es-AR")}</b><small>precio final</small></div><Link href={`/reservar?promo=${promo.id}`}>ELEGIR</Link></div></article>)}</section>
  </ClientShell>
}
