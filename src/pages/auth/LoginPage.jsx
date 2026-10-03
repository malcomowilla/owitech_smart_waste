import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 " +
  "placeholder:text-gray-400 outline-none transition " +
  "focus:border-green-500 focus:ring-4 focus:ring-green-500/15 " +
  "dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 " +
  "dark:focus:border-green-400 dark:focus:ring-green-400/15";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 " +
  "transition peer-focus:text-green-500 dark:text-white/30 dark:peer-focus:text-green-400";

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.identifier.trim() || !form.password) {
      toast.error("Enter your email or phone number and password", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setBusy(true);
    try {
      await login(form.identifier.trim(), form.password);
      toast.success("Welcome back", { duration: 2000, position: "top-center" });
    } catch (err) {
      toast.error(err.message || "Failed to sign in", {
        duration: 4000,
        position: "top-center",
      });
      setBusy(false);
    }
  };

  return (
    <>
      <Toaster />
      <main className="grid min-h-screen bg-white dark:bg-gray-950 lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br
         from-green-600 via-green-700 to-emerald-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-300/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
          />

          <p className="relative text-xl font-bold tracking-tight">♻ TakaPick</p>

          <div className="relative max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Run your collection business from one place.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-green-100/80">
              Manage buildings and customers, record payments and withdraw your
              earnings.
            </p>
          </div>

          <p className="relative text-sm text-green-100/60">
            Cleaner neighbourhoods, simpler collections.
          </p>
        </aside>

        {/* Form panel */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <p className="mb-8 text-xl font-bold tracking-tight text-gray-900 dark:text-white lg:hidden">
              ♻ TakaPick
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
              Sign in to your collection business.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80"
                >
                  Email or phone number
                </label>
                <div className="relative">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com"
                    value={form.identifier}
                    onChange={handleChange}
                    required
                    className={"peer " + inputClass}
                  />
                  <MdAlternateEmail className={iconClass} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={"peer pr-12 " + inputClass}
                  />
                  <TbLockPassword className={iconClass} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-lg text-gray-400 transition hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white/30 dark:hover:text-green-400"
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-500 dark:text-gray-950 dark:shadow-green-500/20 dark:hover:bg-green-400"
              >
                {busy && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                )}
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-white/50">
              New collection company?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-semibold text-green-600 transition hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
              >
                Create an account
              </button>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}