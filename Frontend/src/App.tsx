import React, { useContext , } from 'react';
import { FunctionComponent, useEffect, useState , useRef} from "react";
import Sketch  from "react-p5";
import p5Types from "p5";
import { io, Socket } from "socket.io-client";
import {GameState} from "./components/Ball"
import p5 from 'p5';
import {Paddle, Lobby, MessageInput} from "./components/Lobby"
import logo from './logo.svg';
import  SketchPong  from './components/My_sketch';
import  Spectator  from './components/spectator_mod';
import  Homee  from './pages/home';

import  Login  from './pages/login';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Watching from './pages/watch';
import Spect from './components/spectator';
import Chat from './components/Chat';
import ProfileUp from './pages/ok';
import Main_chat from './components/main_chat';
import { ChatContext } from './Contexts/ChatContext';
import Nono from './components/message';
import { Dashboard, Home } from './components/souhail';
import  History  from './components/history';
import { BiHeart } from 'react-icons/bi'
import axios from 'axios';
import { game_socket_context, main_socket_context } from './components/sockets';
import { main_user_context} from './components/my_user_data';
import Profile from './components/Profile';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'



interface props
{
  socket_ids : Array<string>;
  user_id : string;
  username: string;
  user_status : string;
}

interface UserStatus {
  ON: 'ON',
  OFF: 'OFF',
  INGAME: 'INGAME',
  INQUEUE: 'INQUEUE'
};

interface Achievement {
  GREAT_WIRATE: 'GREAT_WIRATE',
  LEGEND_WIRATE: 'LEGEND_WIRATE',
  DECENT_WIRATE: 'DECENT_WIRATE',
  GREAT_LOSER: 'GREAT_LOSER',
  FIVE_WIN_STREAK: 'FIVE_WIN_STREAK',
  TEN_WIN_STREAK: 'TEN_WIN_STREAK',
  GREAT_AVATAR: 'GREAT_AVATAR',
  COMMUNICATOR: 'COMMUNICATOR'
};

interface user_info {
  id: string
  full_name: string
  username: string
  avatar: string
  avatar_key: string | null
  is_two_fa_enable: boolean
  two_fa_code: string | null
  email: string
  //status: UserStatus
  win: number
  lose: number
  score: number
  win_streak: number
 // achievements: Achievement[]
}

function Game_invite(props: {data : user_info}) {
  
  const userinho = useRef(null as null | user_info);
  const gameSocket = useContext(game_socket_context);
  userinho.current = props.data;
  const navigate = useNavigate();
  
  const socket = useRef(null as null | Socket);
  const gameState = useRef(null as null | GameState);
  console.log("amalk");
  const accept = (e : any)=>{
    navigate("/game/4");
  }

  function Decline () {
    console.log("WA QAWAAAADA HADI1");

    socket.current = io("http://10.12.2.1:4000", {
      withCredentials: true,
    }).on("connect", () => {

      socket.current?.on("queue_status", (data: GameState) => {
        gameState.current = data;
      });
      socket.current?.emit("invite_queue", { mode: 4, state: 0});
      console.log("sir gah thawa layrhm bak")
    });


  };
  return (
    <div className='w-full h-full'>
        <div className='avatar w-1/6 justify-center items-center mx-auto text-white'>
          <img className='rounded-full' src={props.data.avatar}/>
        </div>
        <div className='data text-center text-white'>
            <div className=' name'>
              {props.data.username}
            </div>
            <div className='msg text-center'>
              Is challenging you.:
            </div>
        </div>
        <div className='buttons text-center '>
          <button className='px-5  mx-6 bg-green-600 rounded-full text-black'  onClick={(e)=>{accept(e)}}>Accept</button> 
          <button  className='px-5 bg-red-600 rounded-full text-black' onClick={(e)=>{Decline()}}>Decline</button> 
        </div>
    </div>
  )
}


const game_link = (data : user_info) => (
  <div className="justify-center align-center ">
        <Game_invite data={data}/>
  </div>
);

function App() {

  const main_socket = useContext(main_socket_context);
  
  const User = useContext(main_user_context);
  //const [User_info, SetUser_info] = useState<user_info>({});

  const userinho = useRef(null as null | user_info);

  const propsinho = useRef(null as null | props);



  useEffect(() => {


      main_socket.on("game_invite", (data: user_info) => {
        
       // alert("Player : " +data+" has invited you to a game habibi");
 

          const notify = () =>{ 
                toast(game_link(data) , 
                {
                  // 
                });
              // toast("Player "+userinho.current.username + " Has invited you to a game")
            }
          notify();
       
        
      })
      console.log("Heeere brb");
      //main_socket.removeListener("game_invite");
  });

  return (
  <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Dashboard/>} >
        <Route index element= { <Home/> } />
        </Route>
        
        <Route path='/game/*' element={<SketchPong/>} />
        <Route path='/watch/*' element={<Spectator/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/play' element={<Homee/>} />
        <Route path='/history' element={<History/>} />
       
        <Route path="/profile/*" element={<Profile/>} />

        <Route path='/watching' element={<Watching/>} />
        <Route path='/spect' element={<Spect/>} />
        <Route path='/chat' element={<Chat/>} />
        {/* <Route path='/profile' element={<ProfileUp/>} /> */}
        <Route path='/main_chat' element={<Main_chat/>} />
        <Route path='/nono' element={<Nono/>} />
        
      </Routes>
      
  </BrowserRouter>)

}
  
export default App;

