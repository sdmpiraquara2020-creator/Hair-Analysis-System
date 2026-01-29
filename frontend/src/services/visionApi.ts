const API_URL = "http://localhost:3001";

export async function salvarVisionBackend(
  salonId: string,
  payload: any
) {
  const res = await fetch(`${API_URL}/vision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      salonId,
      ...payload,
    }),
  });

  return res.json();
}

export async function listarVisionBackend(salonId: string) {
  const res = await fetch(`${API_URL}/vision/${salonId}`);
  return res.json();
}
