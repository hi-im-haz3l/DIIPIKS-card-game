import NextAuth from 'next-auth'
import { createTransport } from 'nodemailer'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from 'lib/mongodb'
import { magicEmailHtml, magicEmailText } from 'html/email/magicLink'
import { ObjectId } from 'mongodb'

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

function escape(htmlStr) {
  return htmlStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const sendVerificationRequest = async ({ identifier, url }) => {
  const sanitizedEmail = escape(identifier)

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `"Choicely Authenticator 🦕" ${process.env.EMAIL_FROM}`,
        to: identifier,
        subject: ':DIIPIKS admin panel magic link',
        text: magicEmailText(url),
        html: magicEmailHtml(url, sanitizedEmail)
      },
      error => {
        if (error) {
          console.log(
            `Unable to send verification email to ${identifier} (${error}))`
          )
          return reject(new Error(error))
        }
        return resolve()
      }
    )
  })
}

const sessionCallback = async ({ session, user }) => {
  if (!session) return
  const client = await clientPromise

  const currentDate = Date.now()
  const currentDateFormated = new Date(currentDate).toLocaleDateString('fr-FR')

  const usersCollection = client
    .db(process.env.PRODUCTION_DB)
    .collection('userData')

  const userData = await usersCollection.findOne({
    _id: user.id
  })

  const sessionsCollection = client
    .db(process.env.PRODUCTION_DB)
    .collection('sessions')
  const sessionsData = await sessionsCollection
    .find({ userId: new ObjectId(user.id) })
    .sort({ expires: -1 })
    .toArray()

  if (
    userData?.latestSession?.date === currentDateFormated &&
    parseInt(userData?.latestSession?.attempts) >= 3 &&
    !userData?.isAdmin
  ) {
    if (sessionsData.length > 0) {
      await sessionsCollection.deleteMany({
        userId: new ObjectId(user.id)
      })
    }

    return (session = { error: 'TooManyNewDevices' })
  }

  if (sessionsData.length > 1) {
    const latestSession = sessionsData[0]
    await sessionsCollection.deleteMany({
      userId: new ObjectId(user.id),
      expires: { $ne: latestSession.expires }
    })
    await usersCollection.updateOne(
      { _id: user.id },
      userData?.latestSession?.date === currentDateFormated
        ? {
            $inc: { 'latestSession.attempts': 1 }
          }
        : {
            $set: {
              'latestSession.date': currentDateFormated,
              'latestSession.attempts': 1
            }
          }
    )
  } else if (userData?.latestSession?.date !== currentDateFormated) {
    await usersCollection.updateOne(
      { _id: user.id },
      {
        $set: {
          'latestSession.date': currentDateFormated,
          'latestSession.attempts': 0
        }
      }
    )
  }

  return (session = {
    ...session,
    user: {
      id: user.id,
      isAdmin: userData?.isAdmin,
      finishedSetup: Boolean(Object.keys(userData || {}).length),
      ...session.user
    }
  })
}

export const authOptions = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin'
  },
  providers: [
    EmailProvider({
      maxAge: 10 * 60,
      sendVerificationRequest
    })
  ],
  theme: {
    colorScheme: 'light'
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.PRODUCTION_DB
  }),
  callbacks: {
    session: sessionCallback
  }
}
export default NextAuth(authOptions)
