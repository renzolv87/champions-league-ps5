# Champions League PS5

App web para organizar una Champions entre amigos en PS5, con estado compartido en Netlify, sistema antitrampas y economía inspirada en premios UEFA.

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

## Persistencia compartida (Netlify)

La app guarda y lee el estado compartido desde una Netlify Function usando Netlify Blobs:

- Endpoint: /.netlify/functions/tournament-state
- Funcion: netlify/functions/tournament-state.js

Esto permite que todos los jugadores vean los mismos datos desde distintos dispositivos.

## Reseteo maestro

Existe un reset maestro protegido por contraseña doble:

- Pone contadores a 0.
- Elimina todos los jugadores.
- Limpia historial.
- Reinicia temporada y competicion.
- Deja la aplicacion en estado inicial total.

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
