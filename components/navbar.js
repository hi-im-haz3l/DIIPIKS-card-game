import { useState } from 'react'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  IconButton,
  Button,
  Box
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { IoColorPaletteOutline, IoColorPalette } from 'react-icons/io5'

import ThemeSelect from 'components/theme-select'

const NavBar = ({ themeObject }) => {
  const { theme } = themeObject
  const [isShowingThemeSelect, setShowingThemeSelect] = useState(false)

  const ThemedMenuItem = ({ title, hoverStyle }) => {
    const hoverColor = (theme?.colors && theme.colors[100]) || 'default.100'

    return (
      <MenuItem
        fontWeight="semibold"
        _hover={{
          backgroundColor: hoverColor,
          ...hoverStyle
        }}
        _focus={{
          backgroundColor: hoverColor
        }}
      >
        {title}
      </MenuItem>
    )
  }

  return (
    <>
      <Box
        maxW={{
          base: 'none',
          md: 'container.sm',
          lg: '900px',
          xl: 'container.lg'
        }}
        className="DIIPIKS-navbar"
      >
        <a href="https://diipiks.fi/" className="DIIPIKS-link">
          <img
            src="/Diipiks_Logo_160x@2x.avif"
            className="DIIPIKS-logo"
            alt="DIIPIKS-logo"
          />
        </a>
        <div className="DIIPIKS-top-controls">
          <Button
            variant="transparent_rounded"
            w="26px"
            mr={3}
            border={isShowingThemeSelect && '2px dashed #333'}
            onClick={() => setShowingThemeSelect(prevState => !prevState)}
          >
            <div>
              {isShowingThemeSelect ? (
                <IoColorPalette fontSize={26} />
              ) : (
                <IoColorPaletteOutline fontSize={26} />
              )}
            </div>
          </Button>

          <Menu placement="bottom-end" isLazy>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={IconButton}
                  isActive={isOpen}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  colorScheme="black"
                  size="md"
                  my={2}
                  css={isOpen ? { backgroundColor: '#222', color: '#fff' } : {}}
                />
                <MenuList minW="120px" border="1px solid #000">
                  <Link href="https://diipiks.fi/" isExternal>
                    <ThemedMenuItem
                      title="Etusivu"
                      hoverStyle={{
                        textDecoration: 'underline',
                        textDecorationThickness: '2px'
                      }}
                    />
                  </Link>
                  <ThemedMenuItem title="FAQ" />
                </MenuList>
              </>
            )}
          </Menu>
        </div>
      </Box>
      {isShowingThemeSelect && <ThemeSelect {...themeObject} />}
    </>
  )
}

export default NavBar
