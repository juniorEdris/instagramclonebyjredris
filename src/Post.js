import React,{ useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import './Post.css'
import { db } from './firebase'
import { Button, Input } from '@material-ui/core'
import firebase from 'firebase'

function Post({postId,userName,igUser,imgUrl,caption}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db.collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp','asc')
            .onSnapshot(snapshot =>{
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }

        return ()=>{
            unsubscribe()
        }
    }, [postId])

    const postComment = (e)=>{
        e.preventDefault();
        db.collection('posts')
        .doc(postId)
        .collection('comments')
        .add(
            {
                comment:comment,
                username:igUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }
        )
        setComment('')

    }

    return (
        <div className='post'>
            <div className='post__header'>
                <Avatar
                className='post__avatar'
                alt={userName}
                src='/static/images/avatar/1.jpg'
                />
                <h3>{userName}</h3>
            </div>
            <img 
            className='post__image'
            src={imgUrl}
            alt={userName}/>
            <h4 className='post__text'> <strong>{userName}</strong> : {caption}</h4>
            
            
            <div className='post__comment'>
            {
                comments.map(comment=>(
                    <p>
                        <strong>{comment.username}</strong> : {comment.comment}
                    </p>
                ))
            }
            </div>

            {igUser &&(
                <form className='post__commentbox' >
                    <Input
                    className='post__input'
                    type='text'
                    placeholder='type a comment'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    />
                    <Button
                    className='post__btn'
                    disabled={!comment}
                    type='submit'
                    onClick={postComment}
                    >post</Button>
                </form>
            )}
            
        </div>
    )
}

export default Post
