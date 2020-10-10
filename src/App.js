import React, { useState } from 'react'
import "./App.less"
import Post from "./components/Post"

const App = () => {
  const [posts, setPosts] = useState([
    {
      username: 'matong',
      caption: "Ha Ha",
      imageUrl: "https://source.unsplash.com/random/900x900"
    },
    {
      username: 'HonHon',
      caption: "Wow it work",
      imageUrl: "https://source.unsplash.com/random/1600x700"
    },
    {
      username: 'Tong',
      caption: "DatAl battern go go",
      imageUrl: "https://source.unsplash.com/random/900x600"
    },
  ])

  return (
    <div className="">
      <div className="app-header">
        <img
          className="app-header-image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
          height={32}
        />
      </div>
      {
        posts.map(post => <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)
      }

    </div>
  )
}

export default App
