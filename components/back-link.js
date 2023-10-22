import NextLink from 'next/link'

import { Link } from '@chakra-ui/react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'

const BackLink = ({ title, href = './', ...props }) => (
  <NextLink href={href} scroll={false} passHref>
    <Link
      as="span"
      mr="auto"
      display="flex"
      alignItems="center"
      fontSize={18}
      fontWeight="semibold"
      color="#555"
      h="100%"
      {...props}
    >
      <MdOutlineArrowBackIosNew />
      {title}
    </Link>
  </NextLink>
)

export default BackLink
