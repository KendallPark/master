'use strict';
//= require react

var IconComponent = React.createClass({
    render: function () {
        return (
            <div data-filetype={this.props.filetype} className="filepicker-file-icon" />
        );
    }
});
