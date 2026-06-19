import { messengers } from "@/data/site";

type MessengerId = (typeof messengers)[number]["id"];

function MessengerIcon({ id }: { id: MessengerId }) {
  if (id === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 4 3.9 10.6c-.9.4-.9 1.6.1 1.9l4.2 1.3 1.6 5c.3.9 1.4 1.1 2 .3l2.4-3 4.5 3.3c.8.6 1.9.1 2-1l2.2-13.1c.2-.9-.7-1.6-1.6-1.3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m8.3 13.7 8.6-5.4-6.8 7.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (id === "vk") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 8c.1 5.5 3 8.8 8.2 8.8h.3v-3.1c1.9.2 3.3 1.6 3.9 3.1H20c-.8-2.2-2.4-3.7-3.5-4.2 1.1-.7 2.5-2.5 2.8-4.6h-3.2c-.5 1.6-1.9 3.4-3.6 3.6V8H9.4v6.3C7.6 13.8 5.5 11.7 5.4 8H4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 18V6h3.2l3.8 5.6L15.8 6H19v12h-3.1v-6.7L13 15.5h-2l-2.9-4.2V18H5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
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
