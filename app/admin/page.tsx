"use client"

import { useState } from "react"
import Link from "next/link"
import { useBusinessData } from "@/components/AppDataProvider"

const modules = ["Inicio", "Comandas", "Delivery", "Clientes", "Menú", "Promociones", "Stock", "Caja", "Reportes", "Equipo", "Configuración"]
const icons = ["⌂", "▣", "◇", "♧", "☕", "☆", "□", "$", "↗", "◎", "⚙"]

export default function Admin() {
  const [active, setActive] = useState("Inicio")
  const { appointments, activity, setStatus, resetDemo } = useBusinessData()
  const today = new Date().toISOString().slice(0, 10)
  const todayOrders = appointments.filter(item => item.date === today && item.status !== "Cancelado")
  const pending = appointments.filter(item => item.status === "Pendiente")
  const revenue = todayOrders.reduce((sum, item) => sum + item.price, 0)
  const visible = active === "Comandas" ? appointments : todayOrders

  return <main className="admin-shell">
    <aside className="admin-side"><div className="admin-brand"><span>LC</span><div><b>LUMEN CAFÉ</b><small>OPERACIONES</small></div></div><nav>{modules.map((item,index) => <button className={active === item ? "active" : ""} onClick={() => setActive(item)} key={item}><i>{icons[index]}</i>{item}</button>)}</nav><Link href="/">← Ver app del cliente</Link></aside>
    <section className="admin-main"><header><div><small>OPERACIÓN EN TIEMPO REAL</small><h1>{active === "Inicio" ? "Buen día, Emilia." : active}</h1><p>{active === "Inicio" ? "Pedidos de retiro y delivery aparecen acá automáticamente." : `Administración de ${active.toLowerCase()}.`}</p></div><div className="header-actions"><button onClick={resetDemo} className="ghost">REINICIAR DEMO</button><Link href="/reservar">＋ NUEVA COMANDA</Link></div></header>
      {(active === "Inicio" || active === "Comandas") && <>
        <section className="admin-metrics"><article><small>COMANDAS DE HOY</small><b>{todayOrders.length}</b><span>{todayOrders.filter(item => item.status === "Confirmado").length} en preparación</span></article><article><small>DELIVERY / RETIRO</small><b>{todayOrders.length}</b><span>pedidos activos</span></article><article><small>VENTAS HOY</small><b>${Math.round(revenue / 1000)}k</b><span>importe registrado</span></article><article><small>PENDIENTES</small><b>{pending.length}</b><span>requieren atención</span></article></section>
        <section className="admin-grid"><div className="agenda-panel"><div className="panel-title"><div><small>COMANDAS EN VIVO</small><h2>{active === "Comandas" ? "Todos los pedidos" : "Pedidos de hoy"}</h2></div><button onClick={() => setActive("Comandas")}>VER COMANDAS →</button></div>{visible.length === 0 && <div className="empty-state">No hay comandas para mostrar.</div>}{visible.map(item => <article key={item.id}><b>{item.time}</b><div><strong>{item.client}</strong><span>{item.treatment}</span><small>{item.branch} · {item.source}</small></div><i className={item.status === "Confirmado" ? "green" : item.status === "Cancelado" ? "red" : "gold"}>{item.status}</i><select aria-label={`Estado de ${item.client}`} value={item.status} onChange={event => setStatus(item.id, event.target.value as "Pendiente"|"Confirmado"|"Cancelado"|"Realizado")}><option>Pendiente</option><option>Confirmado</option><option>Realizado</option><option>Cancelado</option></select></article>)}</div><aside className="side-panel"><small>ACTIVIDAD DE CLIENTES</small><h2>Últimos movimientos</h2>{activity.length === 0 && <p className="muted-copy">Probá realizar o cancelar un pedido desde la app.</p>}{activity.slice(0,6).map(item => <div className="activity-item" key={item.id}><span>↻</span><div><b>{item.text}</b><small>{new Date(item.createdAt).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}</small></div></div>)}</aside></section>
        <section className="admin-bottom"><div><small>VENTAS SEMANALES</small><h2>Demanda por día</h2><div className="bars">{[48,72,66,88,82,92].map((value,index)=><span key={index}><i style={{height:`${value}%`}}/><small>{["L","M","X","J","V","S"][index]}</small></span>)}</div></div><div><small>AUTOMATIZACIÓN</small><h2>Operación conectada</h2><div className="automation"><span>✦</span><div><b>Comandas automáticas</b><p>Los pedidos de la app llegan directamente a operación.</p></div></div><div className="automation"><span>◌</span><div><b>Stock y caja</b><p>Ventas, productos y disponibilidad quedan preparados.</p></div></div></div></section>
      </>}
      {!['Inicio','Comandas'].includes(active) && <section className="module-demo"><small>MÓDULO INCLUIDO</small><h2>{active}</h2><p>Esta sección forma parte del producto comercial de cafetería.</p><div><b>✓</b><span>Diseño y navegación disponibles</span></div><div><b>✓</b><span>Datos aislados por local</span></div><div><b>✓</b><span>Permisos por rol preparados</span></div></section>}
    </section>
  </main>
}
