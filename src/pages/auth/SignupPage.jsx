import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MdAlternateEmail, MdBusiness, MdPerson, MdPhone, MdCheckCircle } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";

const EMPTY = {
  company_name: "",
  owner_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
};

const FIELDS = [
  { name: "company_name", label: "Company name", type: "text", autoComplete: "organization", placeholder: "Green Collectors Ltd", Icon: MdBusiness },
  { name: "owner_name", label: "Your full name", type: "text", autoComplete: "name", placeholder: "Jane Wanjiru", Icon: MdPerson },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com", Icon: MdAlternateEmail },
  { name: "phone_number", label: "Phone (M-Pesa number)", type: "tel", autoComplete: "tel", placeholder: "0712 345 678", Icon: MdPhone },
  { name: "password", label: "Password (8+ characters)", type: "password", autoComplete: "new-password", placeholder: "Create a password", Icon: TbLockPassword, minLength: 8 },
  { name: "password_confirmation", label: "Confirm password", type: "password", autoComplete: "new-password", placeholder: "Repeat your password", Icon: TbLockPassword },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 " +
  "placeholder:text-gray-400 outline-none transition " +
  "focus:border-green-500 focus:ring-4 focus:ring-green-500/15 " +
  "dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 " +
  "dark:focus:border-green-400 dark:focus:ring-green-400/15";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 " +
  "transition peer-focus:text-green-500 dark:text-white/30 dark:peer-focus:text-green-400";

const primaryButton =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white " +
  "shadow-lg shadow-green-600/25 transition hover:bg-green-700 focus:outline-none focus-visible:ring-4 " +
  "focus-visible:ring-green-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 " +
  "dark:bg-green-500 dark:text-gray-950 dark:shadow-green-500/20 dark:hover:bg-green-400";

export default function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setBusy(true);
    try {
      const result = await signup(form);
      if (result.pending) {
        setPendingMessage(result.message);
      } else {
        toast.success("Account created", { duration: 2500, position: "top-center" });
      }
      // when not pending, AuthContext logs them in and the dashboard shows automatically
    } catch (err) {
      toast.error(err.message || "Failed to create account", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Toaster />
      <main className="grid min-h-screen bg-white dark:bg-gray-950 lg:grid-cols-2">
        {/* Brand panel (desktop only) */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
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
              Register your garbage collection company.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-green-100/80">
              Add your buildings and customers, record payments and withdraw
              your earnings to M-Pesa.
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

            {pendingMessage ? (
              <div>
                <MdCheckCircle className="text-5xl text-green-600 dark:text-green-400" aria-hidden="true" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Registration received
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-white/50">
                  {pendingMessage}
                </p>
                <button type="button" onClick={onSwitchToLogin} className={"mt-8 " + primaryButton}>
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Create your account
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
                  Register your garbage collection company.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                  {FIELDS.map(({ name, label, type, autoComplete, placeholder, Icon, minLength }) => {
                    const isPassword = type === "password";
                    return (
                      <div key={name}>
                        <label
                          htmlFor={name}
                          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80"
                        >
                          {label}
                        </label>
                        <div className="relative">
                          <input
                            id={name}
                            name={name}
                            type={isPassword && showPassword ? "text" : type}
                            autoComplete={autoComplete}
                            placeholder={placeholder}
                            minLength={minLength}
                            value={form[name]}
                            onChange={handleChange}
                            required
                            className={"peer " + (isPassword ? "pr-12 " : "") + inputClass}
                          />
                          <Icon className={iconClass} />
                          {name === "password" && (
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-lg text-gray-400 transition hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white/30 dark:hover:text-green-400"
                            >
                              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button type="submit" disabled={busy} className={primaryButton}>
                    {busy && (
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      />
                    )}
                    {busy ? "Creating account…" : "Create account"}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 dark:text-white/50">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-semibold text-green-600 transition hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}