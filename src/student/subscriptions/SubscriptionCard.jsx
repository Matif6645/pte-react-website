
import "./SubscriptionCard.css";

const ALLOWED_THEMES = [
  "basic",
  "pro",
  "premium",
  "gold",
  "dark",
];

function SubscriptionCard({
  plan,
  isCurrentPlan = false,
  onSelectPlan,
}) {
  if (!plan) return null;

  const theme = ALLOWED_THEMES.includes(plan.theme)
    ? plan.theme
    : "basic";

  const price = Number(plan.price ?? 0);

  const currency = plan.currency || "USD";

  const formattedPrice = new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  ).format(price);

  const billingPeriod =
    plan.billing_period || plan.billingPeriod || "month";

  const features = Array.isArray(plan.features)
    ? plan.features
    : [];

  const privateLessons = Number(
    plan.private_lessons_per_period ??
    plan.privateLessons ??
    0
  );

  const groupClasses =
    plan.group_classes_included ??
    plan.groupClasses ??
    false;

  const badgeText =
    plan.badge_text ||
    plan.badgeText ||
    "";

  return (
    <article
      className={`student-plan-card student-plan-${theme} ${
        isCurrentPlan ? "student-plan-current" : ""
      }`}
    >
      <div className="student-plan-top">
        {badgeText && (
          <span className="student-plan-badge">
            {badgeText}
          </span>
        )}

        <div className="student-plan-icon">
          {theme === "premium" || theme === "gold"
            ? "♛"
            : "✦"}
        </div>

        <h2>{plan.name}</h2>

        <p className="student-plan-description">
          {plan.description}
        </p>

        <div className="student-plan-price">
          <strong>{formattedPrice}</strong>
          <span>/ {billingPeriod}</span>
        </div>
      </div>

      <div className="student-plan-content">
        <ul className="student-plan-features">
          {features.map((feature, index) => (
            <li key={`${index}-${feature}`}>
              <span>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="student-plan-access">
          <p>
            <span>Weekly Group Classes</span>
            <strong>
              {groupClasses ? "Included" : "Locked"}
            </strong>
          </p>

          <p>
            <span>Private Lessons</span>
            <strong>
              {privateLessons > 0
                ? `${privateLessons} / period`
                : "Locked"}
            </strong>
          </p>
        </div>

        <button
          type="button"
          className="student-plan-button"
          disabled={isCurrentPlan || !onSelectPlan}
          onClick={() => onSelectPlan?.(plan)}
        >
          {isCurrentPlan
            ? "Current Plan"
            : "Request This Plan"}
        </button>
      </div>
    </article>
  );
}

export default SubscriptionCard;
