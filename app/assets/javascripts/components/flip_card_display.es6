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
