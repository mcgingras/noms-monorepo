const PrimaryLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <main className="h-screen bg-[url('/grid.svg')]">
      <div className="max-w-screen-2xl mx-auto p-8">{children}</div>
    </main>
  );
};

export default PrimaryLayout;
