import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function FetchUsers(req, res) {
  const session = await getServerSession(req, res, authOptions)
  // console.log(req.method)

  if (session?.user.isAdmin) {
    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      const data = await db
        .collection('userData')
        .find()
        .sort({ 'latestSession.date': -1 })
        .toArray()

      const formatData = (data ?? []).map(({ latestSession, ...rest }) => ({
        ...rest,
        latestSession: latestSession?.date
      }))

      res.status(200).json(formatData)
    } catch (error) {
      console.error(error)
      res.status(409).json(error)
    }
    return
  }

  res.status(403).json({ message: 'Forbidden!' })
}
