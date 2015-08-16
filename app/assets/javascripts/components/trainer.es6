var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;

class Trainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: this.props.card,
      flipped: false,
      remaining: this.props.remaining,
    };
  }

  flip() {
    this.setState({flipped: !this.state.flipped});
  }

  score(points) {
    $.ajax({
      type: "PATCH",
      url: `/train/score/${this.state.card.id}`,
      data: {
        trainer: { score: points }
      },
      success: function(results) {
        this.setState({card: results.next_card, flipped: false, remaining: results.remaining });
      }.bind(this),
      failure: function(error) {
        console.log(error);
      }
    });
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

    var buttonToolbar = (
      <div className="btn-batch">
        <button className="btn btn-info btn-md" onClick={this.score.bind(this, 0)}>WTF?</button>
        <button className="btn btn-danger btn-md" onClick={this.score.bind(this, 1)}>Uhh...</button>
        <button className="btn btn-warning btn-md" onClick={this.score.bind(this, 2)}>Damn.</button>
        <button className="btn btn-default btn-md" onClick={this.score.bind(this, 3)}>Whew!</button>
          <button className="btn btn-success btn-md" onClick={this.score.bind(this, 4)}>Got it!</button>
        <button className="btn btn-primary btn-md" onClick={this.score.bind(this, 5)}>Owned it!</button>
      </div>
    );

    var backContents;
    if(this.state.flipped) {
      backContents = card.back;
    }

    return (
      <div>
        <div className="modal show">
          <div className="modal-dialog" >
            <FlipCard disabled={true}
                      flipped={this.state.flipped}
                      // onDoubleClick={}
                      bootstrap={true} >
              <div>
                <div className="card-content vh-center">
                  <p>{card.front}</p>
                </div>
                <div className="tags-bottom">{tags}</div>
              </div>

              <div>
                <div className="card-content vh-center">
                  <p>{backContents}</p>
                </div>
                <ButtonToolbar>
                  {buttonToolbar}
                </ButtonToolbar>
              </div>
            </FlipCard>
            <ButtonToolbar>
              <div className="btn-batch">
                <button className="btn btn-primary btn-lg fa fa-refresh" onClick={this.flip.bind(this)}></button>
              </div>
              <div className="remainder"><h5>Remaining: {this.state.remaining}</h5></div>
            </ButtonToolbar>
          </div>
        </div>
        <div className="modal-backdrop fade in" ></div>
      </div>
    );
  }
}
