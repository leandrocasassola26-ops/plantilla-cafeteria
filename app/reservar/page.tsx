"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import ClientShell from "@/components/ClientShell"
import { promociones, servicios, sucursales } from "@/lib/config"
import { useBusinessData } from "@/components/AppDataProvider"

const horas = ["08:30", "09:15", "10:30", "11:30", "13:00", "16:30", "18:00", "19:30"]
const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]
const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]

function nextDays() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index + 1)
    return { iso: date.toISOString().slice(0, 10), weekday: weekdays[date.getDay()], number: String(date.getDate()).padStart(2, "0"), month: months[date.getMonth()] }
  })
}

export default function Reservar() {
  const { appointments, addAppointment, updateAppointment } = useBusinessData()
  const [step, setStep] = useState(1)
  const [service, setService] = useState("")
  const [treatment, setTreatment] = useState("")
  const [promo, setPromo] = useState("")
  const [branchId, setBranchId] = useState("palermo")
  const [day, setDay] = useState("")
  const [hour, setHour] = useState("")
  const [editingId, setEditingId] = useState("")
  const [complete, setComplete] = useState(false)
  const days = useMemo(nextDays, [])
  const chosen = useMemo(() => servicios.find(item => item.id === service), [service])
  const chosenTreatment = chosen?.tratamientos.find(item => item.nombre === treatment)
  const chosenPromo = promociones.find(item => item.id === promo)
  const branch = sucursales.find(item => item.id === branchId) || sucursales[0]
  const compatiblePromos = promociones.filter(item => item.categoria === ({ cafes: "TAKE AWAY", desayunos: "DESAYUNOS", pasteleria: "MERIENDA", almuerzos: "BRUNCH" } as Record<string,string>)[service])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedService = params.get("servicio")
    const requestedPromo = params.get("promo")
    const editing = params.get("reprogramar")
    if (requestedService && servicios.some(item => item.id === requestedService)) setService(requestedService)
    if (requestedPromo) {
      const selected = promociones.find(item => item.id === requestedPromo)
      if (selected) {
        setPromo(selected.id)
        setTreatment(selected.nombre)
        const serviceByCategory = ({ "TAKE AWAY": "cafes", DESAYUNOS: "desayunos", MERIENDA: "pasteleria", BRUNCH: "almuerzos" } as Record<string,string>)[selected.categoria]
        if (serviceByCategory) setService(serviceByCategory)
      }
    }
    if (editing) setEditingId(editing === "1" ? "pedido-sofia" : editing)
  }, [])

  useEffect(() => {
    if (!editingId) return
    const current = appointments.find(item => item.id === editingId)
    if (!current) return
    setService(current.serviceId)
    setTreatment(current.treatment)
    setPromo(current.promoId || "")
    setBranchId(sucursales.find(item => item.nombre === current.branch)?.id || "palermo")
    setStep(2)
  }, [editingId, appointments])

  function chooseService(id: string) {
    setService(id); setTreatment(""); setPromo("")
  }

  function confirm() {
    if (!chosen || !treatment || !day || !hour) return
    if (editingId) updateAppointment(editingId, { date: day, time: hour }, `Sofía Martínez cambió su reserva para ${day} a las ${hour}`)
    else addAppointment({ client: "Sofía Martínez", phone: "+54 11 2233 4455", serviceId: chosen.id, serviceName: chosen.nombre, treatment, branch: branch.nombre, address: branch.direccion, date: day, time: hour, duration: chosen.duracion, price: chosenPromo?.precio || chosenTreatment?.precio || chosen.desde, promoId: promo || undefined, status: "Pendiente", source: "App" })
    setComplete(true)
  }

  if (complete) return <ClientShell active="turnos"><section className="success-view"><div>✓</div><small>{editingId ? "RESERVA ACTUALIZADA" : "PEDIDO RECIBIDO"}</small><h1>{editingId ? "Tu nuevo horario quedó guardado" : "La cocina ya recibió tu pedido"}</h1><p>Podés seguir su estado y el negocio lo ve inmediatamente.</p><Link href="/turnos">VER MIS PEDIDOS</Link></section></ClientShell>

  return <ClientShell active="reservar">
    <section className="page-head"><small>{editingId ? "CAMBIAR HORARIO" : "NUEVO PEDIDO O RESERVA"}</small><h1>{step === 1 ? "Elegí del menú" : step === 2 ? "¿Cuándo lo querés?" : "Revisá tu pedido"}</h1><p>{editingId ? "Conservamos productos, sucursal y precio. Solo elegí otro día y horario." : step === 1 ? "Productos, combos y precios antes de continuar." : step === 2 ? "Elegí sucursal, día y horario de retiro o mesa." : "Confirmá que los datos sean correctos."}</p></section>
    <div className="stepper">{[1,2,3].map(number => <i className={step >= number ? "active" : ""} key={number}>{number}</i>)}</div>
    {step === 1 && <><div className="service-list">{servicios.map(item => <button className={service === item.id ? "selected" : ""} onClick={() => chooseService(item.id)} key={item.id}><i>{item.icono}</i><div><b>{item.nombre}</b><span>{item.detalle}</span></div><strong>desde<br/>${item.desde.toLocaleString("es-AR")}</strong></button>)}</div>{chosen && <><h3 className="section-label">ELEGÍ EL SERVICIO</h3><div className="choice-grid">{chosen.tratamientos.map(item => <button className={treatment === item.nombre ? "selected" : ""} onClick={() => { setTreatment(item.nombre); setPromo("") }} key={item.nombre}><span>{item.nombre}</span><b>${item.precio.toLocaleString("es-AR")}</b></button>)}</div></>}{compatiblePromos.length > 0 && <><h3 className="section-label">PROMOCIONES COMPATIBLES</h3>{compatiblePromos.map(item => <button className={`booking-promo ${promo === item.id ? "selected" : ""}`} onClick={() => { setPromo(item.id); setTreatment(item.nombre) }} key={item.id}><div><small>{item.categoria}</small><b>{item.nombre}</b><span>{item.incluye.join(" · ")}</span></div><strong>${item.precio.toLocaleString("es-AR")}</strong></button>)}</>}</>}
    {step === 2 && <><label className="field-label">Sucursal<select value={branchId} disabled={Boolean(editingId)} onChange={event => setBranchId(event.target.value)}>{sucursales.map(item => <option value={item.id} key={item.id}>{item.nombre} · {item.direccion}</option>)}</select></label><h3 className="section-label">ELEGÍ EL DÍA</h3><div className="day-row five">{days.map(item => <button className={day === item.iso ? "selected" : ""} onClick={() => setDay(item.iso)} key={item.iso}><span>{item.weekday}</span><b>{item.number}</b><small>{item.month}</small></button>)}</div><h3 className="section-label">HORARIOS DISPONIBLES</h3><div className="hour-grid">{horas.map(item => <button className={hour === item ? "selected" : ""} onClick={() => setHour(item)} key={item}>{item}</button>)}</div></>}
    {step === 3 && <section className="confirm-card"><div className="confirm-mark">✓</div><small>RESUMEN</small><h2>{chosen?.nombre}</h2><p><span>Tratamiento</span><b>{treatment}</b></p><p><span>Sucursal</span><b>{branch.nombre}</b></p><p><span>Dirección</span><b>{branch.direccion}</b></p><p><span>Fecha</span><b>{day.split("-").reverse().join("/")}</b></p><p><span>Horario</span><b>{hour} hs</b></p><p><span>Duración</span><b>{chosen?.duracion} minutos</b></p><p><span>Precio final</span><b>${(chosenPromo?.precio || chosenTreatment?.precio || chosen?.desde || 0).toLocaleString("es-AR")}</b></p><div className="notice">Al confirmar, la reserva aparecerá inmediatamente en el panel de la empresa.</div></section>}
    <div className="flow-actions">{step > (editingId ? 2 : 1) && <button onClick={() => setStep(step - 1)}>ATRÁS</button>}<button className="primary" disabled={step === 1 && (!service || !treatment) || step === 2 && (!day || !hour)} onClick={() => step < 3 ? setStep(step + 1) : confirm()}>{step === 3 ? (editingId ? "GUARDAR NUEVO HORARIO" : "CONFIRMAR RESERVA") : "CONTINUAR"}</button></div>
  </ClientShell>
}
