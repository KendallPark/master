//=require ./BaseDisplayObject
'use strict';

class GridItem extends BaseDisplayObject{

  render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);

    return <div
            style={itemStyle}
            className="gridItem">{this.props.item.name}</div>;
  }
}
