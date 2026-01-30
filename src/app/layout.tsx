export const metadata = {
  title: 'Officeworks - Office & School Stationery',
  description: 'Sri Lanka\'s largest importer, manufacturer and direct supplier of quality office and school stationery. Lowest price just a beginning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {children}
      </body>
    </html>
  );
} 