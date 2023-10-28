import axios from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import move from 'lodash-move'
import clsx from 'clsx'

import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md'

import { Button, Container, Center } from '@chakra-ui/react'
import LoadingTag from 'components/loading-tag'

import { shuffleArray } from 'utils/array'

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

  const moveCard = direction => {
    setCards(prevState => {
      if (direction === 'next') {
        return move(prevState, 0, prevState.length - 1)
      }

      return move(prevState, prevState.length - 1, 0)
    })
  }

  useEffect(() => {
    if (variantId) {
      setFetchingTheme(true)
      axios
        .get(`/api/utils/fetch-theme-by-id-public?_id=${variantId}`)
        .then(response => {
          const { cardContents, ...themeData } = response.data || {}
          setFetchingTheme(false)
          setTheme(themeData)

          shuffleArray(cardContents)
          const shuffledArray = [
            ...cardContents,
            {
              placement: cardContents.length + 1,
              category: 'Thanks for playing!',
              question:
                'You have reached the end of the deck. Wanna give it another swing?'
            }
          ].map((cardContent, index) => ({ ...cardContent, order: index + 1 }))
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
        <div className="DIIPIKS-card-game-container">
          <span className="card-count">
            {cards[0]?.order || 0}/{cards.length}
          </span>
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
                    rotate: !canDrag ? `3deg` : undefined,
                    zIndex: cards.length - index,
                    opacity: index <= 4 ? 1 - index * 0.2 : 0
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
                      !isDragging && animating === placement ? 'none' : 'auto'
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
          <div className="DIIPIKS-navigation-buttons">
            <Button
              pl={2}
              variant="transparent"
              leftIcon={<MdArrowBackIosNew />}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={velocityX < 0 ? '#000000' : '#00000000'}
              _active={{ borderColor: '#000000' }}
              onClick={() => moveCard('back')}
            >
              Back
            </Button>
            <Button
              pr={2}
              variant="transparent"
              rightIcon={<MdArrowForwardIos />}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={velocityX > 0 ? '#000000' : '#00000000'}
              _active={{ borderColor: '#000000' }}
              onClick={() => moveCard('next')}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export default GameVariant
