export type AppointmentStatus = "Pendiente" | "Confirmado" | "Cancelado" | "Realizado"

export type Appointment = {
  id: string
  client: string
  phone: string
  serviceId: string
  serviceName: string
  treatment: string
  branch: string
  address: string
  date: string
  time: string
  duration: number
  price: number
  promoId?: string
  status: AppointmentStatus
  source: "App" | "Call Center"
  updatedAt: string
}

export type Activity = {
  id: string
  appointmentId: string
  text: string
  createdAt: string
}
