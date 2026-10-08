export const laboratorio = {
    idLab: 1, nombre: "Laboratorio de demostración", tipo: "nacionales",
    entidad: "Instituto de demostración", sedeNombre: "Ciudad de México",
    ubicacion: "Campus de demostración", mapa: "", sitio: "",
    servicios: ["Microscopía óptica", "Análisis de materiales"], equipos: ["Microscopio"], distinciones: [],
    galeria: ["laboratorio-abc.jpeg", "mision.png", "vision.png"].map((imagen) => ({ src: `/assets/images/${imagen}`, alt: "" })),
};
export const filtros = [{ eje: "disciplina", etiqueta: "Área", cualquiera: 3, opciones: [
            { clave: "biologia", etiqueta: "Biología", total: 3 }, { clave: "fisica", etiqueta: "Física", total: 0 },
        ] }];
