# FONÉTICA-LAB 3.1 · Publicación en GitHub e informes docentes

Recurso universitario de Fonética y Fonología del Español. Conserva las funciones de FONÉTICA-LAB 3.0: símbolos AFI, RFE, transcripción, alofonía, laboratorio de análisis acústico, guía de lectura de espectrogramas, casos y examen.

**Novedades 3.1:** seguimiento optativo con código seudónimo, panel de profesora, informes por clase y exportación a CSV/TXT. Se requiere **GitHub Pages + Supabase** para recibir información desde distintos dispositivos. **GitHub Pages por sí solo no almacena resultados.**

## Archivos del repositorio

- `index.html`: aplicación de los estudiantes (incluye las imágenes de los espectrogramas).
- `telemetria.js`: seguimiento optativo. Solo manda eventos autorizados, resúmenes de ejercicios y preguntas acertadas/falladas.
- `profesora.html`: acceso privado de la profesora, con autenticación.
- `informe.js`: resumen por clase, estadísticas, incidencias más frecuentes y exportaciones.
- `config.js`: **solo la URL y la clave PUBLICABLE** de Supabase. Esta clave no es secreta.
- `supabase_setup.sql`: esquema, privilegios y políticas RLS. Se ejecuta en el **SQL Editor privado de Supabase**, no se sirve al alumnado.
- `PRIVACIDAD.md`: pautas para revisión institucional de protección de datos.

## PASO 1 · Publicar en GitHub Pages

1. En [github.com](https://github.com/) inicia sesión y crea un repositorio, por ejemplo **fonetica-lab**. Puede ser público; no subas datos de estudiantes ni archivos con contraseñas.
2. Sube los archivos de este ZIP a la **raíz** del repositorio (Add file → Upload files → Commit changes). Incluye `.nojekyll`.
3. Abre **Settings → Pages → Build and deployment → Deploy from a branch**. Selecciona **main** y **/(root)** y guarda.
4. La dirección tendrá una forma como `https://TUUSUARIO.github.io/fonetica-lab/`. La aplicación abre desde la raíz. El panel de profesora estará en `https://TUUSUARIO.github.io/fonetica-lab/profesora.html`.
5. La web y los ejercicios funcionan aunque todavía no hayas configurado Supabase, pero el seguimiento remoto permanecerá desactivado.

## PASO 2 · Crear el almacenamiento seguro (Supabase)

1. En [supabase.com](https://supabase.com/) crea tu proyecto y elige una región de la UE disponible. Antes de utilizar datos reales de estudiantes, comprueba con tu institución si este alojamiento y proveedor están autorizados.
2. Abre **SQL Editor → New query**. Pega el contenido de `supabase_setup.sql` y pulsa **Run**.
3. En **Authentication → Providers**, comprueba que el método Email esté disponible. En **Authentication → Users → Add user**, crea tu propia cuenta con correo y contraseña. **El correo, la contraseña y cualquier clave secreta NO van al repositorio.** Asegúrate de que la cuenta esté confirmada/activada conforme al flujo de Supabase.
4. En **Settings → API Keys** copia la **Publishable key** (`sb_publishable_...`); también necesitas la **Project URL** (suele aparecer en Project Settings o Connect).
5. Modifica `config.js` del repositorio, por ejemplo:

   ```javascript
   window.FONETICA_CONFIG = {
     supabaseUrl: "https://TU-PROYECTO.supabase.co",
     supabasePublishableKey: "sb_publishable_TU_CLAVE_PUBLICA"
   };
   ```

   **Nunca pongas** `sb_secret_...`, `service_role`, passwords ni credenciales de profesor en GitHub. Supabase protege las tablas mediante las políticas RLS incluidas en el SQL.
6. Tras publicar el cambio, abre `profesora.html`, inicia sesión y pulsa **Crear clase**. El panel generará un código de 8 caracteres.
7. Entrega el código a los alumnos por Campus Virtual. Deben entrar en la web, introducirlo en el bloque **Compartir mi progreso con la profesora**, leer el aviso, marcar la casilla y activar el seguimiento.
8. Haz una prueba **con un código de prueba** y una cuenta de navegador distinta: finaliza un cuestionario y vuelve al panel de profesora → **Actualizar datos**. Debe aparecer la sesión con la nota y sus preguntas correctas/incorrectas. Comprueba que con un usuario no autorizado no pueden consultarse eventos.

## PASO 3 · Consultar y descargar informes

- **Panel privado**: códigos activos, sesiones completadas, media de aciertos, módulos, visitas a secciones, errores frecuentes y sesiones por código.
- **Descargar CSV**: registros por código, tipo de actividad, módulo, nota, duración aproximada.
- **Descargar informe TXT**: resumen descriptivo listo para adaptar a una memoria docente.
- **Imprimir / guardar PDF**: usa la opción de impresión del navegador para obtener un PDF del panel.
- **Desactivar clase**: deja de aceptar nuevas entregas para ese código.
- **Eliminar los registros de esta clase**: borrado de los datos almacenados en Supabase para esa clase (no de los dispositivos del alumnado).

## ¿Qué se registra exactamente?

- Código de clase y código seudónimo generado en el navegador (persistente hasta que se cambia o elimina el almacenamiento local).
- Inicio de sesión optativa y secciones que se visitan (máximo un evento por sección cada 30 s durante la sesión).
- Al **terminar** un cuestionario o caso: módulo, nota, total, preguntas y si la respuesta fue correcta, variedad seseo/distinción, duración cuando se pueda calcular.
- Uso de algunas opciones del laboratorio: carga local, grabación detenida, señal sintética, exportación de anotaciones/gráficos. **No se sube el audio ni el nombre del archivo.**
- Fecha/hora de recepción en el servidor.

**No se envían:** nombres, apellidos, correos, textos libres, respuestas escritas completas, audio, transcripciones hechas por los estudiantes, archivos de voz, ni notas privadas. Las redes y proveedores técnicos pueden tratar metadatos necesarios de conexión (p. ej., IP en registros de infraestructura); por tanto **es seguimiento seudónimo, no anonimato absoluto**.

**No registra** tiempo exacto de estudio ni garantiza identidad del estudiante. Se puede suplantar un código; no usar para calificaciones oficiales ni asistencia.

## Límites y recomendaciones

- El alumnado puede usar las funciones sin activar el seguimiento.
- El código se genera por navegador y dispositivo: una persona con dos dispositivos puede aparecer como dos códigos.
- Los eventos enviados sin conexión pueden no recuperarse automáticamente. Las actividades quedan en el historial local del propio estudiante.
- El panel consulta hasta 10 000 eventos recientes por clase; para mucho alumnado o uso sostenido se recomienda paginación del servidor y archivo periódico.
- Los informes son **descriptivos**. Sin un diseño de evaluación apropiado, no se puede afirmar que la herramienta mejora resultados de aprendizaje.
- No almacenes correspondencias `código ↔ nombre` en el repositorio ni en documentos públicos.
- Para un uso real con estudiantes en España, solicita revisión al delegado de protección de datos, coordinación o servicio competente de la UCA sobre base jurídica, transparencia, proveedor y conservación. Más detalles en `PRIVACIDAD.md`.

## Diagnóstico de problemas

| Problema | Solución |
|---|---|
| La web abre pero no aparecen resultados | Configura `config.js`, ejecuta el SQL, crea una clase y activa seguimiento en la web del estudiante |
| Aparece «Código no válido» o fallo al enviar | Verifica que el código pertenece a una clase activa y que no se ha escrito mal |
| No puedo entrar como profesora | Crea/activa el usuario en Supabase Auth y usa exactamente ese correo y contraseña |
| El panel no muestra clases | Comprueba que el SQL y RLS se han ejecutado, y que la clase pertenece a la cuenta que inicia sesión |
| Funciona el HTML local, pero falla el micrófono | El navegador suele exigir HTTPS o localhost; GitHub Pages usa HTTPS |
| No se ve la biblioteca de Supabase | Comprueba conexión, filtros de red y el acceso a cdn.jsdelivr.net |
| El informe parece incompleto | El registro es voluntario, por dispositivo y solo envía sesiones completadas |

## Créditos y propiedad

Autoría académica y supervisión didáctica: Aránzazu Quintana San José. Implementación inicial asistida por IA. Comprueba y revisa las transcripciones, actividades y mediciones antes de usar la aplicación para evaluación formal. Las imágenes de espectrogramas basadas en tu presentación son ejemplos didácticos sintetizados, no muestras de voz grabada.

No se ha aplicado automáticamente una licencia abierta al repositorio: escoge una licencia solo después de comprobar los derechos de todos los materiales que incorpora.
