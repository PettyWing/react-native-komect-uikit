/**
 * @Author: will
 * @Date:   2017-06-19T17:49:44+08:00
 * @Filename: Popover.js
 * @Last modified by:   will
 * @Last modified time: 2017-06-21T17:30:36+08:00
 */



// Popover.js

'use strict';

import React, {Component, PropTypes} from "react";
import {StyleSheet, View, Animated} from 'react-native';

import Theme from '../themes/Theme';
import Overlay from '../Overlay/Overlay'

export default class Popover extends Component {

  static propTypes = {
    ...View.propTypes,
    arrow: PropTypes.oneOf([
      'none',
      'topLeft',
      'top',
      'topRight',
      'rightTop',
      'right',
      'rightBottom',
      'bottomRight',
      'bottom',
      'bottomLeft',
      'leftBottom',
      'left',
      'leftTop',
    ]),
    paddingCorner: PropTypes.number,
  };

  static defaultProps = {
    ...View.defaultProps,
    arrow: 'none',
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  filterPopoverStyle(fs, includeRadius) {
    let {flexDirection, alignItems, justifyContent, margin, marginBottom, marginHorizontal, marginLeft, marginRight, marginTop, marginVertical, padding, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, backgroundColor, borderBottomColor, borderBottomLeftRadius, borderBottomRightRadius, borderBottomWidth, borderColor, borderLeftColor, borderLeftWidth, borderRadius, borderRightColor, borderRightWidth, borderStyle, borderTopColor, borderTopLeftRadius, borderTopRightRadius, borderTopWidth, borderWidth, ...others} = fs;
    let style = includeRadius ? {borderBottomLeftRadius, borderBottomRightRadius, borderRadius, borderTopLeftRadius, borderTopRightRadius, ...others} : {...others};
    for (let key in style) {
      if (style[key] === undefined) {
        delete style[key];
      }
    }
    return style;
  }

  filterContentStyle(fs) {
    let {flexDirection, alignItems, justifyContent, margin, marginBottom, marginHorizontal, marginLeft, marginRight, marginTop, marginVertical, padding, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, backgroundColor, borderBottomColor, borderBottomLeftRadius, borderBottomRightRadius, borderBottomWidth, borderColor, borderLeftColor, borderLeftWidth, borderRadius, borderRightColor, borderRightWidth, borderStyle, borderTopColor, borderTopLeftRadius, borderTopRightRadius, borderTopWidth, borderWidth, ...others} = fs;
    let style = {flexDirection, alignItems, justifyContent, margin, marginBottom, marginHorizontal, marginLeft, marginRight, marginTop, marginVertical, padding, paddingBottom, paddingHorizontal, paddingLeft, paddingRight, paddingTop, paddingVertical, backgroundColor, borderBottomColor, borderBottomLeftRadius, borderBottomRightRadius, borderBottomWidth, borderColor, borderLeftColor, borderLeftWidth, borderRadius, borderRightColor, borderRightWidth, borderStyle, borderTopColor, borderTopLeftRadius, borderTopRightRadius, borderTopWidth, borderWidth};
    for (let key in style) {
      if (style[key] === undefined) {
        delete style[key];
      }
    }
    return style;
  }

  buildProps() {
    let {style, arrow, paddingCorner, ...others} = this.props;

    style = [{
      backgroundColor: Theme.popoverColor,
      borderColor: Theme.popoverBorderColor,
      borderRadius: Theme.popoverBorderRadius,
      borderWidth: Theme.popoverBorderWidth,
    }].concat(style);

    let fs = StyleSheet.flatten(style);
    let {backgroundColor, borderColor, borderRadius, borderWidth} = fs;

    let arrowSize = 7; //Square side length
    let headerSize = Math.sqrt(arrowSize * arrowSize * 2) / 2 + borderWidth; //The half-length of the square diagonal: sqrt(7^2 + 7^2) / 2 = 4.95
    let headerPadding = headerSize - arrowSize / 2; //Let the center of square on the edge: 5 - (7 / 2) = 1.5
    let headerPaddingCorner = paddingCorner ? paddingCorner : Theme.popoverPaddingCorner;
    let contentPadding = headerSize - borderWidth;

    let headerLayouts = {
      none:        {},
      topLeft:     {top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'flex-start', paddingLeft: headerPaddingCorner},
      top:         {top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'center'},
      topRight:    {top: 0, left: 0, right: 0, height: headerSize, paddingTop: headerPadding, alignItems: 'flex-end', paddingRight: headerPaddingCorner},
      rightTop:    {top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: headerPaddingCorner},
      right:       {top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'center'},
      rightBottom: {top: 0, bottom: 0, right: 0, width: headerSize, paddingRight: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: headerPaddingCorner},
      bottomRight: {bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: headerPaddingCorner},
      bottom:      {bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'center', justifyContent: 'flex-end'},
      bottomLeft:  {bottom: 0, left: 0, right: 0, height: headerSize, paddingBottom: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: headerPaddingCorner},
      leftBottom:  {top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-end', paddingBottom: headerPaddingCorner},
      left:        {top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'center'},
      leftTop:     {top: 0, bottom: 0, left: 0, width: headerSize, paddingLeft: headerPadding, alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: headerPaddingCorner},
    };
    let arrowLayouts = {
      none:        {},
      topLeft:     {transform: [{rotate: '45deg'}]},
      top:         {transform: [{rotate: '45deg'}]},
      topRight:    {transform: [{rotate: '45deg'}]},
      rightTop:    {transform: [{rotate: '135deg'}]},
      right:       {transform: [{rotate: '135deg'}]},
      rightBottom: {transform: [{rotate: '135deg'}]},
      bottomRight: {transform: [{rotate: '225deg'}]},
      bottom:      {transform: [{rotate: '225deg'}]},
      bottomLeft:  {transform: [{rotate: '225deg'}]},
      leftBottom:  {transform: [{rotate: '315deg'}]},
      left:        {transform: [{rotate: '315deg'}]},
      leftTop:     {transform: [{rotate: '315deg'}]},
    };
    let popoverLayouts = {
      none:        {},
      topLeft:     {paddingTop: contentPadding},
      top:         {paddingTop: contentPadding},
      topRight:    {paddingTop: contentPadding},
      rightTop:    {paddingRight: contentPadding},
      right:       {paddingRight: contentPadding},
      rightBottom: {paddingRight: contentPadding},
      bottomRight: {paddingBottom: contentPadding},
      bottom:      {paddingBottom: contentPadding},
      bottomLeft:  {paddingBottom: contentPadding},
      leftBottom:  {paddingLeft: contentPadding},
      left:        {paddingLeft: contentPadding},
      leftTop:     {paddingLeft: contentPadding},
    }

    if (!arrow) arrow = 'none';
    switch (arrow) {
      case 'topLeft':
      case 'topRight':
        if (headerPaddingCorner + contentPadding > this.state.width / 2) arrow = 'top';
        break;
      case 'rightTop':
      case 'rightBottom':
        if (headerPaddingCorner + contentPadding > this.state.height / 2) arrow = 'right';
        break;
      case 'bottomRight':
      case 'bottomLeft':
        if (headerPaddingCorner + contentPadding > this.state.width / 2) arrow = 'bottom';
        break;
      case 'leftBottom':
      case 'leftTop':
        if (headerPaddingCorner + contentPadding > this.state.height / 2) arrow = 'left';
        break;
    }

    let headerStyle = Object.assign({
      position: 'absolute',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }, headerLayouts[arrow]);
    let arrowStyle = Object.assign({
      backgroundColor,
      width: arrowSize,
      height: arrowSize,
      borderColor,
      borderTopWidth: borderWidth,
      borderLeftWidth: borderWidth,
    }, arrowLayouts[arrow]);
    let contentStyle = this.filterContentStyle(fs);
    let popoverStyle = [this.filterPopoverStyle(fs, arrow === 'none'), {
      backgroundColor: arrow === 'none' ? Theme.popoverColor : 'rgba(0, 0, 0, 0)', //Transparent background will cause a warning at debug mode
    }].concat(popoverLayouts[arrow]);

    this.props = {style, arrow, paddingCorner, headerStyle, arrowStyle, contentStyle, popoverStyle, ...others};
  }

  onLayout(e) {
    let {width, height} = e.nativeEvent.layout;
    if (width != this.state.width || height != this.state.height) {
      this.setState({width, height});
    }
    this.props.onLayout && this.props.onLayout(e);
  }

  render() {
    this.buildProps();

    let {style, arrow, headerStyle, arrowStyle, contentStyle, popoverStyle, children, onLayout, ...others} = this.props;
    return (
      <View style={popoverStyle} onLayout={(e) => this.onLayout(e)} {...others}>
        <View style={contentStyle} activeOpacity={1}>
          {children}
        </View>
        {!arrow || arrow === 'none' ? null :
          <View style={headerStyle}>
            <View style={arrowStyle} />
          </View>
        }
      </View>
    );
  }
  popoverView;
  /**
   *
   * @param  {[type]} view       view的ref
   * @param  {[type]} black      背景色
   * @param  {[type]} direction  方向 可选值(down, right, left, up)
   * @param  {[type]} align      对齐 可选值(center, start, end)
   * @param  {[type]} customView popview内部显示的view
   * @return {[type]}            无返回
   */
  static showPopover(view, black, direction, align, customView){
     let blackStyle = {
       backgroundColor: 'rgba(0, 0, 0, 0.8)',
       paddingTop: 8,
       paddingBottom: 8,
       paddingLeft: 12,
       paddingRight: 12,
     };
     let whiteStyle = {
       ...blackStyle,
       backgroundColor: '#fff',
     };
     let shadowStyle = {
       shadowColor: '#777',
       shadowOffset: {width: 1, height: 1},
       shadowOpacity: 0.5,
       shadowRadius: 2,
     };
     let popoverStyle = [].concat(black ? blackStyle : whiteStyle).concat(shadowStyle : null);


     view.measureInWindow((x, y, width, height) => {
       let fromBounds = {x, y, width, height};

       let overlayView = (
         <Overlay.PopoverView animated={true} popoverStyle={popoverStyle} fromBounds={fromBounds} direction={direction} align={align} directionInsets={4} showArrow={true}>
           {customView}
         </Overlay.PopoverView>
       );
       this.popoverView = Overlay.show(overlayView);
     });
  }
  static hide(){
    Overlay.hide(this.popoverView);
  }
}
