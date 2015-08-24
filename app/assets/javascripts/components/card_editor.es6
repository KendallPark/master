var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardEditor extends React.Component {

  constructor(props) {
    super(props);
    var tags = props.defaultTags || [];
    if(props.mode === 'edit') {
      tags = props.card.tags;
    }
    var fiu, biu;
    if(props.card) {
      fiu = props.card.front_image_url;
      biu = props.card.back_image_url;
    }
    this.state = {
      tags: tags,
      frontImage: null,
      backImage: null,
      frontImageUrl: fiu,
      backImageUrl: biu,
      tagOptions: null,
    };
    this.getTagOptions();
  }

  onSave() {
    var front = this.refs.front.getDOMNode().value;
    var back = this.refs.back.getDOMNode().value;
    var tags = this.state.tags;
    var frontImage = this.state.frontImage;
    var backImage = this.state.backImage;
    var deleteFrontImage = this.state.deleteFrontImage;
    var deleteBackImage = this.state.deleteBackImage;
    this.props.onSave(front, back, tags, frontImage, backImage, deleteFrontImage, deleteBackImage);
  }

  onTagChange(tags) {
    var newTags = tags.split(",");
    if(newTags.length === 1 && newTags[0] === "") {
      newTags = [];
    }
    this.setState( { tags: newTags } );
  }


  addFrontImage(image) {
    this.setState({frontImage: image[0], frontImageUrl: image[0].preview});
  }

  addBackImage(image) {
    this.setState({backImage: image[0], backImageUrl: image[0].preview});
  }

  deleteFrontImage() {
    this.setState({frontImage: null, frontImageUrl: null, deleteFrontImage: true});
  }

  deleteBackImage() {
    this.setState({backImage: null, backImageUrl: null, deleteBackImage: true});
  }

  getImageContainer(imageUrl, addImageFn, deleteImageFn) {
    var container;
    if (imageUrl) {
      container = <div className="img-wrap">
                    <i className="close fa fa-times" onClick={deleteImageFn.bind(this)}></i>
                    <img src={imageUrl}></img>
                  </div>
    } else {
      container = ( <Dropzone onDrop={addImageFn.bind(this)}>
                      Drop an image here or click to upload.
                    </Dropzone>);
    }
    return container;
  }

  componentWillReceiveProps(nextProps) {
    // run this when we open the modal
    if(nextProps.show === true && this.props.show === false) {
      var tags = nextProps.defaultTags || [];
      if(nextProps.mode === 'edit') {
        tags = nextProps.card.tags;
      }
      var fiu, biu;
      if(nextProps.card) {
        fiu = nextProps.card.front_image_url;
        biu = nextProps.card.back_image_url;
      }
      this.setState({
        tags: tags,
        frontImage: null,
        backImage: null,
        frontImageUrl: fiu,
        backImageUrl: biu,
      });
      this.getTagOptions();
    }
  }

  getTagOptions() {
    $.ajax({
      type: "GET",
      url: `/api/v1/tags`,
      success: function(tags) {
        var tagOptions = _.map(this.props.tagOptions, t => ({value: t, label: t}));
        this.setState({tagOptions: tagOptions});
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
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


    var frontImageContainer = this.getImageContainer(this.state.frontImageUrl, this.addFrontImage, this.deleteFrontImage);
    var backImageContainer = this.getImageContainer(this.state.backImageUrl, this.addBackImage, this.deleteBackImage);

    return (
      <Modal id={componentId} show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Front</h5>
          {frontImageContainer}
          <TextareaAutosize ref="front" autoFocus={true} placeholder="front text goes here" defaultValue={this.props.card.front}/>
        </Modal.Body>
        <Modal.Body>
          <h5>Back</h5>
          {backImageContainer}
          <TextareaAutosize ref="back" placeholder="back text goes here" defaultValue={this.props.card.back}/>
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
              options={this.state.tagOptions}
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
