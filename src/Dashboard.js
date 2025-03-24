import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            donations: [],
            pollingCount: 0,
            delay: 2000,
            teamLeaders: [],
            oldDonations: [],
            bigDonation: null
        }

    }

    componentDidMount() {
    this.interval = setInterval(this.poll, this.state.delay); 
    this.poll();  
}
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

poll = () => {
    fetch('https://events.dancemarathon.com/api/events/6212/donations?limit=5')
        .then(response => response.json())
        .then(data => {
            this.setState(prevState => {
                const oldDonationIDs = prevState.donations.map(o => o.donationID);
                
                let newBigDonation = null;
                data.forEach(d => {
                    if (!oldDonationIDs.includes(d.donationID) && d.amount >= 50.0) {
                        newBigDonation = d;
                    }
                });

                return {
                    donations: data,
                    oldDonations: prevState.donations, // Keep track of previous donations
                    bigDonation: newBigDonation
                };
            }, () => {
                if (this.state.bigDonation) {
                    document.getElementById('donationAlert').classList.remove("donationAlertHidden");
                    this.start();
                }
            });
        })
        .catch(error => console.error("Error fetching donations:", error));
};

            });
    }

start() {
    setTimeout(() => {
        document.getElementById('donationAlert').classList.add("donationAlertHidden");
    }, 8000);
}

    render(){
        return <><Row className="filledRow">
            <div className="donationTable">
                <div className="donationAlert donationAlertHidden" id="donationAlert">
                    <h1><strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> just received a donation of <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!</h1>
                </div>
                <RecentDonations donations={this.state.donations}/>
            </div>
        </Row>
        <Row style={{display: "inline-block"}}>
            <div className="countdown">
             
                <Countdown date={new Date("Mar 29, 2025 23:59:00")} daysInHours={true}/>
                <span style={{padding: 0}}> until Dance Marathon Total Reveal!</span>
               
            </div>
        </Row>
        {/* <Row>
            <div className="">
                <Leaderboard title={"Test"} leaders={this.state.teamLeaders}/>
            </div>
        </Row>*/}</>
    }
}

export default Dashboard;
