import { useRef, useState, useEffect } from 'react'
import Slider from 'react-slick'
import clsx from 'clsx'
import { Box, IconButton } from '@chakra-ui/react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import { countNumbersBetween } from '../utils/number'

const ThemeSelect = ({ theme, setTheme, availableThemes, colorScheme }) => {
  const sliderRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(null)
  const wouldScroll = availableThemes.length > 7

  const CustomArrow = props => {
    const { wouldScroll, className, onClick } = props
    const isLeft = className.includes('slick-prev')
    const translateMd = isLeft ? 'translateX(-36px)' : 'translateX(40px)'
    const translateBase = isLeft ? 'translateX(10px)' : 'translateX(-10px)'

    return (
      <IconButton
        className="carousel-navigation"
        m="auto"
        display={wouldScroll ? { base: 'flex', md: 'none' } : 'none'}
        backdropFilter="blur(12px)"
        borderRadius="full"
        colorScheme="blackAlpha"
        position="absolute"
        top={0}
        bottom={0}
        left={isLeft && '0'}
        right={isLeft || '0'}
        onClick={onClick}
        zIndex={1}
        fontSize={22}
        size="sm"
        transform={{ base: translateBase, md: translateMd }}
        icon={isLeft ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        boxShadow="md"
      />
    )
  }

  const settings = {
    swipeToSlide: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    infinite: wouldScroll,
    variableWidth: true,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <CustomArrow wouldScroll={wouldScroll} />,
    prevArrow: <CustomArrow wouldScroll={wouldScroll} />,
    beforeChange: (current, next) => {
      if (currentIndex !== null) setTheme(availableThemes[next])
      setCurrentIndex(next)
    }
  }

  const handleThemeClick = index => {
    const slideDifference = Math.abs(index - currentIndex)
    const shouldOverflow = slideDifference > 4

    const lowerBound = Math.min(index, currentIndex)
    const isLowerBound = index === lowerBound
    const upperBound = Math.max(index, currentIndex)

    const totalThemesSize = Array.from(Array(availableThemes.length).keys())
    const indexDifference = shouldOverflow
      ? countNumbersBetween(totalThemesSize, lowerBound, upperBound)
      : slideDifference

    const destinationIndex =
      currentIndex +
      (isLowerBound ? 1 : -1) * (shouldOverflow ? 1 : -1) * indexDifference

    sliderRef.current.slickGoTo(destinationIndex)
  }

  useEffect(() => {
    const mountedIndex = availableThemes.findIndex(
      availableTheme => availableTheme === theme
    )

    sliderRef.current.slickGoTo(mountedIndex)
  }, [])

  return (
    <div
      className="DIIPIKS-theme-select-container"
      style={{ opacity: currentIndex === null ? 0 : 1 }}
    >
      <span className="DIIPIKS-theme-name">{theme}</span>
      <div className="DIIPIKS-theme-slider-wrapper">
        <Box
          as={Slider}
          className={clsx({ scroll: wouldScroll }, 'DIIPIKS-theme-slider')}
          {...settings}
          ref={sliderRef}
        >
          {availableThemes.map((themeName, index) => {
            const isSelected = themeName === theme

            return (
              <Box
                key={`theme-${themeName}`}
                display="flex !important"
                alignItems="center"
                onClick={isSelected ? null : () => handleThemeClick(index)}
              >
                <span
                  style={{
                    backgroundColor: colorScheme[themeName][200],
                    outlineWidth: isSelected ? '1px' : '2px'
                  }}
                  className="theme-color-hero"
                />
              </Box>
            )
          })}
        </Box>
        <div className="selected-theme-container">
          <span className="selected-theme-ring" />
        </div>
      </div>
    </div>
  )
}

export default ThemeSelect
