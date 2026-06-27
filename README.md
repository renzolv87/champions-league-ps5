# Champions League PS5

App web para organizar una Champions entre amigos en PS5, con estado compartido en Supabase, sistema antitrampas y economía inspirada en premios UEFA.

## Resumen rapido

- Torneo por temporadas.
- Fase de liguilla todos contra todos (ida y vuelta).
- Clasificacion automatica a eliminatorias.
- Sorteo animado de cruces en eliminatorias (revela emparejamientos cada 10s).
- Eliminatorias a ida y vuelta.
- Final a partido unico.
- Historial y museo con ranking historico.

## Modo antitrampas

- Un resultado no queda confirmado al primer reporte.
- El partido pasa a estado pendiente.
- El rival usa botones directos:
	- Aceptar: confirma el resultado propuesto.
	- Rechazar: invalida el reporte.
- Si se rechaza, el mismo jugador que reporto primero debe volver a cargar el resultado.
- El reportero inicial no puede auto-confirmar.

## Economia del juego

Cada jugador acumula dinero por rendimiento:

- Participacion en la temporada.
- Victoria o empate en liguilla.
- Clasificacion a rondas (octavos/cuartos/semis segun tamano del cuadro).
- Subcampeon y campeon.

Los importes estan basados en referencias de la Champions moderna (2024/25 aprox.) y se ven en la pestaña de configuracion.

## Desempates de liguilla

- Si hay empate en la linea de clasificacion, el sistema genera cruces aleatorios de tanda de penaltis entre los empatados.
- Se juegan rondas sucesivas hasta que quede un unico ganador.
- Si hay numero impar, un jugador descansa en esa ronda.
- Caso especial: si hay 3 jugadores y todos los partidos de liguilla terminan en empate, la temporada se considera invalida y debe reiniciarse.

## Apuestas en eliminatorias

- Solo pueden apostar jugadores que no clasificaron a eliminatorias.
- Solo se apuesta en fase de eliminatorias.
- Tipo de apuesta: 1X2 (gana local, empate, gana visitante), sin indicar goles.
- Si el partido termina en empate y no elegiste empate, se pierde la apuesta.
- Limites:
	- Tope por apuesta: 30% del saldo actual del apostador.
	- Tope total por apuestas para no clasificados: nunca superar lo que puede ganar un campeon y tampoco superar el umbral de dinero de los clasificados.

## Persistencia compartida (Supabase)

La app guarda y lee el estado compartido desde Supabase (REST / PostgREST):

- Project URL (frontend): https://ymuljjodvdkdlvbozqoz.supabase.co
- Tabla usada por el frontend: `tournament_state`
- Fila compartida: `id='shared'`

Esto permite que todos los jugadores vean los mismos datos desde distintos dispositivos.

Estructura recomendada en Supabase:

- Tabla `tournament_state` con columnas:
	- `id` text primary key
	- `state` jsonb not null
	- `version` int not null default 1
	- `updated_at` timestamptz not null default now()

Nota: el frontend usa control de concurrencia optimista con `version` para evitar sobreescrituras cuando varios dispositivos guardan a la vez.

## Reseteo maestro

Existe un reset maestro protegido por contraseña doble:

- Pone contadores a 0.
- Elimina todos los jugadores.
- Limpia historial.
- Reinicia temporada y competicion.
- Deja la aplicacion en estado inicial total.

Comportamiento actual de contraseña maestra:

- Ya no hay contraseña hardcodeada en el repositorio.
- La primera vez que se usa el reset en un dispositivo, se crea una contraseña local (almacenada en ese navegador/dispositivo).
- En usos posteriores, ese mismo dispositivo debe introducir su contraseña local para confirmar el reset.
- Importante: esa contraseña no se comparte entre dispositivos.

## Museo y ranking

- Se acumulan copas historicas por temporada.
- Se acumula dinero historico total (de por vida).
- Orden del ranking en Museo:
	1. Mas copas.
	2. Mas dinero historico total.
	3. Mejor diferencia de goles (GF-GC).

## Reglas adicionales

- No se permiten jugadores duplicados (comparacion sin distinguir mayusculas/minusculas).

## Estructura minima

- champions-league-ps5.html
- package.json

## Despliegue rapido

1. Subir este proyecto a GitHub.
2. Publicar frontend estatico donde prefieras (GitHub Pages, Netlify, Vercel, etc.).
3. Configurar la tabla en Supabase.
4. Abrir la app en /champions-league-ps5.html (o renombrar a index.html para abrir en raiz).

## Nota importante de seguridad

No se deben subir secretos reales (tokens, claves privadas, contraseñas maestras fijas) al repositorio.

Para seguridad fuerte en multi-dispositivo:

- Mover la validación del reset maestro al backend.
- Guardar secretos en variables de entorno del proveedor, no en el HTML.
