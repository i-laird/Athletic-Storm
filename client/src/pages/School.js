import React, { Component } from 'react';
import {
    withRouter, Redirect
} from 'react-router-dom';
import '../common/AppHeader.css';
import logo from './football.jpeg'
import axios from 'axios';
import { Link } from "react-router-dom";
class School extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        coaches: [],
        players: [],
        logo: '',
        primaryColor: '',
        year: '2019'
    }

    descSort(){
        const sortedCoaches = [].concat(this.state.coaches).sort((a, b) => a.last_name > b.last_name ? 1 : -1);
        this.setState({ coaches: sortedCoaches });
    }

    ascSort(){
        const sortedCoaches = [].concat(this.state.coaches).sort((a, b) => a.last_name  < b.last_name ? 1 : -1);
        this.setState({ coaches: sortedCoaches });
    }

    mostRecentSort(){
        const sortedCoaches = [].concat(this.state.coaches).sort((a, b) => parseInt(a.seasons[0].year, 10)  < parseInt(b.seasons[0].year, 10) ? 1 : -1);
        this.setState({ coaches: sortedCoaches });
    }

    oldestSort(){
        const sortedCoaches = [].concat(this.state.coaches).sort((a, b) => parseInt(a.seasons[0].year, 10) > parseInt(b.seasons[0].year, 10) ? 1 : -1);
        this.setState({ coaches: sortedCoaches });
    }

    bestScoreSort(){

    }

    worstScoreSort(){

    }

    coachSort = (event) =>{
        let sortBy = event.target.value;
        console.log(event.target.value);
        if("Descending" === sortBy){
            this.descSort();
        }else if("Ascending" === sortBy){
            this.ascSort();
        }else if("Most Recent" === sortBy){
            this.mostRecentSort();
        }else if("Oldest" === sortBy){
            this.oldestSort();
        }else if("Best Score" === sortBy){
            this.bestScoreSort();
        }else if("Worst Score" === sortBy){
            this.worstScoreSort();
        }else{
            console.log("Invalid Option " + sortBy);
        }
    }

    playerYearChanged = (event) => {
        this.getPlayers(event.target.value);
    }
    componentDidMount() {
        // Get Team Color Scheme And Name From API
        if (this.props.school) {
            this.setState({ logo: this.props.school.logos[0], primaryColor: this.props.school.color, secondaryColor: this.props.school.alt_color })
        }else{
            return;
        }
        // Get List Of Coaches From API
        axios.get('https://api.collegefootballdata.com/coaches?team=' + window.location.pathname.substr(8) + '&minYear=2000')
            .then(res => {
                const coachlist = res.data;
                this.setState({ coaches: coachlist });
            });
        // Get List Of Players From API
        axios.get('https://api.collegefootballdata.com/roster?team=' + window.location.pathname.substr(8) + '&year=' + this.state.year)
            .then(res => {
                const allplayerlist = res.data;
                var playerlist = [];
                if (allplayerlist.length <= 9) {
                    this.setState({ players: res.data });
                } else {
                    console.log(allplayerlist[0]);
                    for (var x = 0; x < 7; x++) {
                        if (allplayerlist[x].first_name !== null) {
                            playerlist[x] = allplayerlist[x];
                        }
                    }
                    this.setState({ players: playerlist });
                }
            })
        
    }


    getCoachYear(coach) {
        if (coach.seasons.length === 1) {
            return coach.seasons[0].year;
        } else {
            return coach.seasons[0].year + "-" + coach.seasons[coach.seasons.length - 1].year;
        }
    }

    getCoaches() {
        return (this.state.coaches.map((coach, i) => (
            <td width="150" key={i}>
                <Link to={"/coach/" + coach.first_name + "-" + coach.last_name} style={{ color: this.state.primaryColor }} onClick={this.sendData}>
                    <center >{coach.first_name + " " + coach.last_name}
                        <br></br>
                        {this.getCoachYear(coach)}</center>
                </Link>

            </td>
        )));
    }

    getPlayers(playerYear) {
        // Get List Of Players From API
        axios.get('https://api.collegefootballdata.com/roster?team=' + window.location.pathname.substr(8) + '&year=' + playerYear)
            .then(res => {
                const allplayerlist = res.data;
                var playerlist = [];
                if (allplayerlist.length <= 9) {
                    this.setState({ players: res.data });
                } else {
                    for (var x = 0; x < 7; x++) {
                        if (allplayerlist[x].first_name !== null) {
                            playerlist[x] = allplayerlist[x];
                        }
                    }
                    this.setState({ players: playerlist });
                    this.setState({ year: playerYear });
                }
            })
    }

    render() {
        if (!this.props.school || window.location.pathname.replace('%20', ' ').substr(8) !== this.props.school.school) {
            return (<Redirect to='/' />)
        }
        return (
            <div>
                <div className="School_Info">
                    <h1 style={{ backgroundColor: this.state.primaryColor, color: "#ffffff" }} >&nbsp;{window.location.pathname.replace('%20', ' ').substr(8).toUpperCase()}</h1>
                    <img src={this.state.logo} width="100" height="100" alt="Logo" />
                </div>

                <div className="Coach_Table" >
                    <h1 style={{ backgroundColor: this.state.primaryColor, color: "#ffffff" }}>&nbsp;Coaches
                        <select style={{ float: 'right', color: this.state.primaryColor }} onChange={this.coachSort}>
                            <option value="Ascending">Ascending</option>
                            <option value="Descending">Descending</option>
                            <option value="Most Recent">Most Recent</option>
                            <option value="Oldest">Oldest</option>
                            <option value="Best Score">Best Score</option>
                            <option value="Worst Score">Worst Score</option>
                        </select>
                    </h1>
                    <table>
                        <tbody >
                            <tr>
                                {/* Get Coaches Images */}
                                {this.state.coaches.map((coach, i) => (
                                    <th key={i} width="150">
                                        <Link to={"/coach/" + coach.first_name + "-" + coach.last_name} style={{ color: this.state.primaryColor }} >
                                            <center><img src={logo} width="100" height="50" alt={`coach${coach.first_name} ${coach.last_name}`} /></center>
                                        </Link></th>
                                ))}
                            </tr>
                            <tr>
                                {/* Get Coach Name & Year */}
                                {this.getCoaches()}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="Player_Table">
                    <h1 style={{ backgroundColor: this.state.primaryColor, color: "#ffffff" }}>&nbsp;Players
                        <select style={{ float: 'right', color: this.state.primaryColor }} onChange={this.playerYearChanged}>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                        </select>
                    </h1>
                    <table className="table">
                        <thead>
                            <tr>
                                {/* Get Coaches Images */}
                                {this.state.players.map((player, i) => (
                                    <th width="150" key={i}>
                                        <Link to={`/player/${player.first_name}_${player.last_name}`} style={{ color: this.state.primaryColor }} >
                                            <center><img src={logo} width="100" height="50" alt={`${player.first_name} ${player.last_name}`} /></center>
                                        </Link>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {/* Get Coach Name & Year */}
                                {this.state.players.map((player, i) => (
                                    <td width="150" key={i}>
                                        <Link to={`/player/${player.first_name}_${player.last_name}`} style={{ color: this.state.primaryColor }} >
                                            <center >{player.first_name + " " + player.last_name}
                                                <br></br>
                                                {player.position ? player.position + " " + this.state.year : this.state.year}
                                            </center>
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(School);