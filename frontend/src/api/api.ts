const API_URL = "http://localhost:3000"

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`)
  return response.json()
}

export async function getItems() {
  const response = await fetch(`${API_URL}/items`)
  return response.json()
}