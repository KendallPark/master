var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardEditor extends React.Component {

  constructor(props) {
    super(props);
    var tags = this.props.defaultTags || [];
    if(this.props.mode === 'edit') {
      tags = this.props.card.tags;
    }
    this.state = {
      tags: tags,
    }

  }

  onSave() {
    var front = this.refs.front.getValue();
    var back = this.refs.back.getValue();
    var tags = this.state.tags;
    this.props.onSave(front, back, tags);
  }

  onTagChange(tags) {
    var newTags = tags.split(",");
    console.log(newTags);
    if(newTags.length === 1 && newTags[0] === "") {
      newTags = [];
    }
    this.setState( { tags: newTags } );
  }

  render() {
    var buttonText, componentId, title;
    if (this.props.mode === 'new') {
      title = "New Card";
      componentId = "new_card_modal";
      buttonText = "Add Card";
    } else {
      title = "Edit Card";
      componentId = "edit_card_modal";
      buttonText = "Update";
    }

    return (
      <Modal id={componentId} show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input ref="front" type='textarea' label='Front' placeholder='' defaultValue={this.props.card.front} />
        </Modal.Body>
        <Modal.Body>
          <Input ref="back" type='textarea' label='Back' placeholder='' defaultValue={this.props.card.back} />
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-content row">
            <Select
              ref="tags"
              className="col-xs-10"
              value={this.state.tags}
              delimiter=","
              multi={true}
              allowCreate={true}
              placeholder="tags"
              options={[]}
              onChange={this.onTagChange.bind(this)} />
            <Button className="col-xs-2" onClick={this.onSave.bind(this)}>{buttonText}</Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

CardEditor.propTypes = {
  mode: React.PropTypes.string,
  onSave: React.PropTypes.func,
  onClose: React.PropTypes.func,
  show: React.PropTypes.bool,
  card: React.PropTypes.object,
  defaultTags: React.PropTypes.array,
};

CardEditor.defaultProps = {
  mode: "new",
  show: false,
  card: {
    front: "",
    back: "",
  },
};
