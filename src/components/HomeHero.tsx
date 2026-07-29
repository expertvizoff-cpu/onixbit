import { CheckCircle2 } from "lucide-react";
import { ButtonLink, LeadButton } from "./Buttons";

const systemPoints = [
  "заявки и коммуникации не теряются между каналами",
  "сайт, CRM и учёт работают по одной логике",
  "руководитель видит процесс без ручной сверки",
] as const;

const heroRobotVideo = "/media/home/onixbit-robot-hero-reference.mp4";
const heroRobotPoster = "/media/home/onixbit-robot-dashboard-hero-bgcut-v2.png";

export function HomeHero() {
  return (
    <section className="ob-hero ob-hero--system ob-section">
      <div className="ob-container ob-hero__grid ob-hero-system__grid">
        <div className="ob-hero__copy ob-hero-system__copy">
          <span className="ob-kicker">Ониксбит · CRM, сайт и 1С в одной логике</span>
          <h1 className="ob-hero__title ob-hero-system__title">
            Убираем беспорядок в CRM, сайте и 1С — собираем их в <em>рабочую систему</em>
          </h1>
          <p className="ob-hero__lead ob-hero-system__lead">
            Настраиваем Битрикс24, сайты на 1С-Битрикс и обмены с 1С так, чтобы заявки,
            заказы, остатки, коммуникации и отчёты не жили отдельно друг от друга.
          </p>

          <div className="ob-hero-system__points" aria-label="Что становится понятнее после настройки системы">
            {systemPoints.map((point) => (
              <span key={point}>
                <CheckCircle2 size={17} aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>

          <div className="ob-hero__cta-cluster ob-hero-system__actions">
            <div className="ob-actions">
              <LeadButton>Разобрать вашу систему</LeadButton>
              <ButtonLink href="#directions" variant="secondary">
                Посмотреть направления
              </ButtonLink>
            </div>
          </div>
        </div>

        <RobotDashboardScene />
      </div>
    </section>
  );
}

function RobotDashboardScene() {
  return (
    <div
      className="ob-robot-visual"
      role="img"
      aria-label="Робот Ониксбит связывает Битрикс24, BI-отчёты, интернет-магазин на 1С-Битрикс и 1С"
    >
      <div className="ob-robot-visual__frame">
        <span className="ob-robot-visual__aura" aria-hidden="true" />
        <video
          aria-hidden="true"
          autoPlay
          className="ob-robot-video ob-robot-video--backdrop"
          loop
          muted
          playsInline
          poster={heroRobotPoster}
          preload="metadata"
        >
          <source src={heroRobotVideo} type="video/mp4" />
        </video>
        <video
          aria-hidden="true"
          autoPlay
          className="ob-robot-video ob-robot-video--main"
          loop
          muted
          playsInline
          poster={heroRobotPoster}
          preload="metadata"
        >
          <source src={heroRobotVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
