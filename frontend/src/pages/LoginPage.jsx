import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { SparklesIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon, UserIcon, MailIcon, LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { login, register } = useAuth();

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back!");
      } else {
        if (!form.name.trim()) return toast.error("Name is required");
        await register(form.name, form.email, form.password);
        toast.success("Account created!");
      }
      navigate(decodeURIComponent(redirectTo));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content mb-6 transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-base-100/80 backdrop-blur-xl border border-base-content/10 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="size-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                Talent IQ
              </p>
              <p className="text-xs text-base-content/50 -mt-0.5">Code Together</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-base-200 rounded-2xl p-1 mb-8 gap-1">
            {["login", "register"].map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => { setTab(t); setForm({ name: "", email: "", password: "" }); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                  tab === t
                    ? "bg-base-100 shadow-md text-base-content"
                    : "text-base-content/50 hover:text-base-content/80"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-base-content">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-base-content/50 text-sm mt-1">
              {tab === "login"
                ? "Sign in to continue coding together"
                : "Join thousands of developers leveling up"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — register only */}
            {tab === "register" && (
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/60">
                    Full Name
                  </span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                  <input
                    id="input-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Email
                </span>
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                <input
                  id="input-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Password
                </span>
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
                  className="input input-bordered w-full pl-10 pr-10 rounded-xl bg-base-200/50 focus:bg-base-100 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full rounded-xl mt-2 text-base font-bold shadow-lg hover:shadow-primary/25 transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : tab === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer switch */}
          <p className="text-center text-sm text-base-content/50 mt-6">
            {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              id="btn-switch-tab"
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setForm({ name: "", email: "", password: "" }); }}
              className="text-primary font-semibold hover:underline"
            >
              {tab === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
