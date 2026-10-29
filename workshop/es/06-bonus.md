<!-- l10n-sync: source-file="workshop/06-bonus.md" -->
# 🎉 Extras y ampliaciones

---

¡Has creado una aplicación de batallas de GitHub totalmente funcional! Ahora puedes ir más allá con estos **desafíos abiertos**.

<!-- track:vscode:start -->
Usa **Agent Mode** para todos los desafíos: describe lo que quieres y deja que Copilot te ayude a crearlo.
<!-- track:vscode:end -->

<!-- track:cli:start -->
Usa Copilot CLI para todos los desafíos: combina el contexto de `@file`, `/plan`, el modo normal y `/review` según lo necesites.
<!-- track:cli:end -->

---

## 🏆 Desafío 1: Anuncio del ganador

Cuando se hayan cargado los dos gráficos de contribuciones, compara los totales y muestra un anuncio dinámico del ganador.

**Qué crear:**
- Compara las contribuciones totales de ambos usuarios.
- Si hay un ganador claro, muestra **«🏆 ¡{username} GANA! 🏆»** con un estilo festivo.
- Si las contribuciones son iguales, muestra **«🤝 ¡EMPATE! 🤝»**.
- Añade animaciones o confeti para darle más vistosidad.

**Sugerencia de prompt:**
> Cuando se carguen los datos de contribuciones de ambos usuarios, compara los totales y muestra un anuncio del ganador. Muestra «🏆 ¡{username} GANA! 🏆» si un usuario tiene más contribuciones, o «🤝 ¡EMPATE! 🤝» si tienen la misma cantidad. Dale un aspecto emocionante con animaciones CSS.

---

## 🏆 Desafío 2: Contador de rachas

Calcula y muestra la racha de contribuciones consecutivas más larga de cada usuario.

**Qué crear:**
- Analiza los datos de contribuciones día a día.
- Encuentra la secuencia más larga de días consecutivos con al menos una contribución.
- Muestra de forma destacada la duración de la racha de cada usuario.
- Destaca quién tiene la racha más larga.

**Sugerencia de prompt:**
> Añade un contador de rachas que analice los datos de contribuciones de cada usuario y encuentre su mayor racha de contribuciones consecutivas. Muestra «🔥 Racha más larga: X días» debajo del gráfico de contribuciones de cada usuario.

---

## 🏆 Desafío 3: Historial de batallas

Guarda los resultados de las batallas para que los usuarios puedan ver sus enfrentamientos anteriores.

**Qué crear:**
- Guarda cada resultado en `localStorage` (nombres de usuario, totales, ganador y fecha y hora).
- Añade una sección **«Batallas recientes»** debajo del área de batalla principal.
- Muestra las últimas 5–10 batallas con sus resultados.
- Añade un botón «Borrar historial».

**Sugerencia de prompt:**
> Guarda los resultados de cada batalla en localStorage después de cada comparación. Añade una sección «Batallas recientes» que muestre las últimas 10 batallas, con los nombres de usuario, el total de contribuciones, el ganador y la fecha y hora. Incluye un botón «Borrar historial».

---

## 🏆 Desafío 4: Efectos de sonido

Añade efectos de sonido de arcade retro con la Web Audio API, sin necesidad de archivos externos.

**Qué crear:**
- Un sonido de **moneda insertada** al hacer clic en el botón «¡Battle!».
- Un sonido de **potenciación** cuando los resultados se carguen correctamente.
- Un sonido de **explosión** cuando haya un error (usuario no encontrado o fallo de la API).
- Un botón para silenciar y activar el sonido.

**Sugerencia de prompt:**
> Añade efectos de sonido de arcade retro con la Web Audio API, sin usar archivos de audio. Reproduce el sonido de una moneda al iniciar una batalla, un sonido de potenciación cuando se carguen los resultados y un sonido de explosión si hay un error. Genera los sonidos mediante osciladores y nodos de ganancia. Incluye un botón para silenciar el sonido.

---

## 🏆 Desafío 5: Secuencia de batalla animada

Crea expectación con una cuenta atrás dramática antes de mostrar los resultados.

**Qué crear:**
- Al hacer clic en «¡Battle!», muestra una superposición a pantalla completa.
- Anima la secuencia: **«3...» → «2...» → «1...» → «⚡ ¡A LUCHAR! ⚡»**.
- Después, muestra los gráficos de contribuciones con una entrada espectacular.
- Usa animaciones CSS o temporizadores de JavaScript.

**Sugerencia de prompt:**
> Añade una secuencia de batalla animada cuando el usuario haga clic en «¡Battle!». Muestra una cuenta atrás superpuesta: «3...», «2...», «1...» y «⚡ ¡A LUCHAR! ⚡», con una duración aproximada de 1 segundo para cada paso. Después de la cuenta atrás, muestra los resultados con una animación de entrada lateral.

---

## 🏆 Desafío 6: Leyenda de contribuciones

Añade una leyenda de escala de colores que coincida con la paleta del gráfico de contribuciones.

**Qué crear:**
- Una leyenda horizontal con los niveles de intensidad de las contribuciones.
- Etiquetas desde **«Menos»** hasta **«Más»**.
- Usa la paleta de colores de la respuesta de la API de contribuciones de GitHub.
- Coloca la leyenda cerca de los gráficos de contribuciones.

**Sugerencia de prompt:**
> Añade debajo de los gráficos una leyenda de contribuciones que muestre la escala de colores de la API. Muestra una fila de cuadros de colores, desde «Menos» (el tono más claro) hasta «Más» (el más oscuro), que coincidan con los niveles de color devueltos por la API.

---

## 🏆 Desafío 7: Compartir resultados

Permite que los usuarios compartan los resultados de sus batallas con un solo clic.

**Qué crear:**
- Un botón **«📋 Compartir resultados»** que aparezca después de una batalla.
- Copia en el portapapeles un resumen de texto con formato.
- Incluye los nombres de usuario, sus totales de contribuciones y el ganador.
- Muestra brevemente una confirmación como «¡Copiado!».

**Sugerencia de prompt:**
> Añade un botón «📋 Compartir resultados» que copie al portapapeles un resumen de la batalla con formato. El resumen debe incluir los dos nombres de usuario, sus totales de contribuciones y el ganador. Usa Clipboard API y muestra brevemente el mensaje «¡Copiado al portapapeles!».

---

<!-- track:cli:start -->
## 💻 Extras de CLI

Si quieres explorar más funcionalidades de Copilot CLI después del taller principal:

- Usa `copilot -p "Write a conventional commit message for the current git diff"` para generar una respuesta única que puedas copiar en Git.
- Ejecuta `/share file` para guardar tu sesión como Markdown y consultarla más adelante.
- Usa `/session` y `/session plan` para inspeccionar cómo está registrando la CLI tu trabajo actual.
<!-- track:cli:end -->

## 🎊 ¡Enhorabuena!

Has completado el taller **Mona Mayhem: GitHub Battle**. Esto es lo que has conseguido:

### Lo que has creado

- ✅ Una **aplicación web completa con varias páginas** a partir de una especificación de diseño
- ✅ Una **página de inicio** con temática de arcade retro y diseño adaptable
- ✅ Una **arena de batalla** que obtiene y compara datos reales de contribuciones de GitHub
- ✅ **Gráficos de contribuciones interactivos** con niveles de actividad diferenciados por colores
- ✅ **Manejo de errores, estados de carga y mejoras de accesibilidad**
- ✅ **Diseño adaptable** para distintos dispositivos

### Lo que has practicado

| Competencia | Qué has practicado |
|---|---|
| **Ingeniería de contexto** | Proporcionar a Copilot los archivos, las instrucciones y las restricciones adecuadas |
| **Planificación** | Generar y perfeccionar planes de implementación antes de programar |
| **Programación agéntica** | Delegar a Copilot trabajo de varios pasos en distintos archivos |
| **Iteración de diseño** | Partir de una dirección visual y perfeccionarla hasta obtener un resultado pulido |
| **Disciplina de revisión** | Inspeccionar los cambios generados por IA antes de hacer commit |

### 🚀 Sigue aprendiendo

- 📺 [Canal de YouTube de VS Code](https://www.youtube.com/@code) — Consejos, tutoriales y novedades
- 📖 [Documentación de GitHub Copilot](https://docs.github.com/en/copilot) — Documentación y guías oficiales
- 💻 [Documentación de GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli) — Instalación, comandos slash y prácticas recomendadas
- 🌟 [Awesome GitHub Copilot](https://github.com/stefanprodan/awesome-github-copilot) — Recursos y ejemplos de la comunidad
- 🛠️ [Talleres de Copilot Dev Days](https://github.com/github/copilot-dev-days) — Más talleres prácticos

---

## 🙏 ¡Gracias!

¡Gracias por participar en este taller! Has comprobado cómo GitHub Copilot puede acelerar todas las fases del desarrollo, desde la planificación y el diseño hasta la implementación y el pulido. Las técnicas que has practicado aquí sirven para cualquier proyecto, framework y escala. ¡Ahora ve y crea algo increíble! 🚀
