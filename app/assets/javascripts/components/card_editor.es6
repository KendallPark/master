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
      frontImage: null,
      backImage: null,
    }

  }

  onSave() {
    var front = this.refs.front.getValue();
    var back = this.refs.back.getValue();
    var tags = this.state.tags;
    var frontImage = this.state.frontImage;
    var backImage = this.state.backImage;
    this.props.onSave(front, back, tags, frontImage, backImage);
  }

  onTagChange(tags) {
    var newTags = tags.split(",");
    if(newTags.length === 1 && newTags[0] === "") {
      newTags = [];
    }
    this.setState( { tags: newTags } );
  }

  dropImage() {
    console.log("image drop");
  }

  addFrontImage(image) {
    this.setState({frontImage: image[0]});
  }

  addBackImage(image) {
    this.setState({backImage: image[0]});
  }

  getImageContainer(imageFile, addImageFn) {
    var container;
    if (imageFile) {
      container = <img src={imageFile.preview}></img>;
    } else {
      container = ( <Dropzone onDrop={addImageFn.bind(this)}>
                      Drop an image here or click to upload.
                    </Dropzone>);
    }
    return container;
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

    var frontImageContainer = this.getImageContainer(this.state.frontImage, this.addFrontImage);
    var backImageContainer = this.getImageContainer(this.state.backImage, this.addBackImage);

    return (
      <Modal id={componentId} show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Front</h5>
          {frontImageContainer}
          <Input autoFocus={true} ref="front" type='textarea' placeholder='' defaultValue={this.props.card.front} />
        </Modal.Body>
        <Modal.Body>
          <h5>Back</h5>
          {backImageContainer}
          <Input ref="back" type='textarea' placeholder='' defaultValue={this.props.card.back} />
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
