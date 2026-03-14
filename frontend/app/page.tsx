export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Projeto Brasa</h1>
      <p>O front-end está conectado em: {process.env.NEXT_PUBLIC_API_URL}</p>
    </main>
  );
}