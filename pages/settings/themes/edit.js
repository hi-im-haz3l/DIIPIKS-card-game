import { Box, Flex, useToast, Text, HStack, Switch } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from 'components/layouts/article'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SlidingButton from 'components/slide-button'
import { FaTelegramPlane } from 'react-icons/fa'
import LoadingTag from 'components/loading-tag'
import BackLink from 'components/back-link'
import ThemeBuilder from 'components/theme-builder'

const CreateTheme = () => {
  const toast = useToast()
  const router = useRouter()
  const { themeId } = router.query

  const [isProcessing, setProcessing] = useState(false)
  const [themeData, setThemeData] = useState({})

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
        .patch('/api/admin/themes/update-state-by-id', {
          _id: themeId,
          payload: {
            ...themeData,
            updatedDate: currentTime
          }
        })
        .then(() => {
          router.push(`./list`)

          toast({
            title: 'Theme updated!',
            description: `${themeData.title} has been updated.`,
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        })
    }
  }

  useEffect(() => {
    if (!(themeId || '').length) return

    axios
      .get(`/api/admin/themes/fetch-theme-by-id?_id=${themeId}`)
      .then(response => {
        const { _id, ...rest } = response.data || {}
        setThemeData(rest)
      })
  }, [themeId])

  return (
    !!Object.values(themeData || {}).length && (
      <Layout title="Edit theme">
        <Flex gap={2} my={3}>
          <BackLink title="Themes" href="./list" />
          <HStack ml="auto">
            <Switch
              id="isPublic"
              isChecked={themeData.isPublic}
              onChange={() =>
                handleInputChange('isPublic', !themeData.isPublic)
              }
            />
            <Text fontWeight="semibold">Publicly visible</Text>
          </HStack>
        </Flex>
        <Box bg="#fff" flexGrow={1} position="relative" border="1px solid #444">
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
              >
                Update
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
        </Box>
      </Layout>
    )
  )
}

export default CreateTheme
