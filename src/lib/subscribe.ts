const WEB3FORMS_ACCESS_KEY = 'e9235aa6-9ecb-4cf5-9e41-ff7400c33906'

export async function subscribeEmail(email: string): Promise<void> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'New CodeCat Cookies signup',
      email,
    }),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message || 'Something went wrong. Try again.')
  }
}
