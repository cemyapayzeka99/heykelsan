import { MessageCircle } from "lucide-react";
import { type Product, whatsappOrderUrl } from "@/lib/products";

export default function WhatsAppButton({ product }: { product: Product }) {
  return (
    <a
      href={whatsappOrderUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 py-4 text-base font-semibold text-white shadow-lg shadow-whatsapp/25 transition-all hover:-translate-y-0.5 hover:bg-whatsapp-dark hover:shadow-xl hover:shadow-whatsapp/30 sm:w-auto"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
      WhatsApp ile Sipariş Ver / Bilgi Al
    </a>
  );
}
