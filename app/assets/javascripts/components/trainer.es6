var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Input = ReactBootstrap.Input;

class Trainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: this.props.card,
      flipped: false,
      remaining: this.props.remaining,
      activeButton: null,
      edit: false,
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
    }
  }

  onKeyDown(e) {
    if(!this.state.edit && this.state.flipped && [83, 68, 70, 74, 75, 76].indexOf(e.keyCode) > -1) {
      this.setState({activeButton: [83, 68, 70, 74, 75, 76].indexOf(e.keyCode)});
    }
  }

  score(points) {
    $.ajax({
      type: "PATCH",
      url: `/train/score/${this.state.card.id}`,
      data: {
        trainer: { score: points }
      },
      success: function(results) {
        this.setState({card: results.next_card, flipped: false, remaining: results.remaining, activeButton: null});
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
  }

  generateCardContent(text, imageUrl) {
    var content;
    if(imageUrl && text) {
      content = ( <div className="fix">
                    <div className="desc">
                      <p className="desc-content">{text}</p>
                    </div>
                    <img src={imageUrl} />
                  </div>);
    } else if (imageUrl && !text) {
      content = <img src={imageUrl} />;
    } else {
      content = <p>{text}</p>;
    }
    return content;
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

    var hide = this.state.flipped ? "" : " fade";

    var buttonToolbar = (
      <div className="btn-batch">
        <button ref="zero" className={"btn btn-info btn-md"+hide+this.getButtonActiveClass(0)} onClick={this.score.bind(this, 0)} disabled={this.flipped}>WTF?</button>
        <button ref="one" className={"btn btn-danger btn-md"+hide+this.getButtonActiveClass(1)} onClick={this.score.bind(this, 1)} disabled={this.flipped}>Uhh...</button>
        <button ref="two" className={"btn btn-warning btn-md"+hide+this.getButtonActiveClass(2)} onClick={this.score.bind(this, 2)} disabled={this.flipped}>Damn.</button>
        <button ref="flip" className="btn btn-default btn-lg fa fa-refresh" onClick={this.flip.bind(this)} ></button>
        <button ref="three" className={"btn btn-success btn-md"+hide+this.getButtonActiveClass(3)} onClick={this.score.bind(this, 3)} disabled={this.flipped}>Whew!</button>
        <button ref="four" className={"btn btn-primary btn-md"+hide+this.getButtonActiveClass(4)} onClick={this.score.bind(this, 4)} disabled={this.flipped}>Got it!</button>
        <button ref="five" className={"btn btn-black btn-md"+hide+this.getButtonActiveClass(5)} onClick={this.score.bind(this, 5)} disabled={this.flipped}>CAKE</button>
      </div>
    );

    var backText = this.state.flipped ? card.back : null;

    var frontContent = this.generateCardContent(card.front, card.front_image_url);
    var backContent = this.generateCardContent(backText, card.back_image_url);

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
                <div className="card-content vh-center">
                  {frontContent}
                </div>
                <div className="tags-bottom">{tags}</div>
              </div>

              <div>
                <div className="card-content vh-center">
                  {backContent}
                </div>
              </div>
            </FlipCard>
            <ButtonToolbar>
              {buttonToolbar}
              <div className="enter-answer"><Input type="text" autoFocus={true} disabled={this.state.flipped} /></div>
              <div className="remainder"><h5>Remaining: {this.state.remaining}</h5></div>
            </ButtonToolbar>
          </div>
        </div>
        <div className="modal-backdrop fade in" ></div>
      </div>
    );
  }
}
