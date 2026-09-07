import { MessageCircle, ArrowUpRight } from "lucide-react";
import { type Product, whatsappOrderUrl } from "@/lib/products";

export default function WhatsAppButton({ product }: { product: Product }) {
  return (
    <a
      href={whatsappOrderUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center justify-between gap-4 border border-bronze bg-obsidian px-6 py-4 text-left transition-colors duration-300 hover:bg-bronze sm:w-auto"
    >
      <span className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-whatsapp/40 text-whatsapp transition-colors group-hover:border-obsidian/30 group-hover:text-obsidian">
          <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-bone transition-colors group-hover:text-obsidian">
            Danışmana Sipariş Ver
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40 transition-colors group-hover:text-obsidian/60">
            Kişiye Özel Atölye Danışmanlığı
          </span>
        </span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-bronze transition-colors group-hover:text-obsidian"
        strokeWidth={2}
      />
    </a>
  );
}
