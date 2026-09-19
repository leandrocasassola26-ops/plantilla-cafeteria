"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { promociones, servicios, sucursales } from "@/lib/config"
import { useBusinessData } from "@/components/AppDataProvider"

type CartLine = { name: string; price: number; quantity: number; category: string }

export default function Pedir() {
  const { addAppointment } = useBusinessData()
  const [category, setCategory] = useState("cafes")
  const [cart, setCart] = useState<CartLine[]>([])
  const [mode, setMode] = useState<"Retiro"|"Delivery">("Retiro")
  const [branchId, setBranchId] = useState("palermo")
  const [address, setAddress] = useState("Av. Santa Fe 3250, 4° B")
  const [payment, setPayment] = useState("Mercado Pago")
  const [notes, setNotes] = useState("")
  const [step, setStep] = useState(1)
  const [complete, setComplete] = useState(false)
  const branch = sucursales.find(item => item.id === branchId) || sucursales[0]
  const selectedCategory = servicios.find(item => item.id === category) || servicios[0]
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedService = params.get("servicio")
    const requestedPromo = params.get("promo")
    if (requestedService && servicios.some(item => item.id === requestedService)) setCategory(requestedService)
    if (requestedPromo) {
      const promo = promociones.find(item => item.id === requestedPromo)
      if (promo) setCart([{ name: promo.nombre, price: promo.precio, quantity: 1, category: promo.categoria }])
    }
  }, [])

  function add(name: string, price: number) {
    setCart(current => current.some(item => item.name === name)
      ? current.map(item => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { name, price, quantity: 1, category: selectedCategory.nombre }])
  }

  function changeQuantity(name: string, delta: number) {
    setCart(current => current.map(item => item.name === name ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  }

  function confirmOrder() {
    if (!cart.length || (mode === "Delivery" && !address.trim())) return
    const now = new Date()
    now.setMinutes(now.getMinutes() + (mode === "Delivery" ? 45 : 25))
    addAppointment({
      client: "Sofía Martínez",
      phone: "+54 11 2233 4455",
      serviceId: mode.toLowerCase(),
      serviceName: `Pedido para ${mode.toLowerCase()}`,
      treatment: cart.map(item => `${item.quantity}× ${item.name}`).join(" · "),
      branch: mode === "Retiro" ? branch.nombre : "Delivery",
      address: mode === "Retiro" ? branch.direccion : address,
      date: new Date().toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      duration: mode === "Delivery" ? 45 : 25,
      price: total,
      status: "Pendiente",
      source: "App",
    })
    setComplete(true)
  }

  if (complete) return <ClientShell active="turnos"><section className="success-view"><div>✓</div><small>PEDIDO CONFIRMADO</small><h1>Ya lo estamos preparando</h1><p>Tiempo estimado: {mode === "Delivery" ? "35–45 minutos" : "20–25 minutos"}. Podés seguirlo desde Mis pedidos.</p><Link href="/turnos">SEGUIR MI PEDIDO</Link></section></ClientShell>

  return <ClientShell active="reservar">
    <section className="page-head"><small>PEDÍ DESDE LA APP</small><h1>{step === 1 ? "¿Qué te gustaría pedir?" : "Finalizá tu compra"}</h1><p>{step === 1 ? "Elegí productos, agregalos al carrito y modificá las cantidades." : "Seleccioná retiro o delivery y tu medio de pago."}</p></section>
    {step === 1 && <>
      <div className="filter-row">{servicios.map(item => <button className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} key={item.id}>{item.nombre.toUpperCase()}</button>)}</div>
      <section className="choice-grid">{selectedCategory.tratamientos.map(item => <button onClick={() => add(item.nombre, item.precio)} key={item.nombre}><span>{item.nombre}</span><b>${item.precio.toLocaleString("es-AR")}</b><small>＋ AGREGAR</small></button>)}</section>
      <h3 className="section-label">PROMOCIONES</h3>
      {promociones.slice(0,2).map(promo => <button className="booking-promo" onClick={() => add(promo.nombre, promo.precio)} key={promo.id}><div><small>{promo.categoria}</small><b>{promo.nombre}</b><span>{promo.incluye.join(" · ")}</span></div><strong>${promo.precio.toLocaleString("es-AR")}</strong></button>)}
    </>}
    {cart.length > 0 && <section className="confirm-card" style={{marginTop:18}}><small>TU PEDIDO</small>{cart.map(item => <p key={item.name}><span>{item.name}<br/><small>${item.price.toLocaleString("es-AR")} c/u</small></span><b><button onClick={() => changeQuantity(item.name,-1)}>−</button> {item.quantity} <button onClick={() => changeQuantity(item.name,1)}>＋</button></b></p>)}<p><span>TOTAL</span><b>${total.toLocaleString("es-AR")}</b></p></section>}
    {step === 2 && <section className="confirm-card">
      <small>ENTREGA</small><div className="filter-row" style={{marginTop:14}}><button className={mode === "Retiro" ? "active" : ""} onClick={() => setMode("Retiro")}>RETIRAR EN LOCAL</button><button className={mode === "Delivery" ? "active" : ""} onClick={() => setMode("Delivery")}>DELIVERY</button></div>
      {mode === "Retiro" ? <label className="field-label">Local<select value={branchId} onChange={event => setBranchId(event.target.value)}>{sucursales.map(item => <option value={item.id} key={item.id}>{item.nombre} · {item.direccion}</option>)}</select></label> : <label className="field-label">Dirección de entrega<input value={address} onChange={event => setAddress(event.target.value)} /></label>}
      <label className="field-label">Medio de pago<select value={payment} onChange={event => setPayment(event.target.value)}><option>Mercado Pago</option><option>Tarjeta</option><option>Efectivo</option></select></label>
      <label className="field-label">Indicaciones<textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Ej.: sin azúcar, timbre 4B…" /></label>
      <p><span>Entrega estimada</span><b>{mode === "Delivery" ? "35–45 min" : "20–25 min"}</b></p><p><span>Total</span><b>${total.toLocaleString("es-AR")}</b></p>
    </section>}
    <div className="flow-actions">{step === 2 && <button onClick={() => setStep(1)}>VOLVER AL MENÚ</button>}<button className="primary" disabled={!cart.length} onClick={() => step === 1 ? setStep(2) : confirmOrder()}>{step === 1 ? `VER CARRITO · $${total.toLocaleString("es-AR")}` : "CONFIRMAR PEDIDO"}</button></div>
  </ClientShell>
}
