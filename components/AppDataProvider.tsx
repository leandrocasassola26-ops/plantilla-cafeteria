"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Activity, Appointment, AppointmentStatus } from "@/lib/types"

type NewAppointment = Omit<Appointment, "id" | "updatedAt">
type Store = {
  ready: boolean
  appointments: Appointment[]
  activity: Activity[]
  addAppointment: (appointment: NewAppointment) => string
  updateAppointment: (id: string, changes: Partial<Appointment>, action: string) => void
  setStatus: (id: string, status: AppointmentStatus) => void
  resetDemo: () => void
}

const STORAGE_KEY = "melo-cafe-demo-v1"

function isoInDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function seedAppointments(): Appointment[] {
  const now = new Date().toISOString()
  return [
    { id: "pedido-sofia", client: "Sofía Martínez", phone: "+54 11 2233 4455", serviceId: "delivery", serviceName: "Pedido para delivery", treatment: "1× Morning Ritual · 1× Cold brew", branch: "Delivery", address: "Av. Santa Fe 3250, 4° B", date: isoInDays(0), time: "12:45", duration: 45, price: 14300, promoId: "p1", status: "Pendiente", source: "App", updatedAt: now },
    { id: "pedido-julian", client: "Julián Gómez", phone: "+54 11 5555 1201", serviceId: "mesa", serviceName: "Pedido para mesa 8", treatment: "2× Flat white · 1× Croissant de manteca", branch: "Belgrano", address: "Mesa 8 · Arcos 2145", date: isoInDays(0), time: "09:15", duration: 15, price: 13500, status: "Confirmado", source: "App", updatedAt: now },
    { id: "pedido-clara", client: "Clara Fernández", phone: "+54 11 5555 2202", serviceId: "retiro", serviceName: "Pedido para retirar", treatment: "2× Brunch Melo · 2× Latte", branch: "Palermo Soho", address: "Malabia 1680", date: isoInDays(0), time: "11:30", duration: 25, price: 40000, promoId: "p2", status: "Pendiente", source: "Call Center", updatedAt: now },
    { id: "pedido-martin", client: "Martín Díaz", phone: "+54 11 5555 3303", serviceId: "almuerzos", serviceName: "Almuerzos", treatment: "Focaccia de bondiola + Cold brew", branch: "Belgrano", address: "Arcos 2145", date: isoInDays(0), time: "13:00", duration: 35, price: 17200, status: "Pendiente", source: "App", updatedAt: now },
  ]
}

const DataContext = createContext<Store | null>(null)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setAppointments(parsed.appointments || seedAppointments())
        setActivity(parsed.activity || [])
      } else setAppointments(seedAppointments())
    } catch { setAppointments(seedAppointments()) }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify({ appointments, activity }))
  }, [appointments, activity, ready])

  const value = useMemo<Store>(() => ({
    ready,
    appointments,
    activity,
    addAppointment(appointment) {
      const id = `pedido-${Date.now()}`
      const next = { ...appointment, id, updatedAt: new Date().toISOString() }
      setAppointments(current => [next, ...current])
      setActivity(current => [{ id: `act-${Date.now()}`, appointmentId: id, text: `${appointment.client} realizó un pedido desde la app`, createdAt: new Date().toISOString() }, ...current])
      return id
    },
    updateAppointment(id, changes, action) {
      setAppointments(current => current.map(item => item.id === id ? { ...item, ...changes, updatedAt: new Date().toISOString() } : item))
      setActivity(current => [{ id: `act-${Date.now()}`, appointmentId: id, text: action, createdAt: new Date().toISOString() }, ...current])
    },
    setStatus(id, status) {
      const labels = { Confirmado: "tiene su pedido en preparación", Cancelado: "canceló su pedido", Pendiente: "tiene un pedido recibido", Realizado: "recibió su pedido" }
      const client = appointments.find(item => item.id === id)?.client || "El cliente"
      setAppointments(current => current.map(item => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item))
      setActivity(current => [{ id: `act-${Date.now()}`, appointmentId: id, text: `${client} ${labels[status]}`, createdAt: new Date().toISOString() }, ...current])
    },
    resetDemo() {
      setAppointments(seedAppointments())
      setActivity([])
      localStorage.removeItem(STORAGE_KEY)
    },
  }), [appointments, activity, ready])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useBusinessData() {
  const value = useContext(DataContext)
  if (!value) throw new Error("useBusinessData must be used inside AppDataProvider")
  return value
}
