import React, { useState, useEffect } from "react";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import { Button, makeStyles, Input, Typography } from "@material-ui/core";
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser)
      }else{
        setUser(null)
      }
    })

    return () =>{
      unsubscribe();
    }
  },[user,username])

  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser=>{
        return authUser.user.updateProfile(
          {
            displayName:username,
          }
        )
      })
      .catch((error) => alert(error.message));
    setUsername('')
    setEmail('')
    setPassword('')
    setOpen(false);
  };

  const signIn = (e) =>{
    e.preventDefault()

    auth.signInWithEmailAndPassword(email,password)
    .catch(error => alert(error.message))

    setEmail('')
    setPassword('')
    setOpenSignin(false)
  }

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="ig_logo"
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="user name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <Button type="submit" onClick={signUp}>
            Sign Up
          </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignin} onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="ig_logo"
            />
          </center>
          <form className="app__signup">
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <Button type="submit" onClick={signIn}>
            Sign In
          </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__header__logo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
        <div className='app__header__Logout'>
        <Typography variant="body1" color='textSecondary' align='left' component="h2">
          {user.displayName}
        </Typography>
        <Button type="submit" onClick={(e)=> auth.signOut()}>
                Log out
              </Button>
        </div>):(
                <div className='app__loginContainer'>
                <Button onClick={() => setOpenSignin(true)}>Login</Button>
                <Button onClick={() => setOpen(true)}>Sign up</Button>
                </div>
              )}
      </div>
      
      <div className='app__posts'>
        <div className='app__post__left'>
          {posts.map(({ id, post }) => (
          <Post
          key={id}
          postId={id}
          igUser={user}
          userName={post.username}
          caption={post.caption}
          imgUrl={post.imgUrl}
          />
          ))}
      </div>
      <div className='app__post__right'>
        <Typography variant="button" display='block' color='textSecondary' align='left' component="h2">
            Instagram Clone Creator
        </Typography>
        <InstagramEmbed
        url='https://www.instagram.com/p/B8PBuFFhmo0/?utm_source=ig_web_copy_link'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
        />
      </div>
      </div>

      {/*optional "?"*/}
      {user?.displayName ? 
      (<ImageUpload username={user.displayName}/>)
      :(<h3>You need to login.</h3>)}
    </div>
  );
}

export default App;

// repeat at 3:12:09
