'use strict';

var FlipCard = React.createClass({
  displayName: 'ReactFlipCard',

  propTypes: {
    type: React.PropTypes.string,
    flipped: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onFlip: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    bootstrap: React.PropTypes.bool,
    children: function children(props, propName, componentName) {
      var prop = props[propName];

      if (React.Children.count(prop) !== 2) {
        return new Error('`' + componentName + '` ' + 'should contain exactly two children. ' + 'The first child represents the front of the card. ' + 'The second child represents the back of the card.');
      }
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      type: 'horizontal',
      flipped: false,
      disabled: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      hasFocus: false,
      isFlipped: this.props.flipped
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    var _this = this;

    // Make sure both sides are displayed for animation
    this._showBothSides();

    // Wait for display above to take effect
    setTimeout(function () {
      _this.setState({
        isFlipped: newProps.flipped
      });
    }, 0);
  },

  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
    // If card is flipping to back via props, track element for focus
    if (!this.props.flipped && nextProps.flipped) {
      // The element that focus will return to when flipped back to front
      this.focusElement = document.activeElement;
      // Indicates that the back of card needs focus
      this.focusBack = true;
    }

    // If isFlipped has changed need to notify
    if (this.state.isFlipped !== nextState.isFlipped) {
      this.notifyFlip = true;
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    // If card has flipped to front, and focus is still within the card
    // return focus to the element that triggered flipping to the back.
    if (!this.props.flipped && this.focusElement && (0, contains)(this.getDOMNode(), document.activeElement)) {
      this.focusElement.focus();
      this.focusElement = null;
    }
    // Direct focus to the back if needed
    else if (this.focusBack) {
      this.refs.back.getDOMNode().focus();
      this.focusBack = false;
    }

    // Notify card being flipped
    if (this.notifyFlip && typeof this.props.onFlip === 'function') {
      this.props.onFlip(this.state.isFlipped);
      this.notifyFlip = false;
    }

    // Hide whichever side of the card is down
    setTimeout(this._hideFlippedSide, 600);
  },

  componentDidMount: function componentDidMount() {
    this._hideFlippedSide();
  },

  _showBothSides: function _showBothSides() {
    this.refs.front.getDOMNode().style.display = '';
    this.refs.back.getDOMNode().style.display = '';
  },

  _hideFlippedSide: function _hideFlippedSide() {
    // This prevents the flipped side from being tabbable
    if (this.props.disabled) {
      if (this.state.isFlipped) {
        this.refs.front.getDOMNode().style.display = 'none';
      } else {
        this.refs.back.getDOMNode().style.display = 'none';
      }
    }
  },

  handleFocus: function handleFocus() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: true
    });
  },

  handleBlur: function handleBlur() {
    if (this.props.disabled) return;

    this.setState({
      isFlipped: false
    });
  },

  handleKeyDown: function handleKeyDown(e) {
    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(e);
    }
  },

  handleDoubleClick: function handleDoubleClick(e) {
    if (typeof this.props.onDoubleClick === 'function') {
      this.props.onDoubleClick(e);
    }
  },

  handleClick: function handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      {
        className: (0, classSet)({
          'ReactFlipCard': true,
          'ReactFlipCard--vertical': this.props.type === 'vertical',
          'ReactFlipCard--horizontal': this.props.type !== 'vertical',
          'ReactFlipCard--flipped': this.state.isFlipped,
          'ReactFlipCard--enabled': !this.props.disabled
        }),
        tabIndex: 0,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown,
        onDoubleClick: this.handleDoubleClick,
        onClick: this.handleClick,
        style: this.props.style,
      },
      React.createElement(
        'div',
        {
          className: 'ReactFlipCard__Flipper'
        },
        React.createElement(
          'div',
          {
            className: (0, classSet)({
              'ReactFlipCard__Front': true,
              'panel': this.props.bootstrap,
              'panel-primary': this.props.bootstrap,
            }),
            tabIndex: 0,
            ref: 'front',
            tabIndex: -1,
            'aria-hidden': this.state.isFlipped
          },
          this.props.children[0]
        ),
        React.createElement(
          'div',
          {
            className: (0, classSet)({
              'ReactFlipCard__Back': true,
              'panel': this.props.bootstrap,
              'panel-primary': this.props.bootstrap,
            }),
            ref: 'back',
            tabIndex: -1,
            'aria-hidden': !this.state.isFlipped
          },
          this.props.children[1]
        )
      )
    );
  }
});
