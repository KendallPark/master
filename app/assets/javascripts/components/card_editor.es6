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
      front_image: null,
      back_image: null,
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
    if(newTags.length === 1 && newTags[0] === "") {
      newTags = [];
    }
    this.setState( { tags: newTags } );
  }

  dropImage() {
    console.log("image drop");
  }

  addFrontImage(image, hey) {
    console.log("front", image);
  }

  addBackImage(image) {
    console.log("back", image);
  }

  dropzoneInit(dropzone) {
    // dropzone.options.autoProcessQueue = false;
    dropzone.options.maxFiles = 1;
    dropzone.autoDiscover = false;
    dropzone.options.paramName = "card[front_image]";
    dropzone.on("processing", () => {
      dropzone.options.url = `/api/v1/cards/${this.props.cardId}`;
      dropzone.options.method = "PATCH";
    });
  }

  uploadImage() {

  }

  getDropzoneEventHanders(front_or_back) {
    var imageAdded = front_or_back === "front" ? this.addFrontImage : this.addBackImage;
    var eventHandlers = {
      init: this.dropzoneInit.bind(this),
      // All of these receive the event as first parameter:
      drop: null,
      dragstart: null,
      dragend: null,
      dragenter: null,
      dragover: null,
      dragleave: null,
      // All of these receive the file as first parameter:
      addedfile: imageAdded,
      removedfile: null,
      thumbnail: null,
      error: null,
      processing: null,
      uploadprogress: null,
      sending: null,
      success: null,
      complete: null,
      canceled: null,
      maxfilesreached: null,
      maxfilesexceeded: null,
      // All of these receive a list of files as first parameter
      // and are only called if the uploadMultiple option
      // in djsConfig is true:
      processingmultiple: null,
      sendingmultiple: null,
      successmultiple: null,
      completemultiple: null,
      canceledmultiple: null,
      // Special Events
      totaluploadprogress: null,
      reset: null,
      queuecompleted: null
    };
    return eventHandlers;
  }

  render() {
    console.log("render", this.props.blankId);
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

    var frontDropzoneEventHandlers = this.getDropzoneEventHanders("front");
    var backDropzoneEventHandlers = this.getDropzoneEventHanders("back");

    var djsConfig = {
      addRemoveLinks: true,
    };

    var componentConfig = {
      allowedFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: `/api/v1/cards/${this.props.cardId}`
    };

    return (
      <Modal id={componentId} show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropzoneComponent  config={componentConfig}
                              eventHandlers={frontDropzoneEventHandlers}
                              djsConfig={djsConfig} />
          <Input ref="front" type='textarea' label='Front' placeholder='' defaultValue={this.props.card.front} />
        </Modal.Body>
        <Modal.Body>
          <DropzoneComponent  config={componentConfig}
                              eventHandlers={backDropzoneEventHandlers}
                              djsConfig={djsConfig} />
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
