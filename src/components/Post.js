import { Avatar } from 'antd'
import React from 'react'
import './Post.less'

// main component
const Post = ({ username, caption, imageUrl }) => {
    const upperCase = username.toUpperCase()
    const charAt = upperCase.charAt(0)
    return (
        <div className="post">
            <div className="post-header">
                <Avatar style={{ marginRight: "10px" }} size="64px">
                    {charAt}
                </Avatar>
                <h3 style={{ marginTop: 7 }}>{username}</h3>
            </div>

            <img className="post-image" alt="post" src={imageUrl} />

            <h4 className="post-text">
                <strong>{username}</strong> : {caption}
            </h4>
            {/* username + caption */}
        </div>
    )
}

export default Post
