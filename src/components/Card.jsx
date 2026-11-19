export default function Card({ title, subtitle, children, accent = "accent" }) {
  return (
    <div className="glass rounded-xl p-5 relative overflow-hidden brackets">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[12px] font-black text-accent tracking-[0.1em] uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent glow-accent" /> {title}
        </h3>
        {subtitle && <span className="text-[10px] text-slate-500 font-mono">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}