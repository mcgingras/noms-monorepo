const PrimaryLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <main className="h-screen max-w-screen-2xl mx-auto p-8">{children}</main>
  );
};

export default PrimaryLayout;
