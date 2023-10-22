import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'
import { ObjectId } from 'mongodb'

export default async function FetchThemes(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { _id } = req.query

  if (session?.user.isAdmin) {
    if (!_id) return res.status(404).json({ message: 'Missing identifier!' })

    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      const data = await db
        .collection('themes')
        .findOne({ _id: new ObjectId(_id) })

      const { latestSession, ...rest } = data || {}

      res.status(200).json({
        ...rest,
        latestSession: latestSession?.date
      })
    } catch (error) {
      console.error(error)
      res.status(409).json(error)
    }
    return
  }

  res.status(403).json({ message: 'Forbidden!' })
}
