import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'
import { ObjectId } from 'mongodb'

export default async function UpdateStateById(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { _id, payload } = req.body

  if (session.user.id) {
    if (!_id) return res.status(404).json({ message: 'Missing identifier!' })

    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      const data = await db
        .collection('themes')
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: payload },
          { returnDocument: 'after' }
        )

      res.status(200).json(data.value)
    } catch (error) {
      console.error(error)
      res.status(409).json(error)
    }
    return
  }

  res.status(403).json({ message: 'Forbidden!' })
}
