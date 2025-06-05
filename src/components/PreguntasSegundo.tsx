"use client";
import { useEffect, useState, useCallback } from "react";

type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuesta_correcta: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PreguntasSegundo() {
  const [preguntasOriginales, setPreguntasOriginales] = useState<Pregunta[]>(
    []
  );
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{
    [key: number]: string;
  }>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [mostrarCorrectas, setMostrarCorrectas] = useState<{
    [key: number]: boolean;
  }>({});

  const cargarPreguntas = useCallback(async () => {
    try {
      const response = await fetch("/data/preguntas_segundo.json");
      const data: Pregunta[] = await response.json();
      setPreguntasOriginales(data);

      const preguntasDesordenadas = shuffleArray(data).map((pregunta) => ({
        ...pregunta,
        opciones: shuffleArray(pregunta.opciones),
      }));

      setPreguntas(preguntasDesordenadas);
    } catch (error) {
      console.error("Error cargando preguntas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPreguntas();
  }, [cargarPreguntas]);

  const handleSeleccionRespuesta = useCallback(
    (preguntaIndex: number, opcion: string) => {
      setRespuestasSeleccionadas((prev) => ({
        ...prev,
        [preguntaIndex]: opcion,
      }));
    },
    []
  );

  const calcularPuntaje = useCallback(() => {
    return preguntas.reduce((puntaje, pregunta, index) => {
      return respuestasSeleccionadas[index] === pregunta.respuesta_correcta
        ? puntaje + 1
        : puntaje;
    }, 0);
  }, [preguntas, respuestasSeleccionadas]);

  const reiniciarCuestionario = useCallback(() => {
    const preguntasDesordenadas = shuffleArray(preguntasOriginales).map(
      (pregunta) => ({
        ...pregunta,
        opciones: shuffleArray(pregunta.opciones),
      })
    );
    setPreguntas(preguntasDesordenadas);
    setRespuestasSeleccionadas({});
    setMostrarResultados(false);
    setMostrarCorrectas({});
  }, [preguntasOriginales]);

  if (loading) return <div className="text-center p-8">Cargando...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!mostrarResultados ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">Cuestionario</h1>
          {preguntas.map((pregunta, index) => (
            <div
              key={`pregunta-${index}`}
              className="mb-8 p-4 border rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold mb-3">
                {index + 1}. {pregunta.pregunta}
              </h3>
              <div className="space-y-2">
                {pregunta.opciones.map((opcion, i) => (
                  <div
                    key={`opcion-${index}-${i}`}
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      id={`p${index}-o${i}`}
                      name={`pregunta-${index}`}
                      checked={respuestasSeleccionadas[index] === opcion}
                      onChange={() => handleSeleccionRespuesta(index, opcion)}
                      className="mr-2 cursor-pointer h-4 w-4"
                    />
                    <label
                      htmlFor={`p${index}-o${i}`}
                      className="cursor-pointer"
                    >
                      {opcion}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-end">
                <button
                  onClick={() =>
                    setMostrarCorrectas((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  {mostrarCorrectas[index]
                    ? "Ocultar respuesta"
                    : "Mostrar respuesta correcta"}
                </button>
                {mostrarCorrectas[index] && (
                  <div className="mt-2 text-green-700 font-semibold">
                    Respuesta correcta: {pregunta.respuesta_correcta}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="text-center">
            <button
              onClick={() => setMostrarResultados(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                Object.keys(respuestasSeleccionadas).length !== preguntas.length
              }
            >
              Ver resultados
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Resultados</h2>
          <p className="mb-6 text-center text-lg">
            Puntaje: <span className="font-bold">{calcularPuntaje()}</span> de{" "}
            {preguntas.length}
          </p>

          {preguntas.map((pregunta, index) => (
            <div
              key={`resultado-${index}`}
              className={`mb-6 p-4 rounded-lg text-black ${
                respuestasSeleccionadas[index] === pregunta.respuesta_correcta
                  ? "bg-green-300 border border-green-300"
                  : "bg-red-300 border border-red-300"
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">
                {pregunta.pregunta}
              </h3>
              <p className="mb-1">
                <span className="font-medium">Tu respuesta:</span>{" "}
                <span
                  className={
                    respuestasSeleccionadas[index] ===
                    pregunta.respuesta_correcta
                      ? "text-green-700 font-bold"
                      : "text-red-700 font-bold"
                  }
                >
                  {respuestasSeleccionadas[index] || "No respondida"}
                </span>
              </p>
              <p>
                <span className="font-medium">Respuesta correcta:</span>{" "}
                <span className="text-green-700 font-bold">
                  {pregunta.respuesta_correcta}
                </span>
              </p>
            </div>
          ))}

          <div className="text-center mt-8">
            <button
              onClick={reiniciarCuestionario}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
