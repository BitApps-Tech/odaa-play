import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { LanguageSwitcher } from "@/components/gadaa/LanguageSwitcher";
import { OdaaLogo } from "@/components/gadaa/OdaaLogo";
import { ThemeSwitcher } from "@/components/gadaa/ThemeSwitcher";
import { signIn } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — Odaa Play" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    const result = signIn(phone, password);
    if (!result.ok) {
      setError(t.login.errors[result.error]);
      setBusy(false);
      return;
    }

    void router.invalidate().then(() => {
      void navigate({ to: "/quests", search: {}, replace: true });
    });
  }

  return (
    <main className="animate-rise mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex items-center justify-center gap-2">
        <LanguageSwitcher variant="pills" />
        <ThemeSwitcher />
      </div>
      <div className="mb-8 text-center">
        <OdaaLogo className="mx-auto h-48 w-40" />
        <h1 className="mt-4 font-display text-3xl font-bold text-gold">{t.login.title}</h1>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
          {t.brand.slogan}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{t.login.subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="glass shadow-panel rounded-3xl p-6 sm:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              {t.login.phone}
            </label>
            <div className="relative mt-2">
              <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09 11 22 33 44"
                className="h-12 w-full rounded-xl border border-input bg-secondary/60 pr-4 pl-11 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{t.login.phoneHint}</p>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              {t.login.password}
            </label>
            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.passwordPlaceholder}
                className="h-12 w-full rounded-xl border border-input bg-secondary/60 pr-12 pl-11 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-primary/15 px-3 py-2 text-sm text-primary" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="shadow-glow mt-6 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {busy ? t.login.submitting : t.login.submit}
        </button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">{t.login.newNumber}</p>
      </form>
    </main>
  );
}
