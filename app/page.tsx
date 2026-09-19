"use client"

import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { negocio, promociones, servicios } from "@/lib/config"
import { useBusinessData } from "@/components/AppDataProvider"

export default function Inicio() {
  const { appointments } = useBusinessData()
  const activeOrder = appointments.filter(item => item.client === "Sofía Martínez" && !["Cancelado","Realizado"].includes(item.status)).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  return <ClientShell>
    <section className="welcome"><small>BUEN DÍA</small><h1>Hola, Sofía.</h1><p>{negocio.lema}</p></section>
    {activeOrder ? <section className="appointment-card"><div className="appointment-top"><span>PEDIDO EN CURSO</span><b>{activeOrder.status === "Confirmado" ? "EN PREPARACIÓN" : "RECIBIDO"}</b></div><div className="appointment-body"><div className="date"><b>☕</b><span>{activeOrder.time}</span></div><div><small>{activeOrder.serviceName.toUpperCase()}</small><h2>{activeOrder.treatment}</h2><p>{activeOrder.address} · ${activeOrder.price.toLocaleString("es-AR")}</p></div></div><div className="appointment-actions"><Link href="/turnos">SEGUIR PEDIDO</Link><Link href="/reservar">PEDIR OTRA VEZ</Link></div></section> : <section className="no-appointment"><small>TUS PEDIDOS</small><h2>No tenés pedidos en curso</h2><Link href="/reservar">PEDIR AHORA</Link></section>}
    <div className="home-title"><div><small>NUESTRA CARTA</small><h2>Tu momento favorito</h2></div><Link href="/reservar">Ver menú →</Link></div>
    <section className="service-scroll">{servicios.map(item => <Link href={`/reservar?servicio=${item.id}`} key={item.id}><i>{item.icono}</i><b>{item.nombre}</b><span>Desde ${item.desde.toLocaleString("es-AR")}</span></Link>)}</section>
    <section className="loyalty"><div><small>MELO CLUB</small><h2>1.240 <span>puntos</span></h2><p>Te faltan 260 puntos para un café y una porción sin cargo.</p></div><div className="loyalty-ring">76%</div></section>
    <div className="home-title"><div><small>SELECCIÓN DE LA CASA</small><h2>Beneficios para vos</h2></div><Link href="/promos">Todos →</Link></div>
    <section className="promo-mini"><div><small>{promociones[0].categoria}</small><h3>{promociones[0].nombre}</h3><p>{promociones[0].incluye.join(" · ")}</p><b>${promociones[0].precio.toLocaleString("es-AR")}</b></div><Link href={`/reservar?promo=${promociones[0].id}`}>PEDIR</Link></section>
  </ClientShell>
}
