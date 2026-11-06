# DESTREZAS-LAB 2.0 · Problemas idiomáticos + Español para Erasmus

Aplicación didáctica interactiva para **Destrezas Comunicativas**, adaptada a estudiantes locales y de movilidad internacional. Diseñada académicamente por Aránzazu Quintana San José a partir de los materiales docentes «Problemas idiomáticos» y «Corrección idiomática». Implementación inicial asistida por IA y sujeta a revisión final del profesorado.

## Novedades de la versión 2.0

- **136 preguntas autocorregibles** en total: 48 originales + **88 Erasmus**.
- 8 rutas temáticas para Erasmus, con guías desplegables y ejemplos: ser/estar/hay; pasados; subjuntivo; preposiciones y *gustar*; falsos amigos; pronunciación y Cádiz; pragmática; norma y variación.
- Selección de **lengua de referencia opcional** (inglés, francés, italiano, alemán, otra o ejemplos mixtos). El filtro adapta los ocho ejercicios de falsos amigos; los demás módulos se pueden trabajar en cualquier lengua.
- Diagnóstico Erasmus aleatorio de **15 preguntas** con soluciones al final.
- **8 situaciones de reescritura** en total (4 nuevas basadas en situaciones Erasmus), con pautas y soluciones abiertas no autocorregidas.
- Botones de escucha de pares mínimos mediante la voz sintética del navegador (cuando exista esta función); no son grabaciones reales ni se envía audio.
- Mantiene los seis módulos generales, el examen anterior, el glosario, los resultados locales y la exportación CSV/JSON.
- **Seguimiento voluntario** compatible con el mismo Supabase de FONÉTICA-LAB, pero conviene crear una **clase distinta** en el panel para mantener separados los datos.

## Abrir la aplicación

**Opción rápida:** abre `DESTREZAS-LAB_v2.html` con el navegador (archivo único descargable por separado). Puedes practicar sin servidor ni acceso a internet.

**Opción para GitHub:** sube todos los archivos contenidos en esta carpeta a un directorio `destrezas/` del repositorio con GitHub Pages. En ese caso la aplicación estará en:

`https://TUUSUARIO.github.io/fonetica-lab/destrezas/`

Es una ruta de ejemplo, **no está publicada automáticamente**. Se puede publicar en un repositorio distinto si lo prefieres. Los archivos `index.html`, `app.js`, `preguntas.js`, `erasmus-data.js`, `estilos.css`, `config.js` y `seguimiento.js` deben estar juntos.

## Informes de profesora

La aplicación utiliza la misma URL y clave publicable de Supabase que FONÉTICA-LAB (archivo `config.js`), y envía registros a `learning_events` con `module` prefijado por `destrezas:`. Reutiliza el panel existente `profesora.html`; **no hay un panel independiente de DESTREZAS-LAB** en este kit. No vuelvas a ejecutar el SQL si las tablas ya están preparadas.

1. Entra en el panel de FONÉTICA-LAB, inicia sesión y crea una nueva clase, por ejemplo «Destrezas Comunicativas 2026/2027».
2. Comparte **solo el nuevo código de la clase de Destrezas** mediante el Campus Virtual.
3. En una ventana privada, abre DESTREZAS-LAB, introduce el código y activa el seguimiento como alumno ficticio.
4. Completa un cuestionario y consulta **Actualizar datos** en el panel, dentro de la clase nueva.
5. Descarga los informes agregados o registros en CSV/TXT.

La lengua seleccionada en la interfaz no se envía explícitamente como dato de perfil; sí se transmiten, si hay consentimiento y un resultado de cuestionario, el módulo y las preguntas trabajadas. Los ejercicios adaptados pueden indicar indirectamente qué lengua se ha practicado. El alumnado puede optar por no activar el seguimiento.

## Seguridad y privacidad

- No se envían nombres, apellidos, correos, audio ni los textos libres del taller de edición.
- Sí pueden guardarse códigos seudónimos persistentes, actividades, resultados, fecha y módulos si el estudiante activa voluntariamente el seguimiento.
- Los códigos no verifican la identidad y los resultados **no sirven para calificación oficial ni asistencia**.
- Deben revisarse las condiciones de tratamiento con la UCA antes de recopilar datos reales de estudiantes.
- La clave `sb_publishable_` en `config.js` está concebida para clientes públicos, **no** debe sustituirse por claves secretas o contraseñas.
- Para dudas normativas, consultar [Diccionario panhispánico de dudas](https://www.rae.es/dpd/) y las obras académicas. No tratar las variantes dialectales legítimas como errores.

## Archivos y autoría

| Archivo | Función |
|---|---|
| `index.html` | Interfaz y rutas de navegación |
| `preguntas.js` | 48 preguntas y cuatro casos originales |
| `erasmus-data.js` | 88 preguntas Erasmus, ocho guías y cuatro casos nuevos |
| `app.js` | Lógica del aprendizaje, corrección y resultados |
| `seguimiento.js` | Seguimiento remoto opcional |
| `config.js` | Credenciales públicas de conexión (sin claves secretas) |
| `estilos.css` | Diseño adaptable a móviles |
| `GUIA_DOCENTE.md` | Propuesta de uso en el aula |
| `MEMORIA_APLICACION_PLANTILLA.md` | Modelo para documentar uso real |

Este recurso no ha sido aprobado como proyecto INNOVA ni evaluado por ACCUA: debes aplicar y documentar la herramienta antes de solicitar su valoración. No confundas publicación o disponibilidad con uso docente acreditado.