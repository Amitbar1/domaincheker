"use client";

interface BuyButtonProps {
  domain: string;
}

export default function BuyButton({ domain }: BuyButtonProps) {
  // Split domain into SLD (second-level domain) and TLD
  const dotIndex = domain.indexOf(".");
  const sld = domain.substring(0, dotIndex);
  const tld = domain.substring(dotIndex); // includes the dot, e.g. ".com"

  const mainregUrl = `https://my.mainreg.com/cart.php?a=add&domain=register&sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}`;

  return (
    <a
      href={mainregUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
      Buy Now
    </a>
  );
}
