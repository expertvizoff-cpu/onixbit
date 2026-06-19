import type { CSSProperties } from "react";
import { messengers } from "@/data/site";

type MessengerId = (typeof messengers)[number]["id"];

type BrandIcon = {
  hex: string;
  path: string;
};

const brandIcons: Record<Exclude<MessengerId, "max">, BrandIcon> = {
  telegram: {
    hex: "26A5E4",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  vk: {
    hex: "0077FF",
    path: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z",
  },
};

function MaxIcon() {
  return (
    <svg viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="obMaxGradientB">
          <stop offset="0" stopColor="#00f" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="obMaxGradientA">
          <stop offset="0" stopColor="#4cf" />
          <stop offset=".662" stopColor="#53e" />
          <stop offset="1" stopColor="#93d" />
        </linearGradient>
        <linearGradient id="obMaxGradientC" x1="117.847" x2="1000" y1="760.536" y2="500" gradientUnits="userSpaceOnUse" href="#obMaxGradientA" />
        <radialGradient id="obMaxGradientD" cx="-87.392" cy="1166.116" r="500" fx="-87.392" fy="1166.116" gradientTransform="rotate(51.356 1551.478 559.3) scale(2.42703433 1)" gradientUnits="userSpaceOnUse" href="#obMaxGradientB" />
      </defs>
      <rect width="1000" height="1000" fill="url(#obMaxGradientC)" ry="249.681" />
      <rect width="1000" height="1000" fill="url(#obMaxGradientD)" ry="249.681" />
      <path fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" />
    </svg>
  );
}

function MessengerIcon({ id }: { id: MessengerId }) {
  if (id === "max") return <MaxIcon />;

  const icon = brandIcons[id];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export function MessengerLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`ob-messengers ${className}`} aria-label="Мессенджеры">
      {messengers.map((item) => (
        <a
          className={`ob-messenger ob-messenger--${item.id}`}
          href={item.href}
          key={item.id}
          style={{ "--messenger-color": item.id === "max" ? "#4b67ff" : `#${brandIcons[item.id].hex}` } as CSSProperties}
          target="_blank"
          rel="nofollow noopener"
          aria-label={item.title}
          title={item.title}
        >
          <MessengerIcon id={item.id} />
          <span>{item.title}</span>
        </a>
      ))}
    </div>
  );
}
