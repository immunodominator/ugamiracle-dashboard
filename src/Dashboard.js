import React, { Component } from "react";
import { Row } from "react-bootstrap";
import Countdown from "react-countdown";
import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            pollingCount: 0,
            oldDonations: [],
            bigDonation: null,
        };
    }

    componentDidMount() {
        this.poll();
        this.interval = setInterval(this.poll, 5000); // Fetch new donations every 5 seconds
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    poll = async () => {
        try {
            const response = await fetch('https://events.dancemarathon.com/api/events/6212/donations?limit=5');
            const data = await response.json();
            
            this.setState((prevState) => {
                const newDonations = data.filter(d => 
                    !prevState.oldDonations.some(o => o.donationID === d.donationID) && d.amount >= 50.0
                );
                
                return {
                    donations: data,
                    oldDonations: prevState.donations,
                    bigDonation: newDonations.length > 0 ? newDonations[0] : prevState.bigDonation,
                };
            });
        } catch (error) {
            console.error("Error fetching donations:", error);
        }
    };

    render() {
        return (
            <>
                <Row className="filledRow">
                    <div className="donationTable">
                        {this.state.bigDonation && (
                            <div className="donationAlert">
                                <h1>
                                    <strong>{this.state.bigDonation.recipientName || "Someone"}</strong> just received a donation of <strong>${this.state.bigDonation.amount.toFixed(2)}</strong>!
                                </h1>
                            </div>
                        )}
                        <RecentDonations donations={this.state.donations} />
                    </div>
                </Row>
                <Row style={{ display: "inline-block" }}>
                    <div className="countdown">
                        <Countdown date={new Date("Mar 29, 2025 23:59:00")} daysInHours={true} />
                        <span style={{ padding: 0 }}> until Dance Marathon Total Reveal!</span>
                    </div>
                </Row>
            </>
        );
    }
}

export default Dashboard;
