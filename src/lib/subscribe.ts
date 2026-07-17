export async function subscribeEmail(email: string): Promise<void> {
  const endpoint = import.meta.env.VITE_SHEET_ENDPOINT

  if (!endpoint) {
    throw new Error('Signup is not configured yet.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()

  if (data.status !== 'ok') {
    throw new Error(data.message || 'Something went wrong. Try again.')
  }
}
