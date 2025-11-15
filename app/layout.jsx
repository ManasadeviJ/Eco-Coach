export const metadata = {
  title: "Eco Coach",
  description: "AI-powered eco habit builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
