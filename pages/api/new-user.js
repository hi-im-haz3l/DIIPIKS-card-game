import { getServerSession } from 'next-auth/next'
import clientPromise from 'lib/mongodb'
import { authOptions } from 'api/auth/[...nextauth]'

export default async function CreateNewUser(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    try {
      const client = await clientPromise
      const db = client.db(process.env.PRODUCTION_DB)

      const currentDate = Date.now()
      const currentDateFormated = new Date(currentDate).toLocaleDateString(
        'fr-FR'
      )

      const data = await db.collection('userData').updateOne(
        { _id: session.user.id },
        {
          $setOnInsert: {
            _id: session.user.id,
            email: session.user.email,
            isAdmin: false,
            latestSession: {
              date: currentDateFormated,
              attempts: 1
            }
          }
        },
        { upsert: true }
      )

      if (!data.upsertedId) {
        res.status(409).json({ message: 'User existed!' })

        return
      }

      res.status(200).json({ message: 'User added successful!' })
    } catch (error) {
      res.status(500).json(error)
    }

    return
  }

  res.status(401).json({ message: 'Unauthenticated!' })
}
