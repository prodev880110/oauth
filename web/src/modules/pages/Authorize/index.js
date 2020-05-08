// Imports
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import * as queryString from 'query-string'

// UI imports
import './style.css'

// App imports
import routes from 'setup/routes'
import params from 'setup/config/params'
import {
  loginSetUser,
  loginSetUserLocalStorage,
} from 'modules/user/api/actions/query'
import { authorize } from 'modules/user/api/actions/mutation'

// Component
const Authorize = ({ history, location }) => {
  // state
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const dispatch = useDispatch()

  // on load
  useEffect(() => {
    process()
  }, [])

  // process
  const process = async () => {
    const query = queryString.parse(location.search)

    console.log(query)

    if (query.code && query.state) {
      setIsAuthorizing(true)

      let redirectTo = routes.pagesHome.path

      try {
        const { data } = await authorize(query)

        console.log(data.data)

        if (data && data.success && data.data) {
          const token = data.data.token
          const user = data.data.user

          dispatch(loginSetUser(token, user))

          loginSetUserLocalStorage(token, user)

          redirectTo = routes.userDashboard.path
        }
      } catch (error) {
        // console.log(error)
      } finally {
        setIsAuthorizing(false)

        history.push(redirectTo)
      }
    } else {
      history.push(routes.pagesHome.path)
    }
  }

  // render
  return (
    <>
      {/* meta */}
      <Helmet>
        <title>{`Authorizing... · ${params.site.name}`}</title>
      </Helmet>

      {/* content */}
      <section className='pages-authorize'>
        <p>Authorizing...</p>
      </section>
    </>
  )
}

export default Authorize
