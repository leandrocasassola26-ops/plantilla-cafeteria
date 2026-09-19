"use client"
import Link from "next/link"
import { negocio } from "@/lib/config"

export default function ClientShell({ children, active = "inicio" }: { children: React.ReactNode; active?: string }) {
  return <div className="client-app">
    <header className="client-head"><div className="client-logo"><span>{negocio.iniciales}</span><div><b>{negocio.nombre}</b><small>SPECIALTY COFFEE</small></div></div><button aria-label="Notificaciones">♢<i>2</i></button></header>
    <main className="client-content">{children}</main>
    <nav className="bottom-nav">
      <Link className={active === "inicio" ? "active" : ""} href="/"><i>⌂</i><span>Inicio</span></Link>
      <Link className={active === "turnos" ? "active" : ""} href="/turnos"><i>▣</i><span>Pedidos</span></Link>
      <Link className={active === "reservar" ? "reserve" : "reserve"} href="/reservar"><i>＋</i><span>Pedir</span></Link>
      <Link className={active === "promos" ? "active" : ""} href="/promos"><i>☆</i><span>Promos</span></Link>
      <Link className={active === "perfil" ? "active" : ""} href="/perfil"><i>○</i><span>Perfil</span></Link>
    </nav>
  </div>
}
