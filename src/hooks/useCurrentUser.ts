import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { type Account } from '~/models/Account'

// import { authService } from '../../services'

export function useCurrentUser(): { user: Account | undefined } {
  const [user, setUser] = useState<Account>()

  useEffect(() => {
    const currentUser = Cookies.get('TOKEN')

    if (currentUser !== undefined) {
      setUser(JSON.parse(currentUser))
    }
  }, [])

  /* const refetchUser = async (userId: string): Promise<void> => {
    const userInfo = await authService.getMe(userId)
    const currentUser = Cookies.get('currentUser')

    if (Boolean(userInfo) && Boolean(currentUser)) {
      const newUser = {
        ...JSON.parse(currentUser),
        username: userInfo.username,
        avatar: userInfo.avatar,
      }
      Cookies.set('currentUser', JSON.stringify(newUser))
      setUser(newUser)
    }
  } */

  return { user }
}
