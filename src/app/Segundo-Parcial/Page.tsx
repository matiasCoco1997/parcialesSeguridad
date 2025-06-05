import PreguntasSegundo from "@/components/PreguntasSegundo";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-between p-5 ">
        <h1 className="text-white">Parcial 2</h1>

        <Link href="/" className="p-3 bg-blue rounded-lg bg-blue-500">
          Parcial 1
        </Link>
      </div>

      <PreguntasSegundo />
    </>
  );
}
