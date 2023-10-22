import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function FetchThemes(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { payload } = req.body

  if (session?.user.isAdmin) {
    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      await db.collection('themes').insertOne(payload)

      res.status(200).json({ message: 'Created!' })
    } catch (error) {
      console.error(error)
      res.status(409).json(error)
    }
    return
  }

  res.status(403).json({ message: 'Forbidden!' })
}
