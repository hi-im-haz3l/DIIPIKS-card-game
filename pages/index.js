import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import move from 'lodash-move'
import clsx from 'clsx'

import NavBar from 'components/navbar'
import Footer from 'components/footer'

import CARDS_CONTENT from 'lib/card-content'

const Home = ({ themeObject }) => {
  const CARD_OFFSET = 10
  const SCALE_FACTOR = 0.07
  const ConfidenceThreshold = 1000

  const [cards, setCards] = useState(CARDS_CONTENT)
  const [isDragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(null)

  const moveToEnd = from => {
    setCards(prevState => move(prevState, from, prevState.length - 1))
  }

  useEffect(() => {
    const nextKeysListener = e => {
      const nextCardKeys = ['Enter', ' ', 'ArrowRight', 'ArrowLeft']
      if (nextCardKeys.includes(e.key)) moveToEnd(0)
    }
    document.addEventListener('keyup', nextKeysListener)

    return () => {
      document.removeEventListener('keyup', nextKeysListener)
    }
  }, [])

  return (
    <>
      <NavBar themeObject={themeObject} />
      <div className="DIIPIKS-card-game-container">
        <div>
          <span className="card-count">
            {cards[0].placement}/{cards.length}
          </span>
        </div>
        <ul className="DIIPIKS-cards-list">
          {cards.map(({ placement, emoji, question } = {}, index) => {
            const canDrag = index === 0

            return (
              <motion.li
                key={`DIIPIKS-card-${placement}`}
                className={clsx(
                  { reveal: canDrag && !isDragging },
                  'DIIPIKS-card'
                )}
                animate={{
                  left: index * -CARD_OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: CARDS_CONTENT.length - index,
                  opacity: index <= 4 ? 1 - index * 0.1 : 0
                }}
                drag={canDrag}
                onDragStart={() => setDragging(true)}
                onDragEnd={(e, { offset, velocity }) => {
                  setDragging(false)
                  setAnimating(placement)

                  const swipe = Math.abs(offset.x * velocity.x)
                  if (swipe > ConfidenceThreshold) moveToEnd(index)
                }}
                onDragTransitionEnd={() => setAnimating(false)}
                style={{
                  originX: 0,
                  originY: 0.5,
                  cursor: canDrag ? 'grab' : 'auto',
                  filter: canDrag ? 'brightness(1)' : 'brightness(.9)',
                  pointerEvents:
                    !isDragging && animating === placement ? 'none' : 'auto'
                }}
                dragSnapToOrigin
              >
                <div
                  className="DIIPIKS-card-inner"
                  style={{
                    cursor: canDrag ? 'grab' : 'auto'
                  }}
                >
                  <div className="DIIPIKS-card-front">
                    <div className="DIIPIKS-card-content">
                      <span className="DIIPIKS-card-category">{emoji}</span>
                      <span className="DIIPIKS-card-question">{question}</span>
                    </div>
                  </div>
                  <div className="DIIPIKS-card-rear" />
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
      <Footer themeObject={themeObject} />
    </>
  )
}

export default Home
