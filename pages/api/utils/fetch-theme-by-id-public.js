import clientPromise from 'lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function FetchThemes(req, res) {
  const { _id } = req.query
  if (!_id) return res.status(404).json({ message: 'Missing identifier!' })

  try {
    const client = await clientPromise
    const db = client.db(process.env.PRODUCTION_DB)

    const data = await db
      .collection('themes')
      .findOne({ _id: new ObjectId(_id) })

    // eslint-disable-next-line no-unused-vars
    const { isPublic, createdDate, updatedDate, ...rest } = data || {}

    res.status(200).json(isPublic ? rest : {})
  } catch (error) {
    console.error(error)
    res.status(409).json(error)
  }
}
