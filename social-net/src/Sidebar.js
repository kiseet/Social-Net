import { useEffect, useState, memo, useRef } from 'react';
import SidebarChat from './SidebarChat';
import {  IconButton } from '@material-ui/core';
import { MessageRounded, People, Home, ExitToApp as LogoutOutlined, Search, GetApp, Add } from '@mui/icons-material';
import db, { auth, createTimestamp } from "./firebase";
import { useStateValue } from './StateProvider';
import { NavLink, Route, Navigate } from 'react-router-dom';
import algoliasearch from "algoliasearch";
import './Sidebar.css';
import audio from './notification.mp3'
import { AvatarGroup} from '@mui/material';

const index = algoliasearch("HGSCPXF5HH", "5dcbf917421397576df267019b9b4c87").initIndex('whatsappy-app');

function Sidebar({ chats, pwa, rooms, fetchRooms, users, fetchUsers }) {
    const [searchList, setSearchList] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [menu, setMenu] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [{ user, page, pathID }] = useStateValue();
    let history = Navigate();
    const notification = new Audio(audio);
    const prevUnreadMessages = useRef((() => {
        const data = {};
        chats.forEach(cur => cur.unreadMessages || cur.unreadMessages === 0 ? data[cur.id] = cur.unreadMessages : null);
        return data;
    })());

    var Nav;
    if (page.width > 760) {
        Nav = (props) =>
            <div className={`${props.classSelected ? "sidebar__menu--selected" : ""}`} onClick={props.click}>
                {props.children}
            </div>
    } else {
        Nav = NavLink;
    }

    async function search(e) {
        if (e) {
            document.querySelector(".sidebar__search input").blur();
            e.preventDefault();
        }
        if (page.width <= 760) {
            history.push("/search?" + searchInput);
        };
        setSearchList(null);
        if (menu !== 4) {
            setMenu(4)
        };
        const result = (await index.search(searchInput)).hits.map(cur => cur.objectID !== user.uid ? {
            ...cur,
            id: cur.photoURL ? cur.objectID > user.uid ? cur.objectID + user.uid : user.uid + cur.objectID : cur.objectID,
            userID: cur.photoURL ? cur.objectID : null
        } : null);
        //console.log(result);
        setSearchList(result);
    }

    const createChat = () => {
        const roomName = prompt("Type the name of your room");
        if (roomName) {
            db.collection("rooms").add({
                name: roomName,
                timestamp: createTimestamp(),
                lastMessage: "",
            });
        };
    };

    useEffect(() => {
        const data = {};
        chats.forEach(cur => {
            if (cur.unreadMessages || cur.unreadMessages === 0) {
                if ((cur.unreadMessages > prevUnreadMessages.current[cur.id] || !prevUnreadMessages.current[cur.id] && prevUnreadMessages.current[cur.id] !== 0) && pathID !== cur.id) {
                    notification.play();
                };
                data[cur.id] = cur.unreadMessages;
            };
        });
        prevUnreadMessages.current = data;
    }, [chats, pathID]);

    useEffect(() => {
        if (page.width <= 760 && chats && !mounted) {
            setMounted(true);
            setTimeout(() => {
                document.querySelector('.sidebar').classList.add('side');
            }, 10);
        };
    }, [chats, mounted]);

    return (
        <div className="sidebar" style={{
            minHeight: page.width <= 760 ? page.height : "auto"
        }}>
            <div className="sidebar__header">
                <div className="sidebar__header--left">
                    <AvatarGroup src={user?.photoURL} />
                    <h4>{user?.displayName} </h4>
                </div>
                <div className="sidebar__header--right">
                    <iconButtonClasses onClick={() => {
                        if (pwa) {
                            console.log("prompting the pwa event")
                            pwa.prompt()
                        } else {
                            console.log("pwa event is undefined")
                        }
                    }} >
                        <GetApp />
                    </iconButtonClasses>
                    <IconButton onClick={() => {
                        auth.signOut();
                        db.doc('/users/' + user.uid).set({ state: "offline" }, { merge: true });
                        history.replace("/chats")
                    }} >
                        <LogoutOutlined/>
                    </IconButton>

                </div>
            </div>

            <div className="sidebar__search">
                <form className="sidebar__search--container">
                    <Search />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for users or rooms"
                        type="text"
                    />
                    <button style={{ display: "none" }} type="submit" onClick={search}></button>
                </form>
            </div>

            <div className="sidebar__menu">
                <Nav
                    classSelected={menu === 1 ? true : false}
                    to="/chats"
                    click={() => setMenu(1)}
                    activeClassName="sidebar__menu--selected"
                >
                    <div className="sidebar__menu--home">
                        <Home />
                        <div className="sidebar__menu--line"></div>
                    </div>
                </Nav>
                <Nav
                    classSelected={menu === 2 ? true : false}
                    to="/rooms"
                    click={() => setMenu(2)}
                    activeClassName="sidebar__menu--selected"
                >
                    <div className="sidebar__menu--rooms">
                        <MessageRounded />
                        <div className="sidebar__menu--line"></div>
                    </div>
                </Nav>
                <Nav
                    classSelected={menu === 3 ? true : false}
                    to="/users"
                    click={() => setMenu(3)}
                    activeClassName="sidebar__menu--selected"
                >
                    <div className="sidebar__menu--users">
                        <People />
                        <div className="sidebar__menu--line"></div>
                    </div>
                </Nav>
            </div>

            {page.width <= 760 ?
                <>
                    <NavLink>
                        <Route path="/users" >
                            <SidebarChat key="users" fetchList={fetchUsers} dataList={users} title="Users" path="/users" />
                        </Route>
                        <Route path="/rooms" >
                            <SidebarChat key="rooms" fetchList={fetchRooms} dataList={rooms} title="Rooms" path="/rooms" />
                        </Route>
                        <Route path="/search">
                            <SidebarChat key="search" dataList={searchList} title="Search Result" path="/search" />
                        </Route>
                        <Route path="/chats" >
                            <SidebarChat key="chats" dataList={chats} title="Chats" path="/chats" />
                        </Route>
                    </NavLink>
                </>
                :
                menu === 1 ?
                    <SidebarChat key="chats" dataList={chats} title="Chats" />
                    : menu === 2 ?
                        <SidebarChat key="rooms" fetchList={fetchRooms} dataList={rooms} title="Rooms" />
                        : menu === 3 ?
                            <SidebarChat key="users" fetchList={fetchUsers} dataList={users} title="Users" />
                            : menu === 4 ?
                                <SidebarChat key="search" dataList={searchList} title="Search Result" />
                                : null
            }
            <div className="sidebar__chat--addRoom" onClick={createChat}>
                <IconButton >
                    <Add />
                </IconButton>
            </div>
        </div>
    );
};

export default memo(Sidebar);