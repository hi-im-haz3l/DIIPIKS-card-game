import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function UpdateStateByIdBulk(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { _id, isAdmin } = req.body

  if (session?.user.isAdmin && !_id.includes(session?.user.id)) {
    if (!_id) return res.status(404).json({ message: 'Missing identifier!' })

    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)
      const collection = db.collection('userData')

      const targetedDocs = await collection
        .find({
          _id: {
            $in: _id
          }
        })
        .toArray()

      targetedDocs.map(targetedDoc => {
        if (!_id.includes(targetedDoc._id)) {
          res
            .status(404)
            .json({ message: `User ${targetedDoc._id} could not be found!` })

          throw new Error(`User ${targetedDoc._id} could not be found!`)
        }
      })

      await collection.updateMany(
        {
          _id: {
            $in: _id
          }
        },
        { $set: { isAdmin } }
      )

      const data = await collection
        .find({
          _id: {
            $in: _id
          }
        })
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
