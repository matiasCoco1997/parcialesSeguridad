import Preguntas from "@/components/Preguntas";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-between p-5 ">
        <h1 className="text-white">Parcial 1</h1>

        <Link
          href="segundo-parcial"
          className="p-3 bg-blue rounded-lg bg-blue-500"
        >
          Parcial 2
        </Link>
      </div>

      <Preguntas />
    </>
  );
}
