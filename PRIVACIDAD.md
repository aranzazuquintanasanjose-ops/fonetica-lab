# Información de privacidad y protección de datos — borrador para revisión

**No publiques datos personales del alumnado en GitHub.** Este texto es una propuesta informativa y técnica, no sustituye a la política de privacidad de la Universidad de Cádiz ni al asesoramiento de su Delegado de Protección de Datos (DPD).

## Tipo de información enviada

- Código del grupo (8 caracteres) y código seudónimo del navegador (`ALU-...`).
- Fecha y hora en que el servidor recibe cada evento.
- Secciones abiertas, opciones del laboratorio utilizadas y ejercicios terminados.
- Módulo, puntuación, total y éxito/error de cada pregunta. Nunca se envía el texto escrito por el alumnado ni el contenido de los audios.

El código puede permitir singularizar o vincular registros. No se debe afirmar que estos datos son anónimos. Los proveedores externos pueden procesar información técnica adicional para operar la conexión.

## Finalidad y acceso

Finalidad propuesta: describir el uso educativo de FONÉTICA-LAB para orientar mejoras docentes. Solo la cuenta docente autenticada propietaria del grupo puede consultar sus datos, por las políticas de seguridad a nivel de fila (RLS). Las personas no autenticadas pueden enviar eventos a grupos activos con código, pero no consultar los registros. El profesor puede desactivar grupos y borrar sus registros.

## Antes de usar con alumnado real

1. Consultar a la universidad sobre responsable del tratamiento, base jurídica adecuada, encargado del tratamiento, contrato y localización del alojamiento; no asumir que una casilla de consentimiento resuelve por sí sola el cumplimiento del RGPD.
2. Informar claramente al alumnado de qué se recoge, por qué, durante cuánto tiempo y cómo ejercer sus derechos. El uso del material formativo debe poder realizarse sin activar el seguimiento, salvo que la UCA establezca otro procedimiento legítimo.
3. Acordar un plazo de conservación limitado (ej. final del semestre más periodo necesario para la memoria), establecer proceso de borrado y custodiar con seguridad cualquier correspondencia con estudiantes identificables.
4. No usar resultados seudónimos y autodeclarados como sistema oficial de evaluación, calificación o asistencia.
5. Valorar minimización y medidas frente a envíos falsificados: cualquier persona con el código de clase puede intentar enviar eventos ficticios. Si se requiere evidencia individual verificable, hay que integrar autenticación institucional o una plataforma aprobada por la UCA.

## Qué hace el software

- No realiza seguimiento remoto por defecto. El estudiante debe activar la casilla y facilitar el código de clase.
- Se puede desactivar desde la misma web. El borrado de información ya recibida corresponde a la responsable del grupo, desde su panel.
- No utiliza cookies publicitarias ni analítica comercial. Supabase Auth sí puede guardar una sesión técnica para la cuenta de docente.
- La herramienta acústica procesa archivos y micrófono localmente; las señales no se transmiten al servidor del seguimiento.
