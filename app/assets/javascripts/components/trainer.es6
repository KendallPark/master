var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Input = ReactBootstrap.Input;
var Tooltip = ReactBootstrap.Tooltip;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;

class Trainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: this.props.card,
      flipped: false,
      remaining: this.props.remaining,
      activeButton: null,
      edit: false,
      showShortcuts: false,
    };
  }

  flip() {
    this.setState({flipped: !this.state.flipped});
  }

  onKeyUp(e) {
    if(!this.state.edit && e.key === "Enter") {
      this.refs.flip.getDOMNode().click();
    } else if(!this.state.edit && this.state.flipped && [83, 68, 70, 74, 75, 76].indexOf(e.keyCode) > -1) {
      var score = [83, 68, 70, 74, 75, 76].indexOf(e.keyCode);
      this.score(score);
    } else if(!this.state.edit && this.state.flipped && e.keyCode === 69) {
      this.setState({edit: true});
    } else if (!this.state.edit && this.state.flipped && e.key === "Shift") {
      this.setState({showShortcuts: false});
    }
  }

  onKeyDown(e) {
    if(!this.state.edit && this.state.flipped && [83, 68, 70, 74, 75, 76].indexOf(e.keyCode) > -1) {
      this.setState({activeButton: [83, 68, 70, 74, 75, 76].indexOf(e.keyCode)});
    } else if (!this.state.edit && this.state.flipped && e.key === "Shift") {
      this.setState({showShortcuts: true});
    }
  }

  score(points) {
    var data = { trainer: { score: points } };
    if(this.props.filter_tags) { data.trainer.tags = this.props.filter_tags; }
    $.ajax({
      type: "PATCH",
      url: `/train/score/${this.state.card.id}`,
      data: data,
      success: function(results) {
        React.findDOMNode(this.refs.answer.refs.input).value = "";
        this.setState({card: results.next_card, flipped: false, remaining: results.remaining, activeButton: null});
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  getButtonActiveClass(number) {
    return number === this.state.activeButton ? " active" : "";
  }

  update(front, back, tags, frontImage, backImage, deleteFrontImage, deleteBackImage) {
    var formData = new FormData();
    formData.append("card[front]", front);
    formData.append("card[back]", back);
    if(frontImage) {
      formData.append("card[front_image]", frontImage);
    }
    if(backImage){
      formData.append("card[back_image]", backImage);
    }
    if(deleteFrontImage){
      formData.append("card[delete_front_image]", true)
    }
    if(deleteBackImage){
      formData.append("card[delete_back_image]", true)
    }
    formData.append("card[tag_list][]", tags);
    $.ajax({
      type: "PATCH",
      url: `/api/v1/cards/${this.state.card.id}`,
      processData: false,
      contentType: false,
      data: formData,
      success: function(card) {
        this.setState({card: card});
        this.close();
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  editCard(card) {
    this.setState({ edit: true });
  }

  close() {
    this.setState( { edit: false});
  }

  render() {
    var card = this.state.card;

    if(card === null) {
      return (
        <div>
          <h2 className="vh-center">Today's Training Complete!</h2>
          <h4 className="vh-center">Check back tomorrow for more.</h4>
        </div>
      );
    }
    var tags = [];
    for (var tag of card.tags) {
      tags.push(
        <a href="#" className="tag" key={tag}><span className="label label-default">{tag}</span></a>
      );
    }

    var hide = this.state.flipped ? "" : "";

    var button0tooltip = <Tooltip>complete blackout</Tooltip>;
    var button1tooltip = <Tooltip>incorrect response but the correct one remembered</Tooltip>;
    var button2tooltip = <Tooltip>incorrect response but the correct one seemed easy to recall</Tooltip>;
    var button3tooltip = <Tooltip>correct response recalled with serious difficulty</Tooltip>;
    var button4tooltip = <Tooltip>correct response after a hesitation</Tooltip>;
    var button5tooltip = <Tooltip>perfect response</Tooltip>;


    var buttonToolbar = (
      <div className="btn-batch">
        <OverlayTrigger placement='bottom' overlay={button0tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="zero" className={"btn btn-info btn-md"+hide+this.getButtonActiveClass(0)} onClick={this.score.bind(this, 0)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "s" : "WTF?"}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={button1tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="one" className={"btn btn-danger btn-md"+hide+this.getButtonActiveClass(1)} onClick={this.score.bind(this, 1)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "d" : "Uhh..."}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={button2tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="two" className={"btn btn-warning btn-md"+hide+this.getButtonActiveClass(2)} onClick={this.score.bind(this, 2)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "f" : "Damn."}</button>
        </OverlayTrigger>
        <button ref="flip" className="btn btn-default btn-lg fa fa-refresh" onClick={this.flip.bind(this)} >{this.state.showShortcuts ? "Enter" : ""}</button>
        <OverlayTrigger placement='bottom' overlay={button3tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="three" className={"btn btn-success btn-md"+hide+this.getButtonActiveClass(3)} onClick={this.score.bind(this, 3)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "j" : "Whew!"}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={button4tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="four" className={"btn btn-primary btn-md"+hide+this.getButtonActiveClass(4)} onClick={this.score.bind(this, 4)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "k" : "Got it!"}</button>
        </OverlayTrigger>
        <OverlayTrigger placement='bottom' overlay={button5tooltip} delayShow={1500} disable={!this.state.flipped} >
          <button ref="five" className={"btn btn-black btn-md"+hide+this.getButtonActiveClass(5)} onClick={this.score.bind(this, 5)} disabled={!this.state.flipped}>{this.state.showShortcuts ? "l" : "CAKE"}</button>
        </OverlayTrigger>
      </div>
    );

    var backText = this.state.flipped ? card.back : null;

    return (
      <div onKeyUp={this.onKeyUp.bind(this)} onKeyDown={this.onKeyDown.bind(this)}>
        <CardEditor key="edit_card"
                    mode="edit"
                    onSave={this.update.bind(this)}
                    onClose={this.close.bind(this)}
                    show={this.state.edit}
                    card={this.state.card} />
        <div className="modal show">
          <div className="modal-dialog" >
            <FlipCard disabled={true}
                      flipped={this.state.flipped}
                      // onDoubleClick={}
                      bootstrap={true} >
              <div>
                <div className="tags-top">{tags}</div>
                <div className="card-content vh-center">
                  <CardContent text={card.front} imageUrl={card.front_image_url} />
                </div>
              </div>

              <div>
                <div className="card-content vh-center">
                  <CardContent text={backText} imageUrl={card.back_image_url} />
                </div>
              </div>
            </FlipCard>
            <ButtonToolbar>
              {buttonToolbar}
              <div className="enter-answer"><Input ref="answer" type="this.props.text" autoFocus={true} disabled={this.state.flipped} /></div>
              <div className="remainder"><h5>Remaining: {this.state.remaining}</h5></div>
            </ButtonToolbar>
          </div>
        </div>
        <div className="modal-backdrop fade in" ></div>
      </div>
    );
  }
}

class CardContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content;
    if(this.props.imageUrl && this.props.text) {
      content = ( <div className="fix">
                    <div className="desc">
                      <p className="desc-content">{this.props.text}</p>
                    </div>
                    <img src={this.props.imageUrl} />
                  </div>);
    } else if (this.props.imageUrl && !this.props.text) {
      content = <img src={this.props.imageUrl} />;
    } else {
      content = <p>{this.props.text}</p>;
    }
    return content;
  }
}
