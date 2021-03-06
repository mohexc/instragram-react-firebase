import { Button, Col, message, Row } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import React, { useEffect, useRef, useState } from 'react'
import "./App.less"
import CreatePost from './components/CreatePost'
import Post from "./components/Post"
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { db, auth } from './configs/firebase'

const App = () => {
  const [posts, setPosts] = useState([])
  const signUpRef = useRef()
  const signInRef = useRef()
  const createPostRef = useRef()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => authUser ? setUser(authUser) : setUser(null))
    return () => unsubscribe()
    // eslint-disable-next-line 
  }, [])

  useEffect(() => {
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
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
        <SignUp ref={signUpRef} />
        <SignIn ref={signInRef} />
        <CreatePost user={user} ref={createPostRef} />
        <Row>
          <Col span={8}>
            <img
              className="app-header-image"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt=""
              height={32}
            />
          </Col>
          <Col span={16}>
            <Row justify="end" align="middle">
              {user
                ? (
                  <React.Fragment>
                    {user
                      ? user.displayName
                        ? <span style={{ marginRight: "2rem" }} >{user.displayName}</span>
                        : <span style={{ marginRight: "2rem" }} >{user.email}</span>
                      : <span style={{ marginRight: "2rem" }} >guest</span>
                    }
                    <Button shape="round" onClick={logout}>Logout</Button>
                  </React.Fragment>
                )
                : (
                  <React.Fragment>
                    <Button shape="round" onClick={() => signUpRef.current.showModal()}>SiginUp</Button>
                    <Button shape="round" style={{ marginLeft: "1rem" }} onClick={() => signInRef.current.showModal()}>SiginIn</Button>
                  </React.Fragment>
                )
              }
            </Row>
          </Col>
        </Row>
      </div>
      <Row justify="center">
        <Col xs={23} md={23} lg={16}>
          {user
            ? <div className="create-post">
              <Avatar style={{ marginRight: "1rem", marginLeft: "0.7rem" }}>{user.displayName ? user.displayName : "User"} </Avatar>
              <Button
                style={{ width: "100%" }}
                shape="round"
                onClick={() => createPostRef.current.showModal(user)}>
                What's on your mind ?
              </Button>
            </div>

            : <div style={{ marginTop: '5rem' }}></div>}
          {posts.map((post) => {
            return <Post
              key={post.id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              postId={post.id}
            />
          })}
        </Col>

      </Row>
    </div >
  )
}

export default App
