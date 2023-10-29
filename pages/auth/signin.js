import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import {
  useToast,
  Button,
  Box,
  Flex,
  Input,
  Text,
  Container,
  Heading,
  Center
} from '@chakra-ui/react'
import { IoMailUnreadOutline } from 'react-icons/io5'
import { HiOutlineMail } from 'react-icons/hi'
import Layout from 'layouts/article'
import LoadingTag from 'components/loading-tag'
import { motion } from 'framer-motion'

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  Verification: 'Invalid magic link. Try signing again.',
  default: 'Unable to sign in.'
}

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 }
}

const validateEmail = email => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

const SignIn = ({ authStatus }) => {
  const toast = useToast()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [isProcessing, setProcessing] = useState(false)
  const [isDisabled, setDisabled] = useState({})
  const [isFinished, setFinished] = useState(false)

  const [isReady, setReady] = useState(false)

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/settings')
    } else if (authStatus === 'unauthenticated') {
      setReady(true)
    }
  }, [authStatus])

  useEffect(() => {
    if (router.query?.error) {
      toast({
        title: errors[router.query.error] ?? errors.default,
        status: 'error',
        position: 'top',
        isClosable: true
      })
    }
  }, [router])

  const handleSignIn = async e => {
    e.preventDefault()
    if (!validateEmail(email)) {
      toast({
        title: `Invalid email address!`,
        status: 'error',
        position: 'top',
        isClosable: true
      })

      return
    }

    try {
      setDisabled(data => ({ ...data, email: true }))
      setProcessing(true)
      const { error } = await signIn('email', {
        email: email,
        redirect: false
      })
      if (error) throw new Error(error)
      toast({
        title: `Magic link successfully sent`,
        status: 'success',
        position: 'top',
        isClosable: true
      })
      setFinished(true)
    } catch (error) {
      console.log(error)
      toast({
        title: errors[error] ?? errors.default,
        status: 'error',
        position: 'top',
        isClosable: true
      })
      setDisabled(data => ({ ...data, email: false }))
    }
  }

  return (
    <Layout title="Sign in to continue">
      {isReady ? (
        <motion.article
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3, type: 'easeInOut' }}
        >
          <Center w="100%" pt="18svh">
            <Flex
              p={{ base: '1em 1.5em 1.5em 1.5em', sm: '1.5em 2em 2em 2em' }}
              borderRadius="xl"
              overflow="hidden"
              flexDirection="column"
              boxShadow="rgba(99, 99, 99, 0.3) 0 3px 8px 0"
              minW={{ base: '80%', sm: 'sm' }}
              height="fit-content"
              gap={1}
              bg="#fff"
            >
              <Box as="form" onSubmit={handleSignIn} display="grid" gap={2}>
                <Text fontWeight="semibold" color="#555">
                  Email address
                </Text>
                <Input
                  id="email"
                  type="email"
                  mb={1}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={isProcessing}
                  required
                />
                <Button
                  isLoading={isDisabled['email']}
                  isDisabled={isProcessing}
                  type="submit"
                  colorScheme="gray"
                  variant="solid"
                  color="#333"
                  leftIcon={<HiOutlineMail fontSize={24} />}
                >
                  {isDisabled['email'] ? 'Loading...' : 'Continue with Email'}
                </Button>
              </Box>
            </Flex>
          </Center>
          {isFinished && (
            <Flex
              alignItems="center"
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backdropFilter="blur(12px)"
              bg="#ffffffe9"
              zIndex={5}
            >
              <Container px={7}>
                <IoMailUnreadOutline fontSize={42} color="#3182ce" />
                <Heading mb={{ base: 1, md: 2 }}>Confirm your email</Heading>
                <span>
                  We&apos;ve sent a magic link to{' '}
                  <Text display="inline" fontWeight="semibold">
                    {email}
                  </Text>
                  . Check your inbox and click the link in the email to
                  continue.
                </span>
              </Container>
            </Flex>
          )}
        </motion.article>
      ) : (
        <Center w="100%" h="100%">
          <LoadingTag m="auto" />
        </Center>
      )}
    </Layout>
  )
}

SignIn.auth = {
  needLoaded: true
}

export default SignIn
