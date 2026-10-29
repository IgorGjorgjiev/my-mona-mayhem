<!-- l10n-sync: source-file="workshop/00-overview.md" -->
# 🎮 Mona Mayhem — Taller de GitHub Copilot

---

> **Duración:** ~1 hora  
> **Nivel:** Intermedio  
> **Stack:** Astro / Node.js / TypeScript

Crea una aplicación retro de estilo arcade para comparar contribuciones de GitHub — **Mona Mayhem** — mientras aprendes toda la variedad de flujos de trabajo de GitHub Copilot. El taller ofrece **dos itinerarios**: uno con VS Code y otro con GitHub Copilot CLI.

---

## 🎯 Elige tu itinerario

- **Itinerario de VS Code** — trabaja desde el editor y practica Chat, Plan Mode, Agent Mode, agentes en segundo plano y el ciclo de revisión integrado.
- **Itinerario de CLI** — trabaja desde el terminal y practica `copilot`, contexto con `@file`, `/plan`, ediciones autónomas, `/fleet`, `/delegate` y `/review`.

Sigue el itinerario que mejor se adapte a tu forma de trabajar.

---

## 📋 Lista rápida de comprobación

Antes de empezar, comprueba lo siguiente:

- [ ] GitHub Copilot está habilitado en tu cuenta
- [ ] Node.js está instalado
- [ ] Git está instalado y configurado
- [ ] Tienes preparados el navegador y el terminal

<!-- track:vscode:start -->
- [ ] VS Code **v1.107+** (sin actualizaciones pendientes)
- [ ] Sesión iniciada en la extensión **GitHub Copilot**
- [ ] Panel de Chat abierto y Agent listo
<!-- track:vscode:end -->

<!-- track:cli:start -->
- [ ] GitHub Copilot CLI está instalado y disponible como `copilot`
- [ ] Has iniciado sesión en la CLI con `/login`
- [ ] Te manejas con comandos slash como `/help`, `/plan` y `/review`
<!-- track:cli:end -->

> 💡 **Consejo:** Usa el DevContainer para disponer de un entorno preconfigurado y empezar rápidamente en VS Code.

---

## 🧠 Qué aprenderás

| # | Competencia | Descripción |
|---|-------------|-------------|
| 1 | **Ingeniería de contexto** | Enseñar a Copilot cómo es tu código base con instrucciones, referencias y restricciones claras |
| 2 | **Planificar primero** | Diseñar la arquitectura antes de implementar |
| 3 | **Implementación agéntica** | Dejar que Copilot realice tareas de programación en varios pasos bajo tu supervisión |
| 4 | **Diseño iterativo** | Usar Copilot para transformar los elementos visuales y refinar los detalles de interacción |
| 5 | **Flujos de trabajo paralelos** | Repartir el trabajo entre agentes, sesiones o tareas delegadas |

<!-- track:vscode:start -->
### Funcionalidades de VS Code

- **Chat + modo Ask** para explorar
- **Plan Mode** para prompts de arquitectura y diseño
- **Agent Mode** para implementar cambios en varios archivos
- **Agentes en segundo plano y en la nube** para pulir en paralelo
<!-- track:vscode:end -->

<!-- track:cli:start -->
### Funcionalidades de Copilot CLI

- **Sesiones interactivas de CLI** con `copilot`
- **`/plan` y Shift+Tab** para planificar de forma estructurada
- **Ediciones autónomas** con aprobaciones en línea y `/diff`
- **`/fleet`, `/delegate` y `/review`** para paralelizar y controlar la calidad
<!-- track:cli:end -->

---

## 📚 Partes del taller

| Parte | Título | Descripción |
|------|-------|-------------|
| [**01**](01-setup.md) | Configuración e ingeniería de contexto | Crea tu repositorio, prepara el entorno y proporciona a Copilot el contexto adecuado |
| [**02**](02-plan-and-scaffold.md) | Planificación y estructura inicial | Diseña la API y la arquitectura de páginas antes de implementarlas |
| [**03**](03-agent-mode.md) | Construcción del juego | Conecta la página de batalla y los gráficos de contribuciones con ayuda agéntica |
| [**04**](04-design-vibes.md) | Diseño visual primero | Convierte la estructura inicial en una experiencia de arcade retro |
| [**05**](05-polish.md) | Pulido y trabajo paralelo | Mejora la UX, la resiliencia y la calidad con flujos multiagente |
| [**06**](06-bonus.md) | Extras y ampliaciones | Explora funcionalidades abiertas, formas de compartir y experimentos adicionales |

---

## 💡 Consejos profesionales

1. **Deja el navegador abierto** — observa las actualizaciones en directo mientras programas.
2. **Haz commits con frecuencia** — guarda puntos de control limpios mientras iteras.
3. **Perfecciona el plan antes de implementar** — los mejores planes producen mejores resultados.
4. **Revisa los cambios de Copilot** — usa la vista de diferencias o las herramientas de revisión de la CLI en lugar de aceptarlos a ciegas.

<!-- track:vscode:start -->
5. **Usa puntos de control y Deshacer** en el chat si una iteración se desvía.
<!-- track:vscode:end -->

<!-- track:cli:start -->
5. **Usa `/session`, `/context` y `/share file`** para inspeccionar o guardar tu trabajo.
<!-- track:cli:end -->
