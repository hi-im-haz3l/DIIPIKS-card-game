import { useEffect } from 'react'
import { useRouter } from 'next/router'

const NotFound = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [])

  return <></>
}

export default NotFound
