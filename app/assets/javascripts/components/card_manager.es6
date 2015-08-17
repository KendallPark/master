var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardManager extends React.Component {
  constructor(props) {
    super(props);
    var flippedById = _.mapValues(_.indexBy(this.props.cards, 'id'), d => false);
    var items = _.map(this.props.cards, (card, i) => ({ card: card,
                                                        key: card.id,
                                                        flipped: false,
                                                        originalIndex: i,
                                                        filtered: false }) );
    this.state = {
      flippedById: flippedById,
      showModal: false,
      newCardTags: "",
      editCardTags: null,
      items: items,
      new: {
        front: "",
        back: "",
        tags: [],
      },
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
    this.setState( { showModal: false, edit: null, editCardTags: null });
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

  save() {
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
        var newCardsArray = this.state.items.slice();
        newCardsArray.push({card: card,
                            key: card.id,
                            flipped: false,
                            originalIndex: this.state.items.length,
                            filtered: false });
        this.setState({items: newCardsArray});
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  update() {
    var front = this.refs.front.getValue()
    var back = this.refs.back.getValue()
    var tags = this.state.editCardTags.split(",")
    $.ajax({
      type: "PATCH",
      url: `/api/v1/cards/${this.state.edit.id}`,
      data: {
        card: {
          front: front,
          back: back,
          tag_list: tags }
      },
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

  onTagInputChange(tags) {
    this.setState( { newCardTags: tags } );
  }

  onEditTagInputChange(tags) {
    this.setState( { editCardTags: tags } );
  }

  editCard(card) {
    this.setState({ edit: card, showModal: true, editCardTags: card.tags.toString()  });
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
              onChange={this.onEditTagInputChange.bind(this)} />
            <Button className="col-xs-2" onClick={this.save.bind(this)}>Add Card</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  getEditCardModal() {
    return (
      <Modal id="edit_card_modal" show={this.state.showModal} onHide={this.close.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input ref="front" type='textarea' label='Front' placeholder='' defaultValue={this.state.edit.front} />
        </Modal.Body>
        <Modal.Body>
          <Input ref="back" type='textarea' label='Back' placeholder='' defaultValue={this.state.edit.back} />
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-content row">
            <Select
              ref="tags"
              className="col-xs-10"
              value={this.state.editCardTags}
              delimiter=","
              multi={true}
              allowCreate={true}
              placeholder="tags"
              options={[]}
              onChange={this.onEditTagInputChange.bind(this)} />
            <Button className="col-xs-2" onClick={this.update.bind(this)}>Update</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    var modalInstance;
    if (this.state.edit === null) {
      modalInstance = this.getNewCardModal();
    } else {
      modalInstance = this.getEditCardModal();
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
                        sortProp="originalIndex"
                        reverseOrder={true}
                        filterProp="filtered"
                        itemWidth={250}
                        itemHeight={250 * 0.716}
                        responsive={true} />
        </div>
      </div>
    );
  }
}

class FlipCardDisplay extends BaseDisplayObject{

  render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);

    var card = this.props.item.card;

    var tags = [];
    for (var tag of card.tags) {
      tags.push(
        <a href="#" className="tag" key={tag}><span className="label label-default">{tag}</span></a>
      );
    }
    return (
      <FlipCard style={itemStyle}
                disabled={true}
                flipped={this.props.item.flipped}
                onDoubleClick={this.props.onDoubleClick.bind(this, this.props.item.flipped, this.props.item.originalIndex)}
                bootstrap={true} >
        <div>
          <div className="edit-controls">
            <a href="#" className="left" onClick={this.props.onDelete.bind(this, card)}><i className="fa fa-trash-o"></i></a>
            <a href="#" className="right" onClick={this.props.onEdit.bind(this, card)}><i className="fa fa-pencil"></i></a>
          </div>
          <div className="card-content vh-center">
            <p>{card.front}</p>
          </div>
          <div className="tags-bottom">{tags}</div>
        </div>

        <div className="card-content vh-center">
          <p>{card.back}</p>
        </div>
      </FlipCard>
    );
  }
}
