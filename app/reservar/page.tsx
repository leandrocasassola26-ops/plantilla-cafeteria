"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { promociones, servicios, sucursales } from "@/lib/config"
import { useBusinessData } from "@/components/AppDataProvider"

type CartLine = { name: string; price: number; quantity: number; category: string }

const productImages: Record<string, string> = {
  "Espresso doble": "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=85",
  "Flat white": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85",
  Latte: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=900&q=85",
  "Cold brew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  "Desayuno Porteño": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=85",
  "Brunch Melo": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
  "Avocado toast": "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=85",
  "Bowl de estación": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
  "Croissant de manteca": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
  "Cheesecake vasco": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  "Roll de canela": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",
  "Torta de chocolate": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  "Focaccia de bondiola": "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=85",
  "Sándwich veggie": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
  "Ensalada Melo": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  "Pasta del día": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
}

export default function Pedir() {
  const { addAppointment } = useBusinessData()
  const [category, setCategory] = useState("cafes")
  const [cart, setCart] = useState<CartLine[]>([])
  const [mode, setMode] = useState<"Mesa"|"Retiro"|"Delivery">("Mesa")
  const [tableNumber, setTableNumber] = useState("")
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
    if (!cart.length || (mode === "Delivery" && !address.trim()) || (mode === "Mesa" && !tableNumber.trim())) return
    const now = new Date()
    now.setMinutes(now.getMinutes() + (mode === "Delivery" ? 45 : 25))
    addAppointment({
      client: "Sofía Martínez",
      phone: "+54 11 2233 4455",
      serviceId: mode.toLowerCase(),
      serviceName: mode === "Mesa" ? `Pedido para mesa ${tableNumber}` : `Pedido para ${mode.toLowerCase()}`,
      treatment: cart.map(item => `${item.quantity}× ${item.name}`).join(" · "),
      branch: mode === "Delivery" ? "Delivery" : branch.nombre,
      address: mode === "Delivery" ? address : mode === "Mesa" ? `Mesa ${tableNumber} · ${branch.direccion}` : branch.direccion,
      date: new Date().toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      duration: mode === "Delivery" ? 45 : mode === "Mesa" ? 18 : 25,
      price: total,
      status: "Pendiente",
      source: "App",
    })
    setComplete(true)
  }

  if (complete) return <ClientShell active="turnos"><section className="success-view"><div>✓</div><small>PEDIDO CONFIRMADO</small><h1>Ya lo estamos preparando</h1><p>Tiempo estimado: {mode === "Delivery" ? "35–45 minutos" : mode === "Mesa" ? "12–18 minutos" : "20–25 minutos"}. Podés seguirlo desde Mis pedidos.</p><Link href="/turnos">SEGUIR MI PEDIDO</Link></section></ClientShell>

  return <ClientShell active="reservar">
    <section className="page-head"><small>PEDÍ DESDE LA APP</small><h1>{step === 1 ? "¿Qué te gustaría pedir?" : "Finalizá tu compra"}</h1><p>{step === 1 ? "Elegí productos, agregalos al carrito y modificá las cantidades." : "Seleccioná retiro o delivery y tu medio de pago."}</p></section>
    {step === 1 && <>
      <div className="filter-row">{servicios.map(item => <button className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} key={item.id}>{item.nombre.toUpperCase()}</button>)}</div>
      <section className="menu-grid">{selectedCategory.tratamientos.map(item => {
        const quantity = cart.find(line => line.name === item.nombre)?.quantity || 0
        return <article className="menu-product" key={item.nombre}>
          <img src={productImages[item.nombre]} alt={item.nombre}/>
          <div className="menu-product-copy"><span>{selectedCategory.nombre}</span><h2>{item.nombre}</h2><p>{selectedCategory.detalle}</p><b>${item.precio.toLocaleString("es-AR")}</b></div>
          {quantity === 0 ? <button className="add-product" onClick={() => add(item.nombre, item.precio)}>AGREGAR</button> : <div className="product-counter"><button onClick={() => changeQuantity(item.nombre,-1)}>−</button><strong>{quantity}</strong><button onClick={() => changeQuantity(item.nombre,1)}>＋</button></div>}
        </article>
      })}</section>
      <h3 className="section-label">PROMOCIONES</h3>
      {promociones.slice(0,2).map(promo => <button className="booking-promo" onClick={() => add(promo.nombre, promo.precio)} key={promo.id}><div><small>{promo.categoria}</small><b>{promo.nombre}</b><span>{promo.incluye.join(" · ")}</span></div><strong>${promo.precio.toLocaleString("es-AR")}</strong></button>)}
    </>}
    {cart.length > 0 && <section className="confirm-card" style={{marginTop:18}}><small>TU PEDIDO</small>{cart.map(item => <p key={item.name}><span>{item.name}<br/><small>${item.price.toLocaleString("es-AR")} c/u</small></span><b><button onClick={() => changeQuantity(item.name,-1)}>−</button> {item.quantity} <button onClick={() => changeQuantity(item.name,1)}>＋</button></b></p>)}<p><span>TOTAL</span><b>${total.toLocaleString("es-AR")}</b></p></section>}
    {step === 2 && <section className="confirm-card">
      <small>¿CÓMO QUERÉS RECIBIRLO?</small><div className="delivery-modes"><button className={mode === "Mesa" ? "active" : ""} onClick={() => setMode("Mesa")}><i>▣</i><b>EN MI MESA</b><span>Pedí desde el local</span></button><button className={mode === "Retiro" ? "active" : ""} onClick={() => setMode("Retiro")}><i>◫</i><b>PARA RETIRAR</b><span>Pasá a buscarlo</span></button><button className={mode === "Delivery" ? "active" : ""} onClick={() => setMode("Delivery")}><i>◇</i><b>DELIVERY</b><span>Lo llevamos a tu casa</span></button></div>
      {mode !== "Delivery" && <label className="field-label">Local<select value={branchId} onChange={event => setBranchId(event.target.value)}>{sucursales.map(item => <option value={item.id} key={item.id}>{item.nombre} · {item.direccion}</option>)}</select></label>}
      {mode === "Mesa" && <label className="field-label">Número de mesa<input inputMode="numeric" value={tableNumber} onChange={event => setTableNumber(event.target.value.replace(/\D/g,""))} placeholder="Ej.: 12" /></label>}
      {mode === "Delivery" && <label className="field-label">Dirección de entrega<input value={address} onChange={event => setAddress(event.target.value)} /></label>}
      <label className="field-label">Medio de pago<select value={payment} onChange={event => setPayment(event.target.value)}><option>Mercado Pago</option><option>Tarjeta</option><option>Efectivo</option></select></label>
      <label className="field-label">Indicaciones<textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Ej.: sin azúcar, timbre 4B…" /></label>
      <p><span>Tiempo estimado</span><b>{mode === "Delivery" ? "35–45 min" : mode === "Mesa" ? "12–18 min" : "20–25 min"}</b></p><p><span>Total</span><b>${total.toLocaleString("es-AR")}</b></p>
    </section>}
    <div className="flow-actions">{step === 2 && <button onClick={() => setStep(1)}>VOLVER AL MENÚ</button>}<button className="primary" disabled={!cart.length || (step === 2 && mode === "Mesa" && !tableNumber)} onClick={() => step === 1 ? setStep(2) : confirmOrder()}>{step === 1 ? `VER CARRITO (${cart.reduce((sum,item)=>sum+item.quantity,0)}) · $${total.toLocaleString("es-AR")}` : "CONFIRMAR PEDIDO"}</button></div>
  </ClientShell>
}
