"use client"

import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { useBusinessData } from "@/components/AppDataProvider"

function prettyDate(iso: string) { return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`)) }

export default function Pedidos() {
  const { appointments, setStatus, ready } = useBusinessData()
  const own = appointments.filter(item => item.client === "Sofía Martínez")
  const upcoming = own.filter(item => !["Realizado","Cancelado"].includes(item.status))
  const history = own.filter(item => ["Realizado","Cancelado"].includes(item.status))
  return <ClientShell active="turnos">
    <section className="page-head"><small>MI ACTIVIDAD</small><h1>Pedidos y reservas</h1><p>Consultá el detalle, cambiá el horario o cancelá.</p></section>
    <Link className="wide-action" href="/reservar">＋ NUEVO PEDIDO</Link>
    <h3 className="section-label">ACTIVOS</h3>
    {!ready && <div className="empty-state">Cargando…</div>}
    {ready && upcoming.length === 0 && <div className="empty-state">No tenés pedidos o reservas activos.</div>}
    <section className="turn-list">{upcoming.map(item => <article className="turn-card" key={item.id}><div className="turn-top"><div className="date"><b>{item.date.slice(8,10)}</b><span>{item.date.slice(5,7)}</span></div><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></div><small>{item.branch.toUpperCase()} · {item.address.toUpperCase()}</small><h2>{item.treatment}</h2><p>{item.serviceName} · {item.time} hs</p><p className="full-date">{prettyDate(item.date)}</p><div className="price-row"><span>Total</span><b>${item.price.toLocaleString("es-AR")}</b></div><div className="turn-actions">{item.status === "Pendiente" && <button onClick={() => setStatus(item.id, "Confirmado")}>CONFIRMAR</button>}<Link href={`/reservar?reprogramar=${item.id}`}>CAMBIAR HORARIO</Link><button className="danger" onClick={() => setStatus(item.id, "Cancelado")}>CANCELAR</button></div><small className="rule">Los cambios se actualizan automáticamente en el panel del local.</small></article>)}</section>
    <h3 className="section-label">HISTORIAL</h3>
    <section className="turn-list">{history.map(item => <article className="turn-card past" key={item.id}><div className="turn-top"><div className="date"><b>{item.date.slice(8,10)}</b><span>{item.date.slice(5,7)}</span></div><span className={`pill ${item.status.toLowerCase()}`}>{item.status}</span></div><h2>{item.treatment}</h2><p>{item.serviceName}</p></article>)}</section>
  </ClientShell>
}
