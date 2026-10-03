

import { useState, useEffect } from "react";

// ---- Settings (change these) ----
const PACK_PRICE = 200; // what a customer pays the operator per bag pack (KSh)
const FEE_RATE = 0.03; // platform fee: 3%

const ksh = (n) => "KSh " + Math.round(n).toLocaleString();
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Saves data in the browser so it survives a refresh (swap for your API later)
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const seedBuildings = [
  { id: 1, name: "Sunrise Apartments", area: "Kilimani", units: 24 },
  { id: 2, name: "Palm Court", area: "Kileleshwa", units: 12 },
];
const seedCustomers = [
  { id: 1, name: "Amina Wanjiku", phone: "0712 345 678", buildingId: 1, unit: "A4", packs: 0 },
  { id: 2, name: "Peter Otieno", phone: "0722 111 222", buildingId: 1, unit: "B2", packs: 0 },
  { id: 3, name: "Grace Njeri", phone: "0733 987 654", buildingId: 2, unit: "3C", packs: 0 },
];

// ---- Shared styles ----
const card = "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800";
const muted = "text-sm text-gray-600 dark:text-gray-400";
const strong = "font-medium text-gray-900 dark:text-white";
const input =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white";
const btn =
  "w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700";
const btnOutline =
  "w-full rounded-xl border border-green-600 py-2 font-semibold text-green-700 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700";

// ---- Small pieces ----
function Stat({ label, value }) {
  return (
    <div className={card}>
      <p className="text-xl font-bold text-green-600 dark:text-green-400">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

// ---- Home ----
function Dashboard({ buildings, customers, tx, balance }) {
  const payments = tx.filter((t) => t.type === "payment");
  const gross = payments.reduce((s, t) => s + t.gross, 0);
  const fees = payments.reduce((s, t) => s + t.fee, 0);
  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat label="Buildings" value={buildings.length} />
      <Stat label="Customers" value={customers.length} />
      <Stat label="Collected from customers" value={ksh(gross)} />
      <Stat label="Platform fee (3%)" value={ksh(fees)} />
      <div className={card + " col-span-2"}>
        <p className={muted}>Wallet balance</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{ksh(balance)}</p>
      </div>
    </div>
  );
}

// ---- Buildings ----
function Buildings({ buildings, customers, onAdd }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", area: "", units: "" });

  const save = () => {
    if (!f.name || !f.area) return;
    onAdd(f);
    setF({ name: "", area: "", units: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => setOpen(!open)} className={btn}>
        {open ? "Cancel" : "+ Add building"}
      </button>

      {open && (
        <div className={card + " space-y-3"}>
          <input className={input} placeholder="Building name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={input} placeholder="Area (e.g. Kilimani)" value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} />
          <input className={input} type="number" placeholder="Number of units" value={f.units} onChange={(e) => setF({ ...f, units: e.target.value })} />
          <button onClick={save} className={btn}>Save building</button>
        </div>
      )}

      {buildings.map((b) => {
        const count = customers.filter((c) => c.buildingId === b.id).length;
        return (
          <div key={b.id} className={card}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={strong}>{b.name}</p>
                <p className={muted}>{b.area} · {b.units || "?"} units</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                {count} customer(s)
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Customers ----
function Customers({ buildings, customers, onAdd, onPay }) {
  const [open, setOpen] = useState(false);
  const blank = { name: "", phone: "", buildingId: buildings[0]?.id, unit: "" };
  const [f, setF] = useState(blank);

  const save = () => {
    if (!f.name || !f.unit) return;
    onAdd({ ...f, buildingId: Number(f.buildingId) });
    setF(blank);
    setOpen(false);
  };
  const buildingName = (id) => buildings.find((b) => b.id === id)?.name;

  return (
    <div className="space-y-4">
      <button onClick={() => setOpen(!open)} disabled={!buildings.length} className={btn}>
        {buildings.length ? (open ? "Cancel" : "+ Add customer") : "Add a building first"}
      </button>

      {open && (
        <div className={card + " space-y-3"}>
          <input className={input} placeholder="Customer name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={input} placeholder="Phone (M-Pesa number)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <select className={input} value={f.buildingId} onChange={(e) => setF({ ...f, buildingId: e.target.value })}>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input className={input} placeholder="House / unit no." value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} />
          <button onClick={save} className={btn}>Save customer</button>
        </div>
      )}

      {customers.map((c) => (
        <div key={c.id} className={card}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={strong}>{c.name}</p>
              <p className={muted}>{buildingName(c.buildingId)} · Unit {c.unit}</p>
              <p className={muted}>{c.phone}</p>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {c.packs} pack(s) paid
            </span>
          </div>
          <button onClick={() => onPay(c)} className={"mt-3 " + btnOutline}>
            Customer paid {ksh(PACK_PRICE)} (M-Pesa)
          </button>
        </div>
      ))}
    </div>
  );
}

// ---- Wallet ----
function Wallet({ tx, balance, onWithdraw }) {
  return (
    <div className="space-y-4">
      <div className={card}>
        <p className={muted}>Available to withdraw</p>
        <p className="text-4xl font-bold text-green-600 dark:text-green-400">{ksh(balance)}</p>
        <p className={"mt-1 " + muted}>You receive 97% of every customer payment. The platform keeps 3%.</p>
        <button onClick={onWithdraw} disabled={balance <= 0} className={"mt-3 " + btn}>
          Withdraw to M-Pesa
        </button>
      </div>

      <h3 className="px-1 font-semibold text-gray-900 dark:text-white">Transactions</h3>
      {tx.length === 0 && <p className={"px-1 " + muted}>Nothing yet. Go to Customers and record a payment.</p>}
      {tx.map((t) => (
        <div key={t.id} className={card}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={strong}>{t.label}</p>
              <p className={muted}>
                {t.time}
                {t.type === "payment" && ` · paid ${ksh(t.gross)}, fee ${ksh(t.fee)}`}
              </p>
            </div>
            <p className={"shrink-0 font-bold " + (t.type === "payment" ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300")}>
              {t.type === "payment" ? "+" : "−"}{ksh(t.net)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- App ----
const TABS = [
  ["home", "Home"],
  ["buildings", "Buildings"],
  ["customers", "Customers"],
  ["wallet", "Wallet"],
];

export default function DashboardTab() {
  const [tab, setTab] = useState("home");
  const [buildings, setBuildings] = useStored("tp_buildings", seedBuildings);
  const [customers, setCustomers] = useStored("tp_customers", seedCustomers);
  const [tx, setTx] = useStored("tp_tx", []);

  const balance = tx.reduce((s, t) => s + (t.type === "payment" ? t.net : -t.net), 0);

  const addBuilding = (f) => setBuildings([...buildings, { id: Date.now(), ...f }]);
  const addCustomer = (f) => setCustomers([...customers, { id: Date.now(), packs: 0, ...f }]);

  const recordPayment = (c) => {
    const fee = PACK_PRICE * FEE_RATE;
    setTx([
      { id: Date.now(), type: "payment", label: `${c.name} · Unit ${c.unit}`, gross: PACK_PRICE, fee, net: PACK_PRICE - fee, time: now() },
      ...tx,
    ]);
    setCustomers(customers.map((x) => (x.id === c.id ? { ...x, packs: x.packs + 1 } : x)));
  };


  
  const withdraw = () =>
    setTx([{ id: Date.now(), type: "withdrawal", label: "Withdrawal to M-Pesa", net: balance, time: now() }, ...tx]);

  return (
    <div className="mx-auto max-w-md px-4 pb-10 pt-6 tracking-wider">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">♻ TakaPick</h1>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Operator dashboard · waste collection business</p>

      <div className="mb-4 grid grid-cols-4 rounded-xl bg-gray-200 p-1 dark:bg-gray-700">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={
              "rounded-lg py-2 text-xs font-semibold transition-colors " +
              (tab === key
                ? "bg-white text-green-700 shadow dark:bg-gray-900 dark:text-green-400"
                : "text-gray-600 dark:text-gray-300")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "home" && <Dashboard buildings={buildings} customers={customers} tx={tx} balance={balance} />}
      {tab === "buildings" && <Buildings buildings={buildings} customers={customers} onAdd={addBuilding} />}
      {tab === "customers" && <Customers buildings={buildings} customers={customers} onAdd={addCustomer} onPay={recordPayment} />}
      {tab === "wallet" && <Wallet tx={tx} balance={balance} onWithdraw={withdraw} />}
    </div>
  );
}