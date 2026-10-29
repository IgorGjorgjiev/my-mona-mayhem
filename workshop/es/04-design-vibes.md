<!-- l10n-sync: source-file="workshop/04-design-vibes.md" -->
# Parte 4: Tematización orientada al diseño

---

En esta parte, usarás los ciclos de planificación e implementación de Copilot para diseñar una transformación completa del tema. Este es un enfoque de desarrollo orientado al diseño: empieza con una visión, itera sobre los elementos visuales y deja que Copilot se encargue del trabajo pesado de CSS.

## Tarea 1: Planifica el tema retro

<!-- track:vscode:start -->
Cambia al modo **Plan** en GitHub Copilot Chat.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Usa `/plan` en GitHub Copilot CLI o pulsa **Shift+Tab** hasta activar el modo plan.
<!-- track:cli:end -->

Introduce este prompt:

> Quiero transformar esta página en una experiencia completa de arcade retro. Planifica una renovación visual que incluya: efectos de líneas de barrido CRT en el fondo, un brillo de neón pulsante en el título, una insignia VS animada con cambios de degradado, una capa brillante y reluciente en las tarjetas de resultados de usuarios, animaciones de entrada flotante para los campos de entrada, texto de carga que cambie entre verde y morado, y efectos de brillo al pasar el cursor sobre los cuadros de contribuciones. Mantén el fondo oscuro (`#0a0a1a`) y usa el verde (`#5fed83`) y el morado (`#8a2be2`) como colores de acento. Aplica un tema oscuro con la fuente retro Press Start 2P de Google Fonts.

Copilot generará un plan detallado de implementación que abarque todos los efectos visuales. **No lo aceptes de inmediato**: revisa el plan e itera:

- Sugiere ajustes en la duración de las animaciones (por ejemplo, «Haz que el pulso de neón sea más lento, de unos 3 segundos»).
- Pregunta por efectos concretos (por ejemplo, «¿Cómo funcionará la capa brillante de las tarjetas?»).
- Pide cambios en el enfoque si algo no te convence.

## Tarea 2: Implementa el tema

Cuando estés satisfecho con el plan, pide a Copilot que lo implemente.

> Implementa el plan del tema retro arcade que acabamos de diseñar.

Copilot añadirá varias animaciones CSS, pseudoelementos y transiciones a la hoja de estilos. Puede incluir:

- `@keyframes` para líneas de barrido, pulsos de neón, destellos y efectos de entrada flotante
- Pseudoelementos (`::before`, `::after`) para crear efectos de superposición
- Propiedades personalizadas de CSS para los colores del tema
- Transiciones y estados `hover` para elementos interactivos

<!-- track:cli:start -->
Cuando terminen los cambios, usa `/diff` para revisarlos antes de aprobarlos.
<!-- track:cli:end -->

## Tarea 3: Ajusta el estilo

> **⚠️ ¿No ves los cambios?** Si el tema o las animaciones nuevas no aparecen, detén el servidor de desarrollo (`Ctrl+C`), reinícialo con `npm run dev` y fuerza la recarga del navegador (`Ctrl+Shift+R`).

Mantén abierta la vista previa del navegador e itera sobre el diseño. Prueba prompts como:

> El efecto de líneas de barrido es demasiado intenso; reduce la opacidad a 0.03.

> Añade un ligero parpadeo eléctrico al texto del título.

> Haz que la insignia VS pulse con más intensidad.

Esto es **desarrollo orientado al diseño**: iteras en tiempo real sobre el resultado visual. Cada prompt perfecciona la experiencia hasta que te convenza. No te conformes con algo «suficientemente bueno»: sigue puliendo el estilo hasta que la página parezca de una máquina recreativa.

## Tarea 4: Actualiza las instrucciones

Tus instrucciones deben reflejar las decisiones de diseño importantes para que los prompts posteriores mantengan el rumbo.

<!-- track:vscode:start -->
Pide a Copilot Chat:

> Añade a `copilot-instructions.md` una sección de guía de diseño que describa el tema de arcade retro: colores, fuentes y estilo de animación.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Pide a Copilot CLI:

> Actualiza las instrucciones del repositorio con una guía breve del tema de arcade retro: colores, fuentes, estilo de animación y la regla de que la nueva interfaz mantenga la estética de neón.
<!-- track:cli:end -->

Cuando la página tenga el aspecto esperado, haz commit de las instrucciones y los cambios de diseño.

## ✅ Parte 4 completada

**Lo que has aprendido:**

- Usar flujos de planificación para diseñar un **sistema visual antes de implementarlo**
- **Iterar sobre el resultado visual** con prompts de seguimiento breves
- **Actualizar las instrucciones tras tomar decisiones importantes** para mantener la identidad visual
