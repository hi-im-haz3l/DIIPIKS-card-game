import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function FetchThemes(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (session?.user.isAdmin) {
    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      const data = await db
        .collection('themes')
        .find()
        .sort({ placement: -1 })
        .toArray()

      res.status(200).json(data)
    } catch (error) {
      console.error(error)
      res.status(409).json(error)
    }
    return
  }

  res.status(403).json({ message: 'Forbidden!' })
}
