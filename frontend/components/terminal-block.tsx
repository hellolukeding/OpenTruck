type Props = {
  children: React.ReactNode;
  className?: string;
  showCopy?: boolean;
  showDots?: boolean;
};

export function TerminalBlock({ children, className = "", showCopy = true, showDots = true }: Props) {
  return (
    <div
      className={`bg-[#0E0E0E] rounded-xl p-lg relative group border border-white/5 ${className}`}
    >
      {showCopy && (
        <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
        </button>
      )}
      {showDots && (
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      )}
      <pre className="font-code-md text-code-md text-white/90 overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
