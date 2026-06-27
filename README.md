# Champions League PS5

App web para organizar una Champions entre amigos en PS5, con estado compartido en Netlify, sistema antitrampas y economía inspirada en premios UEFA.

## Resumen rapido

- Torneo por temporadas.
- Fase de liguilla todos contra todos (ida y vuelta).
- Clasificacion automatica a eliminatorias.
- Sorteo animado de cruces en eliminatorias (revela emparejamientos cada 10s).
- Eliminatorias a ida y vuelta.
- Final a partido unico.
- Historial y museo de campeones.

## Modo antitrampas

- Un resultado no queda confirmado al primer reporte.
- El partido pasa a estado pendiente.
- El rival debe reportar exactamente el mismo resultado para confirmarlo.
- Si ambos reportan distinto, queda en disputa y lo resuelve el organizador.

## Economia del juego

Cada jugador acumula dinero por rendimiento:

- Participacion en la temporada.
- Victoria o empate en liguilla.
- Clasificacion a rondas (octavos/cuartos/semis segun tamano del cuadro).
- Subcampeon y campeon.

Los importes estan basados en referencias de la Champions moderna (2024/25 aprox.) y se ven en la pestaña de configuracion.

## Persistencia compartida (Netlify)

La app guarda y lee el estado compartido desde una Netlify Function usando Netlify Blobs:

- Endpoint: /.netlify/functions/tournament-state
- Funcion: netlify/functions/tournament-state.js

Esto permite que todos los jugadores vean los mismos datos desde distintos dispositivos.

## Reseteo maestro

Existe un reset maestro protegido por contraseña doble:

- Pone contadores a 0.
- Limpia historial.
- Reinicia temporada y competicion.
- Conserva la lista de jugadores.

## Estructura minima

- champions-league-ps5.html
- netlify/functions/tournament-state.js
- netlify.toml
- package.json

## Despliegue rapido

1. Subir este proyecto a GitHub.
2. Importar repo en Netlify.
3. Publicar.
4. Abrir la app en /champions-league-ps5.html (o renombrar a index.html para abrir en raiz).

## Nota importante de seguridad

Si la contraseña maestra esta en frontend, alguien tecnico podria verla inspeccionando codigo.
Para seguridad real, mover validacion al backend (Netlify Function) y usar variable de entorno.
