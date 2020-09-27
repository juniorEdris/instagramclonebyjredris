import React,{useState} from 'react'
import {Button, Input} from "@material-ui/core"
import {db,storage} from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    // const [url, setUrl] = useState()
    const [progress, setProgress] = useState(0)

    const handleChange = e =>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = e =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            err => {
                console.log(err);
                alert(err.message)
            },
            ()=>{
            storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    db.collection('posts').add(
                        {
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imgUrl:url,
                            username:username
                        }
                    )
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }
    return (
        <div className='image__upload'>
            <progress 
            className="image__progress"
            value={progress} max='100'/>
            <Input 
            placeholder='enter caption'
            type='text'
            onChange={e=> setCaption(e.target.value)}
            value={caption}
            />
            <input 
            type='file'
            onChange={handleChange}
            />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
