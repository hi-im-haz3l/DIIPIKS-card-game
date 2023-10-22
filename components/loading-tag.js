import { Center, Tag, TagLeftIcon, TagLabel, Spinner } from '@chakra-ui/react'

const LoadingTag = ({ bg = 'white', colorScheme = 'white', ...props }) => (
  <Center {...props}>
    <Tag
      size="lg"
      variant="subtle"
      bg={bg}
      colorScheme={colorScheme}
      border="2px solid #000"
    >
      <TagLeftIcon as={Spinner} />
      <TagLabel display="contents">Loading...</TagLabel>
    </Tag>
  </Center>
)

export default LoadingTag
