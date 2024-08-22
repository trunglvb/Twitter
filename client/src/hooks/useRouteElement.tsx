import path from '@/constants/path'
import Home from '@/pages/home'
import { useRoutes } from 'react-router-dom'

const useRouteElement = () => {
  const routeElement = useRoutes([
    {
      index: true,
      path: path.home,
      element: <Home />
    }
  ])
  return routeElement
}

export default useRouteElement
