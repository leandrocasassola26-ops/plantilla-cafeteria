"use client"

import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { useBusinessData } from "@/components/AppDataProvider"

const statusCopy = { Pendiente: "Pedido recibido", Confirmado: "En preparación", Realizado: "Entregado", Cancelado: "Cancelado" }

export default function Pedidos() {
  const { appointments, setStatus, ready } = useBusinessData()
  const own = appointments.filter(item => item.client === "Sofía Martínez")
  const active = own.filter(item => !["Realizado","Cancelado"].includes(item.status))
  const history = own.filter(item => ["Realizado","Cancelado"].includes(item.status))
  return <ClientShell active="turnos">
    <section className="page-head"><small>SEGUIMIENTO</small><h1>Mis pedidos</h1><p>Revisá el estado, la entrega y el detalle de cada compra.</p></section>
    <Link className="wide-action" href="/reservar">＋ HACER NUEVO PEDIDO</Link>
    <h3 className="section-label">EN CURSO</h3>
    {!ready && <div className="empty-state">Cargando pedidos…</div>}
    {ready && active.length === 0 && <div className="empty-state">No tenés pedidos en curso.</div>}
    <section className="turn-list">{active.map(item => <article className="turn-card" key={item.id}><div className="turn-top"><div className="date"><b>☕</b><span>{item.time}</span></div><span className={`pill ${item.status.toLowerCase()}`}>{statusCopy[item.status]}</span></div><small>{item.serviceName.toUpperCase()}</small><h2>{item.treatment}</h2><p>{item.branch} · {item.address}</p><div className="price-row"><span>Total pagado</span><b>${item.price.toLocaleString("es-AR")}</b></div><div className="notice">{item.status === "Pendiente" ? "Recibimos tu pedido. El local lo confirmará en instantes." : "Tu pedido está siendo preparado."}</div>{item.status === "Pendiente" && <div className="turn-actions"><button className="danger" onClick={() => setStatus(item.id, "Cancelado")}>CANCELAR PEDIDO</button></div>}</article>)}</section>
    <h3 className="section-label">ANTERIORES</h3>
    <section className="turn-list">{history.map(item => <article className="turn-card past" key={item.id}><div className="turn-top"><div className="date"><b>☕</b><span>{item.time}</span></div><span className={`pill ${item.status.toLowerCase()}`}>{statusCopy[item.status]}</span></div><h2>{item.treatment}</h2><p>${item.price.toLocaleString("es-AR")}</p><Link className="wide-action" href="/reservar">VOLVER A PEDIR</Link></article>)}</section>
  </ClientShell>
}
