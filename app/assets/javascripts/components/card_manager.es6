var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardManager extends React.Component {
  constructor(props) {
    super(props);
    var flippedById = _.mapValues(_.indexBy(this.props.cards, 'id'), d => false);
    this.state = {
      flippedById: flippedById,
      cards: this.props.cards || [],
      showModal: false,
      newCardTags: ""
    };
  }

  toggle(id, e) {
    var newFlipped = _.clone(this.state.flippedById);
    newFlipped[id] = !this.state.flippedById[id];
    this.setState( { flippedById: newFlipped } );
  }

  newCard() {
    this.setState( { showModal: true } );
  }

  close() {
    this.setState( { showModal: false });
  }

  save() {
    console.log(this.refs);
    var front = this.refs.front.getValue()
    var back = this.refs.back.getValue()
    var tags = this.state.newCardTags.split(",")
    $.ajax({
      type: "POST",
      url: `/api/v1/cards`,
      data: {
        card: {
          front: front,
          back: back,
          tag_list: tags }
      },
      success: function(card) {
        var newCardsArray = this.state.cards.slice();
        newCardsArray.push(card);
        this.setState({cards: newCardsArray});
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  onTagInputChange(tags) {
    this.setState( { newCardTags: tags } );
  }

  editCard() {
    console.log("edit");
  }

  deleteCard() {
    console.log("delete");
  }

  getNewCardModal() {
    return (
      <Modal id="new_card_modal" show={this.state.showModal} onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input ref="front" type='textarea' label='Front' placeholder='' />
        </Modal.Body>
        <Modal.Body>
          <Input ref="back" type='textarea' label='Back' placeholder='' />
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-content row">
            <Select
              ref="tags"
              className="col-xs-10"
              value={this.state.newCardTags}
              delimiter=","
              multi={true}
              allowCreate={true}
              placeholder="tags"
              options={[]}
              onChange={this.onTagInputChange.bind(this)} />
            <Button className="col-xs-2" onClick={this.save.bind(this)}>Add Card</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    var modalInstance = this.getNewCardModal();
    var flipcards = [];
    for (var card of this.state.cards) {
      var tags = [];
      for (var tag of card.tags) {
        tags.push(
          <a href="#" className="btn btn-default btn-xs tag">{tag}</a>
        );
      }
      flipcards.push(
        <FlipCard key={card.id}
                  disabled={true}
                  flipped={this.state.flippedById[card.id]}
                  onDoubleClick={this.toggle.bind(this, card.id)}
                  bootstrap={true} >
          <div>
            <div className="edit-controls">
              <a href="#" className="left" onClick={this.deleteCard.bind(this, card.id)}><i className="fa fa-trash-o"></i></a>
              <a href="#" className="right" onClick={this.editCard.bind(this, card.id)}><i className="fa fa-pencil"></i></a>
            </div>
            <div>
              <p>{card.front}</p>
            </div>
            <div>{tags}</div>
          </div>

          <div>
            <div className="panel-heading">Panel heading without title</div>
            <p>{card.back}</p>
          </div>
        </FlipCard>
      );
    }
    return (
      <div>
        <Button onClick={this.newCard.bind(this)}>New Card</Button>
        {modalInstance}
        {flipcards}
      </div>
    );
  }
}

class SampleDisplay extends BaseDisplayObject{

  render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);
    return <div style={itemStyle}></div>;
  }
}
