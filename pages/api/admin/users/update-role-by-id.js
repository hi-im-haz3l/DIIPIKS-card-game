import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function UpdateRoleById(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { _id, isAdmin } = req.body

  if (session?.user.isAdmin && session?.user.id !== _id) {
    if (!_id) return res.status(404).json({ message: 'Missing identifier!' })

    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)
      const collection = db.collection('userData')

      await collection.findOne({ _id }, (err, ret) => {
        if (!ret) {
          res.status(404).json({ message: `User ${_id} could not be found!` })

          return
        }
      })

      const data = await collection.findOneAndUpdate(
        { _id },
        { $set: { isAdmin } },
        { returnDocument: 'after' }
      )

      const { value: { latestSession, ...rest } = {} } = data || {}

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
