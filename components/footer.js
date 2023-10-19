import { HStack, Box, Tag } from '@chakra-ui/react'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'
import { IoMdReturnLeft } from 'react-icons/io'
import { RiSpace } from 'react-icons/ri'

const Footer = ({ themeObject }) => {
  const Key = ({ title }) => {
    const { theme } = themeObject

    return (
      <Tag size="sm" background={`${theme}.900`} color={`${theme}.50`}>
        {title}
      </Tag>
    )
  }

  return (
    <Box
      className="DIIPIKS-hint"
      display={{ base: 'none', md: 'flex' }}
      maxW={{
        base: 'none',
        md: 'container.sm',
        lg: '900px',
        xl: 'container.lg'
      }}
    >
      <HStack spacing={0}>
        <Key title={<IoMdReturnLeft fontSize={16} />} />
        <span className="hint-text separator">,</span>
        <Key title={<RiSpace fontSize={18} />} />
        <span className="hint-text separator">,</span>
        <Key title={<BiSolidLeftArrow />} />
        <span className="hint-text">tai</span>
        <Key title={<BiSolidRightArrow />} />
        <span className="hint-text">voidaan jatkaa.</span>
      </HStack>
    </Box>
  )
}

export default Footer
