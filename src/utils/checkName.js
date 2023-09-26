function checkName(nombre) {
  // Verifica si se ha proporcionado un nombre y que sea una cadena
  if (typeof nombre === "string" && nombre.length >= 3) {
    // Divide el nombre en dos partes: el nombre sin extensión y la extensión
    const partes = nombre.split(".");
    if (partes.length > 1) {
      // Si hay una extensión, elimina espacios en blanco, caracteres especiales y guiones del nombre sin extensión
      const nombreLimpio = partes[0]
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "");

      // Verifica que el nombre sin extensión no esté vacío después de la limpieza
      if (nombreLimpio.length >= 3) {
        // Vuelve a unir el nombre sin extensión y la extensión con un punto
        return nombreLimpio + "." + partes.slice(1).join(".");
      }
    }
  }

  // Si no se cumple ninguna de las condiciones, devuelve null o un mensaje de error
  return null; // O podrías lanzar una excepción o devolver un mensaje de error personalizado
}

module.exports = checkName;
