const NomBuilderCanvas = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row relative h-full">
      {children}
    </div>
  );
};

export default NomBuilderCanvas;
