import { useEffect, useState, cloneElement } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Center, Container } from '@chakra-ui/react'
import LoadingTag from 'components/loading-tag'

const AuthWrapper = ({ args, children }) => {
  const router = useRouter()
  const { data, status } = useSession()
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    setReady(false)

    // Guard clause: Skip middleware if authenticate flag is not set
    if (!args?.authenticate) {
      if (args?.needLoaded && !status === 'loading') {
        return
      }

      setReady(true)
      return
    }

    // Guard clause: Wait for data to be loaded
    if (status === 'loading') {
      return
    }

    // Redirect if user is unauthenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (!data?.user.finishedSetup) {
      axios
        .post('/api/new-user')
        .then(() => location.reload())
        .catch(err => console.log(err))
      return
    }

    // Redirect if user is not an admin
    if (args?.isAdmin && !data?.user.isAdmin) {
      router.push('/')
      return
    }

    setReady(true)
  }, [args, status])

  return (
    <Container
      as="main"
      maxW="8xl"
      position="relative"
      display="flex"
      flexDirection="column"
      h="100dvh"
      transition=".2s"
      overflow="hidden"
    >
      {isReady ? (
        cloneElement(children, {
          authData: data,
          authStatus: status
        })
      ) : (
        <Center w="100%" h="100%">
          <LoadingTag m="auto" />
        </Center>
      )}
    </Container>
  )
}

export default AuthWrapper
