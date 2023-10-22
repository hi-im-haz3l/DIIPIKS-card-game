import NextLink from 'next/link'
import { Text, Button, Flex } from '@chakra-ui/react'

const SlidingButton = ({
  href,
  ariaLabel,
  icon,
  colorScheme,
  onClick,
  children,
  isLoading,
  ...props
}) => {
  return (
    <NextLink href={href} scroll={false} passHref>
      <Button
        pr={!isLoading && '.8em'}
        colorScheme={colorScheme}
        boxShadow="md"
        _hover={{
          '&>div': { transform: 'translateX(0)', opacity: '1' },
          '&>p': { transform: 'translateX(0)' }
        }}
        aria-label={ariaLabel}
        onClick={onClick}
        gap={1}
        isLoading={isLoading}
        {...props}
      >
        <Text transform="translateX(.6em)" transition="300ms">
          {children}
        </Text>
        <Flex
          ml={1}
          transform="translateX(-7px)"
          opacity="0"
          transition="300ms"
        >
          {icon}
        </Flex>
      </Button>
    </NextLink>
  )
}

export default SlidingButton
