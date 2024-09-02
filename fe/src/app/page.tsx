import Image from "next/image";

export default function Home() {
  return (
  
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
    
      <Image
        src="/path/to/image.jpg"
        alt="Description"
        width={500}
        height={300}
      />
    </main>
  );
}
