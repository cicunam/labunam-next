// LabUNAM
// Utilidades compartidas
// contacto (apertura del diálogo de contacto desde cualquier botón)
// Ángelo M

// Constantes
// El diálogo vive una sola vez en el layout; los botones lo encuentran por este id.
export const CONTACT_DIALOG_ID = "contact-dialog";

// Definición del módulo
// Abre el diálogo de contacto como modal; showModal hace inerte el resto de la página y, al
// cerrarse, el navegador devuelve el foco al botón que lo abrió.
export function openContactDialog() {
  document.getElementById(CONTACT_DIALOG_ID)?.showModal();
}
