import NextLink from 'next/link'
import Layout from 'layouts/article'
import {
  Box,
  Flex,
  HStack,
  Heading,
  SimpleGrid,
  Text,
  Link,
  Container
} from '@chakra-ui/react'
import { VscPreview } from 'react-icons/vsc'
import { FaUser } from 'react-icons/fa'

const Manage = () => {
  const SettingCategory = ({ context, title, path, icon }) => (
    <NextLink href={path} scroll={false} passHref>
      <Link
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        m={2}
        borderRadius="2xl"
        borderColor="#f3f5fc"
        borderWidth={3}
        _hover={{ borderColor: '#e9e9e9' }}
      >
        <HStack fontWeight="semibold">
          <Flex
            bg="#f3f5fc"
            borderRadius="lg"
            mx={2}
            w="40px"
            h="40px"
            alignItems="center"
            justifyContent="center"
            flex="0 0 40px"
          >
            {icon}
          </Flex>
          <Box w="100%">
            <Heading fontSize={20} fontWeight="semibold">
              {title}
            </Heading>
            <Text fontSize={15} color="#a1a1a1">
              {context}
            </Text>
          </Box>
        </HStack>
      </Link>
    </NextLink>
  )

  return (
    <Layout title="Settings">
      <Container
        maxW="container.lg"
        bg="#fff"
        flexGrow={1}
        outline="1px solid #444"
      >
        <Flex my={6} alignItems="center">
          <Heading ml={2}>Settings</Heading>
        </Flex>

        <SimpleGrid spacing={2} minChildWidth="300px" justifyContent="center">
          <SettingCategory
            title="User accounts"
            context="View and approve user permissions"
            path="/settings/accounts"
            icon={<FaUser fontSize={20} />}
          />
          <SettingCategory
            title="Manage themes"
            context="Create and manage page layout"
            path="/settings/themes/list"
            icon={<VscPreview fontSize={20} />}
          />
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

Manage.auth = {
  authenticate: true,
  isAdmin: true
}

export default Manage
