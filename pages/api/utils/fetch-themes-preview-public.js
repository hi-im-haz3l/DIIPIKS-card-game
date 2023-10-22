import clientPromise from 'lib/mongodb'

export default async function FetchThemes(req, res) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.PRODUCTION_DB)

    const data = await db
      .collection('themes')
      .find()
      .sort({ placement: 1 })
      .toArray()

    const formatData = (data ?? []).map(
      ({ _id, title, colors, placement, isPublic }) =>
        isPublic
          ? {
              _id,
              title,
              colorPreview: colors[200],
              placement
            }
          : null
    )

    res.status(200).json(formatData.filter(d => !!d))
  } catch (error) {
    console.error(error)
    res.status(409).json(error)
  }
}
