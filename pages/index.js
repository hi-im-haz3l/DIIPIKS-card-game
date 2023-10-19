import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import move from 'lodash-move'
import classNames from 'classnames'

import CARDS_CONTENT from '../lib/card-content'

const Home = () => {
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
    <div className="DIIPIKS-card-game-container">
      <div>
        <span className="card-count">
          {cards[0].id}/{cards.length}
        </span>
      </div>
      <ul className="DIIPIKS-cards-list">
        {cards.map(({ id, emoji, question } = {}, index) => {
          const canDrag = index === 0

          return (
            <motion.li
              key={`DIIPIKS-card-${id}`}
              className={classNames(
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
                setAnimating(id)

                const swipe = Math.abs(offset.x * velocity.x)
                if (swipe > ConfidenceThreshold) moveToEnd(index)
              }}
              onDragTransitionEnd={() => setAnimating(false)}
              style={{
                originX: 0,
                originY: 0.5,
                cursor: canDrag ? 'grab' : 'auto',
                filter: canDrag ? 'brightness(1)' : 'brightness(.9)',
                pointerEvents: !isDragging && animating === id ? 'none' : 'auto'
              }}
              dragSnapToOrigin
            >
              <div
                className="DIIPIKS-card-inner"
                style={{
                  cursor: canDrag ? 'grab' : 'auto'
                }}
              >
                <div className="DIIPIKS-card-front" />
                <div className="DIIPIKS-card-rear">
                  <div className="DIIPIKS-card-content">
                    <span className="DIIPIKS-card-category">{emoji}</span>
                    <span className="DIIPIKS-card-question">{question}</span>
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home