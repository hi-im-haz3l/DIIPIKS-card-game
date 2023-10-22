import { useRef, useState, useEffect } from 'react'
import Slider from 'react-slick'
import clsx from 'clsx'
import { Flex, Box, IconButton, Spinner } from '@chakra-ui/react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import { countNumbersBetween } from 'utils/number'
import axios from 'axios'

const ThemeSelect = props => {
  const { theme, availableThemes } = props

  const sliderRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(null)
  const [isFetchingAvailableThemes, setFetchingAvailableThemes] =
    useState(false)
  const [isFetchingSelectedTheme, setFetchingSelectedTheme] = useState(false)
  const wouldScroll = availableThemes.length > 7

  const handleSelectTheme = index => {
    const { setTheme } = props

    // if (currentIndex !== null) {
    const targetTheme = availableThemes[index] || availableThemes[0]
    console.log(targetTheme)
    if (!targetTheme) return null

    setFetchingSelectedTheme(true)
    axios
      .get(`/api/utils/fetch-theme-by-id-public?_id=${targetTheme._id}`)
      .then(response => {
        setTheme(response.data)
        setFetchingSelectedTheme(false)
      })
    // }

    setCurrentIndex(index)
  }

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
    beforeChange: (current, next) => handleSelectTheme(next)
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
    const { setAvailableThemes } = props

    setFetchingAvailableThemes(true)
    axios.get('/api/utils/fetch-themes-preview-public').then(response => {
      const availableThemes = response.data
      setAvailableThemes(availableThemes)

      const mountedIndex = availableThemes.findIndex(
        ({ _id }) => _id === theme._id
      )
      sliderRef.current.slickGoTo(mountedIndex)
      setFetchingAvailableThemes(false)
    })
  }, [])

  return (
    <>
      <div
        className="DIIPIKS-theme-select-container"
        style={{ opacity: currentIndex === null ? 0 : 1 }}
      >
        <span className="DIIPIKS-theme-name">{theme.title}</span>
        <div className="DIIPIKS-theme-slider-wrapper">
          <Box
            as={Slider}
            className={clsx({ scroll: wouldScroll }, 'DIIPIKS-theme-slider')}
            {...settings}
            ref={sliderRef}
          >
            {availableThemes.map(({ _id, colorPreview }, index) => {
              const isSelected = _id === theme._id

              return (
                <Box
                  key={`theme-${_id}`}
                  display="flex !important"
                  alignItems="center"
                  onClick={isSelected ? null : () => handleThemeClick(index)}
                >
                  <span
                    style={{
                      backgroundColor: colorPreview,
                      outlineWidth: isSelected ? '1px' : '2px'
                    }}
                    className="theme-color-hero"
                  />
                </Box>
              )
            })}
          </Box>
          {availableThemes.length ? (
            <div className="selected-theme-container">
              <span className="selected-theme-ring" />
            </div>
          ) : null}
        </div>
      </div>
      {(isFetchingAvailableThemes || isFetchingSelectedTheme) && (
        <Flex
          justifyContent="center"
          className="DIIPIKS-theme-select-container"
        >
          <Spinner
            thickness="4px"
            size="lg"
            speed="0.6s"
            color="#000"
            my={2.5}
          />
        </Flex>
      )}
    </>
  )
}

export default ThemeSelect
