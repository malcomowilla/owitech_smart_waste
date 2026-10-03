const handle = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }
  return data;
};

const jsonHeaders = { "Content-Type": "application/json" };

export const fetchDashboard = async () => {
  const response = await fetch("/api/collector/dashboard");
  return handle(response);
};

export const createBuilding = async ({ name, area, units }) => {
  const response = await fetch("/api/collector/buildings", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name, area, units }),
  });
  return handle(response);
};

export const createCustomer = async ({ name, phone, unit, buildingId }) => {
  const response = await fetch("/api/collector/customers", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ name, phone, unit, collector_building_id: buildingId }),
  });
  return handle(response);
};

export const recordPayment = async (customerId) => {
  const response = await fetch(`/api/collector/customers/${customerId}/pay`, {
    method: "POST",
  });
  return handle(response);
};

export const withdrawAll = async () => {
  const response = await fetch("/api/collector/withdrawals", { method: "POST" });
  return handle(response);
};