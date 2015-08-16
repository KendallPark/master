// 'use strict';
//
// Object.defineProperty(exports, '__esModule', {
//   value: true
// });
// var CSS = '\n.ReactFlipCard {\n  -webkit-perspective: 1000;\n  -moz-perspective: 1000;\n  -ms-perspective: 1000;\n  perspective: 1000;\n\n  -ms-transform: perspective(1000px);\n  -moz-transform: perspective(1000px);\n  -moz-transform-style: preserve-3d; \n  -ms-transform-style: preserve-3d; \n\n  display: inline-block;\n}\n\n/* START: Accommodating for IE */\n.ReactFlipCard--enabled.ReactFlipCard:hover .ReactFlipCard__Back,\n.ReactFlipCard--flipped .ReactFlipCard__Back {\n  -webkit-transform: rotateY(0deg);\n  -moz-transform: rotateY(0deg);\n  -ms-transform: rotateY(0deg);\n  -o-transform: rotateY(0deg);\n  transform: rotateY(0deg);\n}\n\n.ReactFlipCard--enabled.ReactFlipCard:hover .ReactFlipCard__Front,\n.ReactFlipCard--flipped .ReactFlipCard__Front {\n  -webkit-transform: rotateY(180deg);\n  -moz-transform: rotateY(180deg);\n  -ms-transform: rotateY(180deg);\n  -o-transform: rotateY(180deg);\n  transform: rotateY(180deg);\n}\t\n/* END: Accommodating for IE */\n\n.ReactFlipCard__Flipper {\n  -webkit-transition: 0.6s;\n  -webkit-transform-style: preserve-3d;\n  -ms-transition: 0.6s;\n\n  -moz-transition: 0.6s;\n  -moz-transform: perspective(1000px);\n  -moz-transform-style: preserve-3d;\n  -ms-transform-style: preserve-3d;\n\n  transition: 0.6s;\n  transform-style: preserve-3d;\n\n  position: relative;\n}\n\n.ReactFlipCard__Front, .ReactFlipCard__Back {\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n\n  -webkit-transition: 0.6s;\n  -webkit-transform-style: preserve-3d;\n  -webkit-transform: rotateY(0deg);\n\n  -moz-transition: 0.6s;\n  -moz-transform-style: preserve-3d;\n  -moz-transform: rotateY(0deg);\n\n  -o-transition: 0.6s;\n  -o-transform-style: preserve-3d;\n  -o-transform: rotateY(0deg);\n\n  -ms-transition: 0.6s;\n  -ms-transform-style: preserve-3d;\n  -ms-transform: rotateY(0deg);\n\n  transition: 0.6s;\n  transform-style: preserve-3d;\n  transform: rotateY(0deg);\n\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ReactFlipCard__Front {\n  -webkit-transform: rotateY(0deg);\n  -moz-transform: rotateY(0deg);\n  -ms-transform: rotateY(0deg);\n  -o-transform: rotateY(0deg);\n  z-index: 2;\n}\n\n.ReactFlipCard__Back {\n  -webkit-transform: rotateY(-180deg);\n  -moz-transform: rotateY(-180deg);\n  -ms-transform: rotateY(-180deg);\n  -o-transform: rotateY(-180deg);\n    transform: rotateY(-180deg);\n}\n\n/* vertical */\n.ReactFlipCard--vertical {\n  position: relative;\n}\n\n.ReactFlipCard--vertical .ReactFlipCard__Back {\n  -webkit-transform: rotateX(180deg);\n  -moz-transform: rotateX(180deg);\n  -ms-transform: rotateX(180deg);\n  -o-transform: rotateX(180deg);\n  transform: rotateX(180deg);\n}\n\n.ReactFlipCard--vertical .ReactFlipCard__Flipper {\n  -webkit-transform-origin: 100% 150px;\n  -moz-transform-origin: 100% 150px;\n  -ms-transform-origin: 100% 150px;\n  -o-transform-origin: 100% 150px;\n  transform-origin: 100% 150px;\n}\n\n/* START: Accommodating for IE */\n.ReactFlipCard--enabled.ReactFlipCard--vertical:hover .ReactFlipCard__Back,\n.ReactFlipCard--vertical.ReactFlipCard--flipped .ReactFlipCard__Back {\n  -webkit-transform: rotateX(0deg);\n  -moz-transform: rotateX(0deg);\n  -ms-transform: rotateX(0deg);\n  -o-transform: rotateX(0deg);\n  transform: rotateX(0deg);\n}\n\n.ReactFlipCard--enabled.ReactFlipCard--vertical:hover .ReactFlipCard__Front,\n.ReactFlipCard--vertical.ReactFlipCard--flipped .ReactFlipCard__Front {\n  -webkit-transform: rotateX(180deg);\n  -moz-transform: rotateX(180deg);\n  -ms-transform: rotateX(180deg);\n  -o-transform: rotateX(180deg);\n  transform: rotateX(180deg);\n}\n/* END: Accommodating for IE */\n';
//
// exports['default'] = function () {
//   var style = document.getElementById('react-flipcard-style');
//   if (!style) {
//     style = document.createElement('style');
//     style.setAttribute('id', 'react-flipcard-style');
//     var head = document.querySelector('head');
//     head.insertBefore(style, head.firstChild);
//   }
//   style.innerHTML = CSS;
// };
//
// ;
// module.exports = exports['default'];
//
// export function flipDefaults = exports['default'];
