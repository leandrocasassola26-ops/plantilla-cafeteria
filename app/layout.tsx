import type { Metadata } from "next"
import "./styles.css"
import "./theme.css"
import { AppDataProvider } from "@/components/AppDataProvider"

export const metadata: Metadata = { title: "LUMEN Café", description: "Plantilla premium para cafeterías" }
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><AppDataProvider>{children}</AppDataProvider></body></html> }
