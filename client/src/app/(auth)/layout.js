import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <main className={`antialiased`}>
      {children}
    </main>
  );
}
