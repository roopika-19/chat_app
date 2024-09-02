'use client'

import useChatStore  from '../store/userStore'

// @ts-ignore
export default function AppInitializer({ children }) {
  useChatStore.setState({ })

  return children
}