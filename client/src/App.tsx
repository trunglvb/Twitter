import useRouteElement from './hooks/useRouteElement'

function App() {
  const routeElement = useRouteElement()
  return (
    <>
      {routeElement}
      <div className='text-red-600'>JIRA TEST</div>
    </>
  )
}

export default App
