// LabUNAM
// Configuración
// component-export (regla de eslint para declarar y exportar componentes)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Configuración
// Exige un componente con nombre y su exportación por defecto al final del archivo.
const componentExport = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      missing: "Exporta el componente al final con: export default Nombre;",
      last: "Coloca export default Nombre; al final del archivo.",
      declaration:
        "Declara el componente como const Nombre = () => { ... }; y expórtalo por defecto al final.",
    },
  },
  // Revisa el programa completo de cada archivo al que aplica la regla.
  create(
    context, // Object - Contexto de eslint; context.report notifica cada problema
  ) {
    return {
      // Busca el export default y la declaración local del componente.
      Program(
        program, // Object - Nodo raíz del archivo; program.body contiene sus sentencias
      ) {
        const exported = program.body.find((node) => node.type === "ExportDefaultDeclaration");
        if (!exported) {
          context.report({ node: program, messageId: "missing" });
          return;
        }
        if (program.body.at(-1) !== exported) {
          context.report({ node: exported, messageId: "last" });
        }

        // Resolvemos la declaración local para aceptar también páginas async y evitar
        // exports anónimos, reexports o referencias que no sean componentes arrow.
        const name = exported.declaration.name;
        const declaration = program.body.find(
          (node) =>
            node.type === "VariableDeclaration" &&
            node.kind === "const" &&
            node.declarations.some(
              (variable) =>
                variable.id.type === "Identifier" &&
                variable.id.name === name &&
                variable.init?.type === "ArrowFunctionExpression",
            ),
        );
        if (
          exported.declaration.type !== "Identifier" ||
          !/^[A-Z]/.test(name ?? "") ||
          !declaration
        ) {
          context.report({ node: exported, messageId: "declaration" });
        }
      },
    };
  },
};

export default componentExport;
