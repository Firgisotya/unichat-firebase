import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine } from 'react-chat-engine'

import { useAuth } from "../context/AuthContext"

import { auth } from "../firebase"

export default function Chats() {
  const didMountRef = useRef(false)
  const [ loading, setLoading ] = useState(true)
  const { user } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    await auth.signOut()
    history.push("/")
  }

  async function getFile(url) {
    try {
        let response = await fetch(url);
        let data = await response.blob();
        return new File([data], "test.jpg", { type: 'image/jpeg' });
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
      

    
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      if (!user || user === null) {
        history.push("/")
        return
      }
      
      // Get-or-Create should be in a Firebase Function
      axios.get(
        'https://api.chatengine.io/users/me/',
        { headers: { 
          "project-id": '051fb3b2-81d7-4339-a35e-0116cbcbec70',
          "user-name": user.email,
          "user-secret": user.uid
        }}
      )

      .then(() => setLoading(false))

      .catch(e => {
        let formdata = new FormData()
        formdata.append('email', user.email)
        formdata.append('username', user.email)
        formdata.append('secret', user.uid)

        getFile(user.photoURL)
        .then(avatar => {
            if (avatar) {
              formdata.append('avatar', avatar, avatar.name);
              
              axios.post(
                'https://api.chatengine.io/users/',
                formdata,
                { headers: { "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY }}
              )
              .then(() => setLoading(false))
              .catch(e => console.log('Error:', e.response));
            } else {
              console.log('Avatar is undefined');
            }
          }
        )
        .catch(error => console.log('Error:', error));
      })
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
  }, [user, history])
  

  if (!user || loading) return <div />

  return (
    <div className='chats-page'>
      <div className='nav-bar'>
        <div className='logo-tab'>
          Unichat
        </div>

        <div onClick={handleLogout} className='logout-tab'>
          Logout
        </div>
      </div>

      <ChatEngine 
        height='calc(100vh - 66px)'
        projectID='051fb3b2-81d7-4339-a35e-0116cbcbec70'
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  )
}