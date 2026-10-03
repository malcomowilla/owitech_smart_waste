// Reads the JSON body and throws an Error with the server's message when the request fails,
// so AuthContext and the pages can show it in a toast.
const handle = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }
  return data;
};

export const signupRequest = async (fields) => {
  const response = await fetch("/api/collector/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  return handle(response);
};

export const loginRequest = async (identifier, password) => {
  const response = await fetch("/api/collector/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return handle(response);
};

export const currentAdminRequest = async () => {
  const response = await fetch("/api/collector/me");
  return handle(response);
};

export const logoutRequest = async () => {
  const response = await fetch("/api/collector/logout", { method: "DELETE" });
  return handle(response);
};