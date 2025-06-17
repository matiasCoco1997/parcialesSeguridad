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
  const [respuestasVerificadas, setRespuestasVerificadas] = useState<{
    [key: number]: boolean;
  }>({});
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

      // Marcar la respuesta como verificada inmediatamente
      setRespuestasVerificadas((prev) => ({
        ...prev,
        [preguntaIndex]: true,
      }));
    },
    []
  );

  const reiniciarCuestionario = useCallback(() => {
    const preguntasDesordenadas = shuffleArray(preguntasOriginales).map(
      (pregunta) => ({
        ...pregunta,
        opciones: shuffleArray(pregunta.opciones),
      })
    );
    setPreguntas(preguntasDesordenadas);
    setRespuestasSeleccionadas({});
    setRespuestasVerificadas({});
    setMostrarCorrectas({});
  }, [preguntasOriginales]);

  if (loading) return <div className="text-center p-8">Cargando...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Cuestionario</h1>
      {preguntas.map((pregunta, index) => {
        const respuestaSeleccionada = respuestasSeleccionadas[index];
        const esCorrecta =
          respuestaSeleccionada === pregunta.respuesta_correcta;
        const estaVerificada = respuestasVerificadas[index];

        return (
          <div
            key={`pregunta-${index}`}
            className="mb-8 p-4 border rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold mb-3">
              {index + 1}. {pregunta.pregunta}
            </h3>
            <div className="space-y-2">
              {pregunta.opciones.map((opcion, i) => {
                let estilo = "";

                if (respuestaSeleccionada === opcion && estaVerificada) {
                  estilo = esCorrecta
                    ? "text-green-700 font-bold"
                    : "text-red-700 font-bold";
                }

                return (
                  <div
                    key={`opcion-${index}-${i}`}
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      id={`p${index}-o${i}`}
                      name={`pregunta-${index}`}
                      checked={respuestaSeleccionada === opcion}
                      onChange={() => handleSeleccionRespuesta(index, opcion)}
                      className="mr-2 cursor-pointer h-4 w-4"
                    />
                    <label
                      htmlFor={`p${index}-o${i}`}
                      className={`cursor-pointer ${estilo}`}
                    >
                      {opcion}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Mensaje de retroalimentación inmediata */}
            {estaVerificada && (
              <div
                className={`mt-3 font-semibold ${
                  esCorrecta ? "text-green-700" : "text-red-700"
                }`}
              >
                {esCorrecta
                  ? "✓ Respuesta correcta!"
                  : "✗ Respuesta incorrecta"}
              </div>
            )}

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
        );
      })}

      <div className="text-center mt-8">
        <button
          onClick={reiniciarCuestionario}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Reiniciar cuestionario
        </button>
      </div>
    </div>
  );
}
