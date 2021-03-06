import React, { Component } from "react";
import { Header, Container, Message, Grid } from "semantic-ui-react";
import "./Profile.css";
import spain from "../../images/spain.png";
import mexico from "../../images/mexico.png";

export default class UserProfile extends Component {
  // this function makes an object that is then patched to the server - updates the current user's voice selection
  // is also refetches users in app views and resets state
  onClick = number => {
    let url = `http://localhost:5002/user/${this.props.currentUser}`;
    // make the payload
    const voiceToPatch = {
      id: this.props.currentUser,
      voice: parseInt(number)
    };

    // console.log(voiceToPatch);

    this.props.updateVoice(voiceToPatch, url);
  };

  render() {
    // find the logged in user's info
    let currentUserInfo = this.props.users.filter(user => {
      return user.id === this.props.currentUser;
    });

    // console.log(currentUserInfo[0]);

    // switch statement to show user what voice they've selected
    let currentVoiceSelection = "";

    switch (currentUserInfo[0].voice) {
      case 14:
        currentVoiceSelection = "Jorge";
        break;

      case 15:
        currentVoiceSelection = "Juan";
        break;

      case 31:
        currentVoiceSelection = "Paulina";
        break;

      case 29:
        currentVoiceSelection = "Monica";
        break;
    }

    return (
      <React.Fragment>
        <Container textAlign="center">
          <Header as="h1">Your Profile</Header>
          <br />
          <Header as="h3"> {currentUserInfo[0].username}</Header>
          <Message>
            <Header as="h5">Select Your Voice</Header>
            <p className="currentVoice">
              Current selection: {currentVoiceSelection}
              {/* {currentUserInfo[0].voice} */}
              {/* refactor this to pull from state, currently it lags behind */}
            </p>
            <br />
            <Grid>
              <br />
              <Grid.Column width={4}>
                <div className="voice-option">
                  <img
                    src={spain}
                    alt="spain"
                    className="image"
                    id="14"
                    onClick={() => {
                      this.onClick(14);
                    }}
                  />
                  <br />
                  Jorge - Spain
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <div className="voice-option">
                  <img
                    src={mexico}
                    alt="mexico"
                    className="image"
                    onClick={() => {
                      this.onClick(15);
                    }}
                  />
                  <br />
                  Juan - Mexico
                </div>
              </Grid.Column>

              <Grid.Column width={4}>
                <div className="voice-option">
                  <img
                    src={mexico}
                    alt="mexico"
                    className="image"
                    onClick={() => {
                      this.onClick(31);
                    }}
                  />
                  <br />
                  Paulina - Mexico
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                <div className="voice-option">
                  <img
                    src={spain}
                    alt="spain"
                    className="image"
                    onClick={() => {
                      this.onClick(29);
                    }}
                  />
                  <br />
                  Monica - Spain{" "}
                </div>
              </Grid.Column>
            </Grid>
          </Message>
        </Container>
      </React.Fragment>
    );
  }
}
