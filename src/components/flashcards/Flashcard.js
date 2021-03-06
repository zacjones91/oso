import React, { Component } from "react";
import "./Flashcard.css";
import Card from "./Card";
// import DeckSelect from "./DeckSelect";
import { Form, Header, Grid } from "semantic-ui-react";
import CardManager from "../../managers/CardManager";
import DecksManager from "../../managers/DecksManager";
import SelectedDetail from "./SelectedDetail";

// this is the container for the testing portion of the app

export default class FlashcardContainer extends Component {
  state = {
    quizSelected: false,
    cards: "",
    currentCard: [],
    deckSelected: "",
    isDeckSelected: false,
    deckSelectedID: "",
    voice: 14
  };

  componentDidMount() {
    // need to get current user's voice out of props and put in state here

    for (let i = 0; i < this.props.users.length; i++) {
      if (this.props.users[i].id === this.props.currentUser) {
        // console.log(this.props.users[i].voice)
        this.setState({
          voice: this.props.users[i].voice
        });
        break;
      }
    }
  }

  // 14 is Jorge, Spain Spanish
  // if something goes wrong with user's selection, or they don't make a selection, default to 14

  // function to get random card
  getRandomCard = currentCards => {
    let card = currentCards[Math.floor(Math.random() * currentCards.length)];
    return card;
  };

  // same as getRandomCard but it sets state (needed this separate for now, can refactor later, but needed this for onClick of "next card")
  nextFlashcard = cardsInDeck => {
    let nextCard = cardsInDeck[Math.floor(Math.random() * cardsInDeck.length)];
    this.setState({
      currentCard: nextCard
    });
  };

  // handles dropdown change/selection
  // adapted from: https://stackoverflow.com/questions/51227359/how-to-retrieve-the-key-into-a-semantic-ui-react-dropdown
  handleChange = (event, data) => {
    const { value } = data;
    const { key } = data.options.find(o => o.value === value);

    // take whatever the user selected and use that to fetch cards from that deck, put them in state
    CardManager.getCardsInDeck(key).then(cards => {
      // console.log(cards);
      this.setState({
        deckSelectedID: key,
        cards: cards
      });
    });

    // fetch details about selected deck
    DecksManager.getSpecificDeck(key).then(deck => {
      // console.log(deck);
      this.setState({
        deckSelected: deck,
        isDeckSelected: true
      });
    });
  };

  // handles dropdown submit - not using, functionality moved to handleChange above
  handleDropdownSubmit = e => {
    // console.log(this.state.deckSelectedID);

    CardManager.getCardsInDeck(this.state.deckSelectedID).then(cards => {
      // console.log(cards);
      this.setState({
        cards: cards
      });
    });
  };

  // using this button to launch a quiz, AFTER user has made selection

  launchQuiz = () => {
    const currentCards = this.state.cards;

    this.setState({
      currentCard: this.getRandomCard(currentCards),
      cards: currentCards,
      quizSelected: true
    });
  };

  // sends user back to quiz selection
  backToSelection = () => {
    this.setState({
      quizSelected: false,
      deckSelected: false,
      isDeckSelected: false,
      cards: ""
    });
  };

  render() {
    // loop over decks and make a new array that is formatted to work with Semantic's dropdown

    // need two decks - run a forEach over allDecks, split out into public and private, these will be used for different dropdowns
    // declare two arrays
    let publicDecks = [];
    let privateDecks = [];

    this.props.allDecks.forEach(deck => {
      // check for decks that do NOT belong to current user and look for shared flag
      if (deck.userID !== this.props.currentUser && deck.shared === true) {
        // format it correctly, then push to array
        let newOption = {
          key: deck.id,
          text: deck.name,
          value: deck.name
        };
        publicDecks.push(newOption);
      } else if (deck.userID === this.props.currentUser) {
        let newOption = {
          key: deck.id,
          text: deck.name,
          value: deck.name
        };
        privateDecks.push(newOption);
      }
    });

    if (this.state.quizSelected) {
      return (
        <React.Fragment>
          <Card
            cards={this.state.cards}
            currentCard={this.state.currentCard}
            nextFlashcard={this.nextFlashcard}
            backToSelection={this.backToSelection}
            userVoice={this.state.voice}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Header as="h1">Select Your Deck </Header>
          <br />
          <Grid>
            <Grid.Column width={8}>
              <div>
                <Header as="h3">
                  Which set of cards would you like to review?
                </Header>
              </div>
              <br />
              <Form.Select
                options={publicDecks}
                placeholder="Shared Decks"
                id="deckSelected"
                name="deckSelected"
                onChange={this.handleChange}
                // label="Public Decks"
              />
              <br />
              <Form.Select
                options={privateDecks}
                placeholder="My Decks"
                name="privateDeckSelected"
                onChange={this.handleChange}
                // label="My Decks"
              />
              <br />
            </Grid.Column>
            <Grid.Column width={4}>
              <div>
                <Header as="h3">Deck details</Header>
                <SelectedDetail
                  deckSelected={this.state.deckSelected}
                  cards={this.state.cards}
                  isDeckSelected={this.state.isDeckSelected}
                  launchQuiz={this.launchQuiz}
                />
              </div>
            </Grid.Column>
          </Grid>
        </React.Fragment>
      );
    }
  }
}
