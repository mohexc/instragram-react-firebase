import { Button, Col, message, Row } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import "./App.less"
import Post from "./components/Post"
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { db, auth } from './configs/firebase'

const App = () => {
  const [posts, setPosts] = useState([])
  const signUp = useRef()
  const signIn = useRef()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => authUser ? setUser(authUser) : setUser(null))
    return () => unsubscribe()
    // eslint-disable-next-line 
  }, [])

  useEffect(() => {
    db
      .collection('posts')
      .onSnapshot(snapshots => setPosts(snapshots.docs.map(doc => (
        { ...doc.data(), id: doc.id }
      ))))
  }, [user])

  const logout = async () => {
    const result = await auth.signOut()
      .then(res => res)
      .catch(e => message.error(e.message))
    return result
  }

  return (
    <div className="">
      <div className="app-header">
        <SignUp ref={signUp} />
        <SignIn ref={signIn} />
        <Row>
          <Col span={18}>
            <img
              className="app-header-image"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt=""
              height={32}
            />
          </Col>
          <Col span={6}>
            <Row justify="end">
              {user
                ? <Button onClick={logout}>Logout</Button>
                : (
                  <React.Fragment>
                    <Button onClick={() => signUp.current.showModal()}>SiginUp</Button>
                    <Button style={{ marginLeft: "1rem" }} onClick={() => signIn.current.showModal()}>SiginIn</Button>
                  </React.Fragment>
                )
              }

            </Row>
          </Col>
        </Row>
      </div>
      {
        posts.map(post => <Post key={post.id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)
      }

    </div>
  )
}

export default App
