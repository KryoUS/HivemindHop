import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
import axios from 'axios';

let socket = '';

class Nav extends Component {
    constructor() {
        super();

        this.state = {
            test: 'A',
            room: '',
            members: []
        }
    }

    componentDidMount = () => {
        //Move all of this to an API Response
        socket = openSocket('http://localhost:3060');
        socket.on('updateState', data => {
            console.log(data);
            this.setState({ test: data });
        });
        socket.on('members', members => this.setState({ members: members }));
        socket.on('removeMember', member => {
            let memArray = this.state.members.slice().filter(name => name !== member);
            this.setState({ members: memArray });
        })
    }

    //Best function N.A.
    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        })
    }

    //Helping to understand Socket, Rooms, and Emits
    socketToggle = () => {
        this.state.test === 'A' ? socket.emit('updateState', 'B') : socket.emit('updateState', 'A');
    }

    //The following two functions should be moved to an API Call where the socket.id is sent as a query param
    socketCreateRoom = () => {
        socket.emit('enterRoom', socket.id);
        this.setState({ room: socket.id });
    }

    socketJoinRoom = () => {
        socket.emit('enterRoom', this.state.room);
    }

    //Function should remain as is or we can let the user closing the tab do it
    socketLeaveRoom = () => {
        socket.emit('leaveRoom', this.state.room);
        this.setState({ room: '', members: [] });
    }

    render(){
        return(
            <div>
                <h1>Nav</h1>
                <div>{this.state.test}</div>
                <div>
                    <button onClick={() => this.socketToggle()} >Update State</button>
                    <div>Room ID: {this.state.room ? this.state.room : 'Create or Join a Room' }</div>
                    {
                        this.state.room === '' && <button onClick={() => this.socketCreateRoom()} >Create a Room</button>
                    }
                    {
                        this.state.members.length === 0 && <div>
                            <input name="room" type="text" placeholder="Room ID" value={this.state.room} onChange={this.handleChange} />
                            <button onClick={() => this.socketJoinRoom(this.state.room)} >Join a Room</button>
                        </div>
                    }                    
                    {
                        this.state.room !== '' && <button onClick={() => this.socketLeaveRoom()}>Leave Room</button>
                    }
                    <div>
                        {
                            this.state.members.map((name, i) => {
                                return <div key={name[i]}>{name}</div>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Nav