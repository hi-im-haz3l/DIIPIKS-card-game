import { Flex, Box, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from 'components/layouts/article'
import { useState } from 'react'
import axios from 'axios'
import SlidingButton from 'components/slide-button'
import { FaTelegramPlane } from 'react-icons/fa'
import LoadingTag from 'components/loading-tag'
import BackLink from 'components/back-link'
import ThemeBuilder from 'components/theme-builder'

const CreateTheme = ({ baseURL }) => {
  const toast = useToast()
  const router = useRouter()

  const [isProcessing, setProcessing] = useState(false)
  const [themeData, setThemeData] = useState({
    title: 'New theme',
    cardDesigns: {
      front: `${baseURL}/placeholder/card-front.svg`,
      rear: `${baseURL}/placeholder/card-rear.svg`
    },
    cardContents: [],
    colors: {
      primary: '#b0bec5',
      secondary: '#263238'
    }
  })

  const handleInputChange = (inputField, inputValue) => {
    setThemeData(data => ({ ...data, [inputField]: inputValue }))
  }

  const submitTheme = () => {
    if (!themeData.title) {
      toast({
        title: 'Missing fields!',
        description: 'Please fill out everything before proceeding.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    } else if (!isProcessing) {
      setProcessing(true)

      const currentTime = Date.now()

      axios
        .post('/api/admin/themes/create-theme', {
          payload: {
            ...themeData,
            isPublic: true,
            placement: currentTime,
            createdDate: currentTime,
            updatedDate: currentTime
          }
        })
        .then(() => {
          router.push(`./list`)

          toast({
            title: 'Theme published!',
            description: `${themeData.title} has been published.`,
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        })
    }
  }

  return (
    <Layout title="Create theme">
      <Flex gap={2} my={3}>
        <BackLink color="#fff" title="Themes" href="./list" />
      </Flex>
      <Box bg="#fff" flexGrow={1} position="relative" border="1px solid #444">
        <form>
          <Flex
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            flexDirection="column"
            overflow="auto"
          >
            <ThemeBuilder
              themeData={themeData}
              handleInputChange={handleInputChange}
            />
            <Flex my={6} justifyContent="center">
              <SlidingButton
                isLoading={isProcessing}
                ariaLabel="Publish"
                colorScheme="blue"
                href="#"
                icon={<FaTelegramPlane />}
                onClick={submitTheme}
                type="submit"
              >
                Publish
              </SlidingButton>
            </Flex>
            {isProcessing && (
              <Flex
                alignItems="center"
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backdropFilter="blur(3px)"
                bg="#00000033"
                zIndex={5}
              >
                <LoadingTag m="auto" />
              </Flex>
            )}
          </Flex>
        </form>
      </Box>
    </Layout>
  )
}

CreateTheme.auth = {
  authenticate: true,
  isAdmin: true
}

export default CreateTheme
