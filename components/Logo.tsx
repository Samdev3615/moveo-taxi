import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  darkBg?: boolean;
}

const sizes = {
  sm: { w: 100, h: 45 },
  md: { w: 130, h: 58 },
  lg: { w: 175, h: 78 },
  xl: { w: 200, h: 80 },
};

export default function Logo({ size = "md", darkBg = false }: LogoProps) {
  const { w, h } = sizes[size];

  const img = (
    <Image
      src="/images/moveo-taxi-logo.png"
      alt="Moveo Taxi — Service de taxi en Israël"
      width={w}
      height={h}
      className="object-contain"
      priority
    />
  );

  if (darkBg) {
    return (
      <div className="bg-white rounded-xl px-3 py-1.5 inline-flex">
        {img}
      </div>
    );
  }

  return img;
}
