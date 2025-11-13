import Image from "next/image";

export const AppHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 overflow-hidden">
          <Image src="/ideashell.png" width={48} height={48} alt="ideaShell" className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-base font-bold text-stone-900">ideaShell</div>
          <div className="justify-center">
            <span className="text-zinc-500 text-sm font-bold">#1</span>
            <span className="text-zinc-500 text-sm font-normal">, </span>
            <span className="text-zinc-500 text-sm font-bold">10,000+ 5-Star reviews</span>
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 h-8 bg-[#ff4d23] rounded-full">
        <span className="text-white text-xs font-bold">Get App</span>
      </button>
    </div>
  );
};
