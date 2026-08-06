import { redirect } from "next/navigation";
import { isStudioAuthRequired } from "@/lib/studioAuth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    returnTo?: string | string[];
  }>;
};

function firstValue(
  value: string | string[] | undefined,
): string {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

function safeReturnTo(value: string): string {
  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/";
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  if (!isStudioAuthRequired()) {
    redirect("/");
  }

  const params = await searchParams;
  const hasError = firstValue(params.error) === "invalid";
  const returnTo = safeReturnTo(
    firstValue(params.returnTo),
  );

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.brandMark} aria-hidden="true">
          K
        </div>

        <p style={styles.eyebrow}>
          ERIK MARTINSSONS
        </p>
        <h1 style={styles.title}>
          KARTARKIV STUDIO
        </h1>
        <p style={styles.intro}>
          Logga in för att administrera och publicera
          tävlingar i Kartarkivet.
        </p>

        <form
          action="/api/login"
          method="post"
          style={styles.form}
        >
          <input
            type="hidden"
            name="returnTo"
            value={returnTo}
          />

          <label style={styles.field}>
            <span style={styles.label}>Användarnamn</span>
            <input
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Lösenord</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={styles.input}
            />
          </label>

          {hasError ? (
            <p role="alert" style={styles.error}>
              Fel användarnamn eller lösenord.
            </p>
          ) : null}

          <button type="submit" style={styles.button}>
            Logga in
          </button>
        </form>

        <p style={styles.note}>
          Åtkomsten är endast avsedd för administratörer.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "1.5rem",
    background:
      "radial-gradient(circle at top, #292929 0%, #111 44%, #080808 100%)",
    color: "#f6f6f6",
  },
  card: {
    width: "min(100%, 28rem)",
    display: "grid",
    gap: "1rem",
    padding: "2rem",
    border: "1px solid #333",
    borderRadius: "1rem",
    background: "rgba(20, 20, 20, 0.96)",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
  },
  brandMark: {
    width: "3rem",
    height: "3rem",
    display: "grid",
    placeItems: "center",
    borderRadius: "0.8rem",
    background: "#ff7a00",
    color: "#111",
    fontSize: "1.35rem",
    fontWeight: 900,
  },
  eyebrow: {
    margin: "0.2rem 0 -0.6rem",
    color: "#ff8a1d",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.16em",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.8rem, 7vw, 2.5rem)",
    lineHeight: 1,
  },
  intro: {
    margin: 0,
    color: "#b8b8b8",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: "1rem",
    marginTop: "0.5rem",
  },
  field: {
    display: "grid",
    gap: "0.45rem",
  },
  label: {
    fontSize: "0.86rem",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    minHeight: "3rem",
    boxSizing: "border-box",
    padding: "0.75rem 0.9rem",
    border: "1px solid #3a3a3a",
    borderRadius: "0.6rem",
    outline: "none",
    background: "#0d0d0d",
    color: "#fff",
    font: "inherit",
  },
  error: {
    margin: 0,
    padding: "0.7rem 0.8rem",
    border: "1px solid rgba(255, 100, 100, 0.45)",
    borderRadius: "0.55rem",
    background: "rgba(255, 80, 80, 0.1)",
    color: "#ffb0b0",
    fontSize: "0.86rem",
  },
  button: {
    minHeight: "3rem",
    border: 0,
    borderRadius: "0.65rem",
    background: "#ff7a00",
    color: "#111",
    font: "inherit",
    fontWeight: 900,
    cursor: "pointer",
  },
  note: {
    margin: "0.3rem 0 0",
    color: "#777",
    fontSize: "0.75rem",
    textAlign: "center",
  },
};
