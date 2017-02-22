var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;

class CardImport extends React.Component {

  constructor(props) {
    super(props)
  }

  onImport() {
    var text = this.refs.importText.getDOMNode().value;
    this.props.onImport(text);
  }

  render() {
    return (
      <Modal id="import_card_modal" show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import From Workflowy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextareaAutosize ref="importText" placeholder="paste workflowy stuff here" />
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-content row">
            <Button className="col-xs-2" onClick={this.onImport.bind(this)}>Import</Button>
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
