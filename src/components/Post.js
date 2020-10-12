import { Avatar, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { db, timestamp } from '../configs/firebase'
import './Post.less'

// main component
const Post = ({ postId, username, caption, imageUrl, user }) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState()
    const upperCase = username.toUpperCase()
    const charAt = upperCase.charAt(0)

    useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection('comments')
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => ({
                        ...doc.data(), id: doc.id
                    })))
                })
        }
        return () => unsubscribe()
    }, [postId])

    const postComment = async (e) => {
        e.preventDefault()
        const result = await db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                comment: comment,
                username: user.displayName ? user.displayName : user.email,
                timestamp: timestamp()
            }).then(res => res).catch(e => console.log(e.message))
        setComment('')
        debugger
        return result
    }
    return (
        <div className="post">
            <div className="post-header">
                <Avatar style={{ marginRight: "10px" }} size="64px">{charAt}</Avatar>
                <h3 style={{ marginTop: 7 }}>{username}</h3>
            </div>
            <h4 className="post-text">{caption}</h4>
            {imageUrl ? <img className="post-image" alt="post" src={imageUrl} /> : null}
            {comments &&
                comments.map(comment => {
                    return (
                        <React.Fragment>
                            <p style={{ marginLeft: '1.5rem' }}>
                                <strong>{comment.username} : </strong>
                                <span>{comment.comment}</span>
                            </p>
                        </React.Fragment>
                    )
                }
                )}
            {user &&
                <form className="post-comment-box">
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add comment"
                        className="post-input"
                        type="text"
                    />
                    <button
                        onClick={postComment}
                        disabled={!comment}
                        className={comment ? "post-btn-active" : "post-btn"}
                        type="submit">
                        Post
                    </button>
                </form>
            }

        </div>
    )
}

export default Post
