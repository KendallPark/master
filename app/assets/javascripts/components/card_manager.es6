var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardManager extends React.Component {
  constructor(props) {
    super(props);
    var items = _.map(this.props.cards, (card, i) => ({ card: card,
                                                        key: card.id,
                                                        flipped: false,
                                                        filtered: false }) );
    this.state = {
      showModal: false,
      newCardTags: [],
      items: items,
      edit: null,
    };
  }

  flip(currentFlip, cardIndex, e) {
    var toChange = {};
    toChange[cardIndex] = { flipped: { $set: !currentFlip } };
    var newItems = React.addons.update(this.state.items, toChange);
    this.setState( { items: newItems });
  }

  newCard() {
    this.setState( { showModal: true } );
  }

  close() {
    this.setState( { showModal: false, edit: null});
  }

  onFilter(e) {
    var toChange = {};
    var search = new RegExp(e.target.value, 'i');
    _.each(this.state.items, function(item, i){
      var result = _.filter(item.card.tags, tag => (!!tag.match(search)));
      toChange[i] = { filtered: { $set: !(result.length > 0) } };
    });
    var newItems = React.addons.update(this.state.items, toChange);
    this.setState( { items: newItems });
  }

  save(front, back, tags, frontImage, backImage) {
    var formData = new FormData();
    formData.append("card[front]", front);
    formData.append("card[back]", back);
    if(frontImage) {
      formData.append("card[front_image]", frontImage);
    }
    if(backImage){
      formData.append("card[back_image]", backImage);
    }
    formData.append("card[tag_list][]", tags);
    $.ajax({
      type: "POST",
      url: `/api/v1/cards`,
      processData: false,
      contentType: false,
      data: formData,
      success: function(card) {
        var newCardsArray = this.state.items.slice();
        newCardsArray.unshift({ card: card,
                                key: card.id,
                                flipped: false,
                                originalIndex: this.state.items.length,
                                filtered: false });
        this.setState({items: newCardsArray, newCardTags: card.tags});
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  update(front, back, tags, frontImage, backImage) {
    var formData = new FormData();
    formData.append("card[front]", front);
    formData.append("card[back]", back);
    if(frontImage) {
      formData.append("card[front_image]", frontImage);
    }
    if(backImage){
      formData.append("card[back_image]", backImage);
    }
    formData.append("card[tag_list][]", tags);
    $.ajax({
      type: "PATCH",
      url: `/api/v1/cards/${this.state.edit.id}`,
      processData: false,
      contentType: false,
      data: formData,
      success: function(card) {
        var item = _.find(this.state.items, { key: card.id });
        item.card = card;
        this.setState({items: this.state.items});
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  editCard(card) {
    this.setState({ edit: card, showModal: true, editCardTags: card.tags.toString()  });
  }

  deleteCard(cardId) {
    $.ajax({
      type: "DELETE",
      url: `/api/v1/cards/${cardId}`,
      success: function() {
        var index = _.findIndex(this.state.items, { key: cardId });
        if(index > -1) {
          var newState = React.addons.update(this.state.items, { $splice: [[index, 1]] });
          this.setState({items: newState});
        }
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  render() {
    var modalInstance;
    if (this.state.edit === null) {
      modalInstance = (<CardEditor  key="new_card"
                                    mode="new"
                                    onSave={this.save.bind(this)}
                                    onClose={this.close.bind(this)}
                                    show={this.state.showModal}
                                    defaultTags={this.state.newCardTags} />);
    } else {
      modalInstance = (<CardEditor  key="edit_card"
                                    mode="edit"
                                    onSave={this.update.bind(this)}
                                    onClose={this.close.bind(this)}
                                    show={this.state.showModal}
                                    card={this.state.edit}
                                    cardId={this.state.edit.id} />);
    }
    var flipCardDisplay = (
      <FlipCardDisplay  onDoubleClick={this.flip.bind(this)}
                        onDelete={this.deleteCard.bind(this)}
                        onEdit={this.editCard.bind(this)}
                        />
    );
    return (
      <div>
        <div id="manager_header" className="row">
          <div className="col-md-3">
          <Button id="new_card_button" onClick={this.newCard.bind(this)}>New Card</Button>
          </div>
          <div className="col-md-9">
          <Input
            type='text'
            placeholder='search'
            ref='search-cards'
            onChange={this.onFilter.bind(this)} />
          </div>
        </div>
        {modalInstance}
        <div id="manager_body">
          <AbsoluteGrid items={this.state.items}
                        displayObject={flipCardDisplay}
                        filterProp="filtered"
                        itemWidth={250}
                        itemHeight={250 * 0.716}
                        responsive={true} />
        </div>
      </div>
    );
  }
}
