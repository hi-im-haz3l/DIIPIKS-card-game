import { getProviders } from 'next-auth/react'

export default async function authProvider(req, res) {
  const providers = await getProviders()
  res.status(200).json(providers)
}
