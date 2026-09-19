export const negocio = {
  nombre: "MELO Café",
  iniciales: "M",
  lema: "Café de especialidad. Momentos que se quedan.",
  color: "#641f2b",
  acento: "#eadcc9",
  telefono: "+54 11 4800 2020",
  moneda: "ARS",
}

export const servicios = [
  { id: "cafes", nombre: "Cafés", detalle: "Granos seleccionados y extracción precisa", duracion: 15, desde: 3200, icono: "☕", tratamientos: [{nombre:"Espresso doble",precio:3200},{nombre:"Flat white",precio:4800},{nombre:"Latte",precio:5100},{nombre:"Cold brew",precio:5400}] },
  { id: "desayunos", nombre: "Desayunos", detalle: "Opciones artesanales para empezar el día", duracion: 25, desde: 8500, icono: "◇", tratamientos: [{nombre:"Desayuno Porteño",precio:8500},{nombre:"Brunch Melo",precio:14900},{nombre:"Avocado toast",precio:9200},{nombre:"Bowl de estación",precio:7800}] },
  { id: "pasteleria", nombre: "Pastelería", detalle: "Producción propia todos los días", duracion: 15, desde: 3900, icono: "△", tratamientos: [{nombre:"Croissant de manteca",precio:3900},{nombre:"Cheesecake vasco",precio:6200},{nombre:"Roll de canela",precio:4500},{nombre:"Torta de chocolate",precio:5800}] },
  { id: "almuerzos", nombre: "Almuerzos", detalle: "Platos frescos, simples y abundantes", duracion: 35, desde: 9800, icono: "◐", tratamientos: [{nombre:"Focaccia de bondiola",precio:11800},{nombre:"Sándwich veggie",precio:9800},{nombre:"Ensalada Melo",precio:10500},{nombre:"Pasta del día",precio:12900}] },
]

export const sucursales = [
  { id: "palermo", nombre: "Palermo Soho", direccion: "Malabia 1680" },
  { id: "belgrano", nombre: "Belgrano", direccion: "Arcos 2145" },
]

export const promociones = [
  { id: "p1", categoria: "DESAYUNOS", nombre: "Morning Ritual", incluye: ["Flat white o latte", "Croissant de manteca", "Jugo de naranja"], precio: 8900, anterior: 11200 },
  { id: "p2", categoria: "BRUNCH", nombre: "Brunch para dos", incluye: ["2 cafés a elección", "2 avocado toast", "Porción de pastelería"], precio: 24900, anterior: 30200 },
  { id: "p3", categoria: "MERIENDA", nombre: "Pausa Melo", incluye: ["Café de especialidad", "Cheesecake vasco", "Agua saborizada"], precio: 9200, anterior: 11600 },
  { id: "p4", categoria: "TAKE AWAY", nombre: "Coffee Pass", incluye: ["5 cafés medianos", "Elección de leche", "Vigencia de 30 días"], precio: 18500, anterior: 24000 },
]
