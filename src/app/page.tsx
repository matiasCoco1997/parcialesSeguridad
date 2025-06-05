"use client";
import Preguntas from "@/components/Preguntas";
import PreguntasSegundo from "@/components/PreguntasSegundo";
import { useState } from "react";

export default function Home() {
  const [parcialActivo, setParcialActivo] = useState<number>(1);

  return (
    <>
      <div className="flex items-center justify-between p-5 ">
        {parcialActivo === 1 ? (
          <h1 className="text-white">Parcial 1</h1>
        ) : (
          <h1 className="text-white">Parcial 2</h1>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setParcialActivo(1);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              parcialActivo === 1 ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            Parcial 1
          </button>
          <button
            onClick={() => {
              setParcialActivo(2);
            }}
            className={`p-3 rounded-lg cursor-pointer ${
              parcialActivo === 2 ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            Parcial 2
          </button>
        </div>
      </div>
      {parcialActivo === 1 ? <Preguntas /> : <PreguntasSegundo />}
    </>
  );
}
