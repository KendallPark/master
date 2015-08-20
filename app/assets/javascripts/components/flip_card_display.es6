class FlipCardDisplay extends BaseDisplayObject{

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

  getTags(tags) {
    var tagElements = [];
    for (var tag of tags) {
      tagElements.push(
        <a href="#" className="tag" key={tag}><span className="label label-default">{tag}</span></a>
      );
    }
    return tagElements;
  }

  render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);

    var card = this.props.item.card;
    var frontContent = this.generateCardContent(card.front, card.front_image_thumb_url);
    var backContent = this.generateCardContent(card.back, card.back_image_thumb_url);
    var tags = this.getTags(card.tags);
    return (
      <FlipCard style={itemStyle}
                disabled={true}
                flipped={this.props.item.flipped}
                onDoubleClick={this.props.onDoubleClick.bind(this, this.props.item.flipped, this.props.item.originalIndex)}
                bootstrap={true} >
        <div>
          <div className="edit-controls">
            <a href="#" className="left" onClick={this.props.onDelete.bind(this, card.id)}><i className="fa fa-trash-o"></i></a>
            <a href="#" className="right" onClick={this.props.onEdit.bind(this, card)}><i className="fa fa-pencil"></i></a>
          </div>
          <div className="card-content vh-center">
            {frontContent}
          </div>
          <div className="tags-bottom">{tags}</div>
        </div>

        <div className="card-content vh-center">
          {backContent}
        </div>
      </FlipCard>
    );
  }
}
