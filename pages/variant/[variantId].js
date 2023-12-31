import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import move from 'lodash-move'
import clsx from 'clsx'

import { Container, Center } from '@chakra-ui/react'
import LoadingTag from 'components/loading-tag'

import { shuffleArray } from 'utils/array'
import { useResizeObserverRef } from 'utils/hook'

const GameVariant = () => {
  const router = useRouter()
  const { variantId } = router.query
  const ConfidenceThreshold = 1000

  const [theme, setTheme] = useState({})
  const { cardDesigns = {}, colors = {} } = theme || {}
  const [isFetchingTheme, setFetchingTheme] = useState(false)

  const [cards, setCards] = useState([])
  const [isDragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(null)
  const [velocityX, setVelocityX] = useState(0)

  const [containerBounding, setContainerBounding] = useState({})

  const containerRef = useResizeObserverRef(bounding =>
    setContainerBounding(bounding)
  )

  const { width: containerWidth, height: containerHeight } =
    containerBounding || {}

  const cardAspectRatio = 18 / 25
  const cardWidth = 400
  const cardHeight = cardWidth / cardAspectRatio

  const containerScale = useMemo(
    () =>
      Math.min(containerWidth / cardWidth, containerHeight / cardHeight, 1.5),
    [containerWidth, containerHeight]
  )

  const moveCard = direction => {
    setCards(prevState => {
      if (direction === 'next') {
        return move(prevState, 0, prevState.length - 1)
      } else if (cards[0].order != 1) {
        return move(prevState, prevState.length - 1, 0)
      }

      return prevState
    })
  }

  useEffect(() => {
    if (variantId) {
      setFetchingTheme(true)
      axios
        .get(`/api/utils/fetch-theme-by-id-public?_id=${variantId}`)
        .then(response => {
          const { cardContents, endCard, ...themeData } = response.data || {}
          setFetchingTheme(false)
          setTheme(themeData)

          shuffleArray(cardContents)
          const shuffledArray = [...cardContents, endCard].map(
            (cardContent, index) => ({ ...cardContent, order: index + 1 })
          )
          setCards(shuffledArray)
        })
    }

    const nextKeysListener = e => {
      if (e.key === 'ArrowRight') moveCard('next')
      else if (e.key === 'ArrowLeft') moveCard('back')
    }
    document.addEventListener('keyup', nextKeysListener)

    return () => {
      document.removeEventListener('keyup', nextKeysListener)
    }
  }, [variantId])

  return (
    <Container
      as="main"
      maxW="8xl"
      position="relative"
      display="flex"
      flexDirection="column"
      h="100dvh"
      backgroundColor={
        (theme?.colors && theme.colors['primary']) || 'default.900'
      }
      transition=".2s"
      overflow="hidden"
    >
      {isFetchingTheme ? (
        <Center w="100%" h="100%">
          <LoadingTag m="auto" />
        </Center>
      ) : (
        <div className="DIIPIKS-card-game-container" ref={containerRef}>
          <div
            className="DIIPIKS-cards-deck"
            style={{
              width: cardWidth,
              aspectRatio: cardAspectRatio,
              transform: `scale(${containerScale.toFixed(2)})`
            }}
          >
            <button
              className="DIIPIKS-navigation-button back"
              onClick={() => moveCard('back')}
            >
              <motion.span
                animate={{
                  x: [-2, -5, -2]
                }}
                transition={{
                  ease: 'easeInOut',
                  duration: 2,
                  repeat: Infinity
                }}
                style={{ borderColor: velocityX < 0 ? '#555' : '#00000000' }}
              />
            </button>
            <button
              className="DIIPIKS-navigation-button next"
              onClick={() => moveCard('next')}
            >
              <motion.span
                animate={{
                  x: [2, 5, 2]
                }}
                transition={{
                  ease: 'easeInOut',
                  duration: 2,
                  repeat: Infinity
                }}
                style={{ borderColor: velocityX > 0 ? '#555' : '#00000000' }}
              />
            </button>
            <ul className="DIIPIKS-cards-list">
              {cards.map(({ placement, category, question } = {}, index) => {
                const canDrag = index === 0

                return (
                  <motion.li
                    key={`DIIPIKS-card-${placement}`}
                    layoutId={`DIIPIKS-card-${placement}`}
                    className={clsx(
                      { reveal: canDrag && !isDragging },
                      'DIIPIKS-card'
                    )}
                    animate={{
                      zIndex: cards.length - index,
                      opacity:
                        typeof cards[0].placement !== 'string'
                          ? index <= 4
                            ? 1 - index * 0.2
                            : 0
                          : canDrag
                          ? 1
                          : 0
                    }}
                    drag={canDrag && 'x'}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDrag={(e, { velocity }) => setVelocityX(velocity.x)}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={(e, { offset, velocity }) => {
                      setDragging(false)
                      setAnimating(placement)

                      const swipe = Math.abs(offset.x * velocity.x)
                      if (swipe > ConfidenceThreshold) {
                        moveCard(offset.x > 0 ? 'next' : 'back')
                        setVelocityX(0)
                      }
                    }}
                    onDragTransitionEnd={() => setAnimating(false)}
                    style={{
                      cursor: canDrag ? 'grab' : 'auto',
                      filter: canDrag ? 'brightness(1)' : 'brightness(.95)',
                      pointerEvents:
                        !isDragging && animating === placement
                          ? 'none'
                          : 'auto',
                      width: cardWidth,
                      aspectRatio: cardAspectRatio
                    }}
                    whileTap={{ scale: canDrag && 1.1 }}
                    dragSnapToOrigin
                  >
                    <div
                      className="DIIPIKS-card-inner"
                      style={{
                        cursor: canDrag ? 'grab' : 'auto'
                      }}
                    >
                      <div
                        className="DIIPIKS-card-front"
                        style={{
                          boxShadow: canDrag && '#00000025 0 0 7px 5px',
                          backgroundImage: `url(${cardDesigns['front']})`,
                          backgroundColor: colors['primary']
                        }}
                      >
                        <div className="DIIPIKS-card-content">
                          <span className="DIIPIKS-cards-count">
                            {typeof cards[0]?.placement === 'string'
                              ? cards[0]?.placement
                              : cards[0]?.order || 0}
                            /{cards.length - 1}
                          </span>
                          <span className="DIIPIKS-card-category">
                            {category}
                          </span>
                          <span className="DIIPIKS-card-question">
                            {question}
                          </span>
                        </div>
                      </div>
                      <div
                        className="DIIPIKS-card-rear"
                        style={{
                          boxShadow: canDrag && '#00000025 0 0 7px 5px',
                          backgroundImage: `url(${cardDesigns['rear']})`,
                          backgroundColor: colors['primary']
                        }}
                      />
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </Container>
  )
}

export default GameVariant
