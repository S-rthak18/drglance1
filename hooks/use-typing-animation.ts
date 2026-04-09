"use client"

import { useState, useEffect } from "react"

interface UseTypingAnimationProps {
  texts: string[]
  speed?: number
  delayBetweenTexts?: number
  loop?: boolean
}

export function useTypingAnimation({
  texts,
  speed = 100,
  delayBetweenTexts = 2000,
  loop = true,
}: UseTypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentTextIndex]
    let timer: NodeJS.Timeout

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        }, speed)
      } else {
        // Finished typing, wait before deleting
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, delayBetweenTexts)
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, speed / 2)
      } else {
        // Move to next text
        setIsDeleting(false)
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentTextIndex, texts, speed, delayBetweenTexts])

  return displayText
}
