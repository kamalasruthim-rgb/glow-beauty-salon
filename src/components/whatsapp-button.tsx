const PHONE = "919876543210";

export function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hi Glow Beauty Salon, I'd like to book an appointment.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M19.11 17.49c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.18.28-.71.9-.87 1.08-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.22-1.37-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48l-.54-.01c-.18 0-.49.07-.74.35s-.97.95-.97 2.31c0 1.36.99 2.67 1.13 2.86.14.18 1.95 2.98 4.73 4.18.66.28 1.18.45 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.18-.54-.32zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.5 3.71 1.43 5.33L5.33 26.67l5.47-1.41a10.65 10.65 0 0 0 5.22 1.36h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.86-1.11-5.55-3.13-7.57a10.6 10.6 0 0 0-7.57-3.13z" />
      </svg>
    </a>
  );
}