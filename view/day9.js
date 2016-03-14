/**
 * Day 9
 * 
 */
'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  PanResponder,
  LayoutAnimation,
  ScrollView,
  TabBarIOS,
  StatusBarIOS,
  SegmentedControlIOS,
  View
} = React;
var Util = require('./utils');
var Icon = require('react-native-vector-icons/Ionicons');

var TwitterUser = React.createClass({
	getInitialState: function () {
		return{
			scrollEnabled: false,
      scale: 1,
      iconTop: 95,
      bannerTop:0,
      opacity:0,
		}
	},
  _scrollEnabled: false,
	_previousTop: 0,
  _iconTop:95,
  _scale:1,
  _bannerTop:0,
  _opacity:0,
	_minTop: -192,
	_userStyle:{},
  user: (null : ?{ setNativeProps(props: Object): void }),
  _updatePosition: function() {
	   this.user && this.user.setNativeProps(this._userStyles);
	},
	_endMove: function (evt, gestureState) {
		this._previousTop = this._userStyles.style.top;
	},
	componentWillMount: function() {
		this._panResponder = PanResponder.create({
		    onStartShouldSetPanResponder: (evt, gestureState) => true,
		    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
		    onMoveShouldSetPanResponder: (evt, gestureState) => {
		    	return gestureState.dy/gestureState.dx!=0;
			  },
		    onPanResponderGrant: (evt, gestureState) => {
		       
		    },
		    onPanResponderMove: (evt, gestureState) => {
	           	this._userStyles.style.top = this._previousTop + gestureState.dy;
              this._scale = 1+this._userStyles.style.top/162.5;
              this._iconTop = 95 - this._userStyles.style.top/4.16;
              this._bannerTop = 0;
              this._opacity = 0;
              // this._scrollEnabled = false;
              if (this._userStyles.style.top< -62.5) {
                this._scale = 0.6;
                this._iconTop = 110;
                this._bannerTop = -this._userStyles.style.top-62.5;
                this._opacity = Math.pow((-this._userStyles.style.top-62.5)/129.5,0.5)
              };
	           	if (this._userStyles.style.top>0) {
	           		this._userStyles.style.top = 0;
                this._scale = 1;
                this._iconTop = 95
	           	};
	           	if (this._userStyles.style.top < this._minTop) {
	           		this._userStyles.style.top = this._minTop;
                this._opacity = 1;
                this._bannerTop = 129.5;
                // this._scrollEnabled = true;
	           	};
          this.setState({
            // scrollEnabled: this._scrollEnabled,
            scale: this._scale,
            iconTop: this._iconTop,
            bannerTop: this._bannerTop,
            opacity: this._opacity
          });
			   	this._updatePosition();
		    },
		    onPanResponderTerminationRequest: (evt, gestureState) => true,
		    onPanResponderRelease: this._endMove,
		    onPanResponderTerminate: this._endMove,
		    onShouldBlockNativeResponder: (event, gestureState) => true,
	 	});

	    this._userStyles = {
	      style: {
	        top: this._previousTop,
	      }
	    };

  	},
  componentDidMount: function() {
		this._updatePosition();
	},
	render: function () {
		var panProps = this.state.scrollEnabled?{}:{...this._panResponder.panHandlers};
		return(
			<View ref={(user) => {this.user = user;}} style={styles.userContainer} {...panProps}>
				<View style={styles.userPanel}>
          <Image style={[styles.banner,{top: this.state.bannerTop}]} source={require("./img/banner.png")}></Image>
          <View style={[styles.iconContainer,{top:this.state.iconTop,transform:[{scale:this.state.scale}]}]}><Image style={styles.icon} source={require("./img/icon.png")}></Image></View>
          <View style={styles.userControl}>
            <TouchableHighlight style={styles.controlIcon}>
              <Icon name="gear-a" color="#8999a5" size={20}></Icon>
            </TouchableHighlight>
            <TouchableHighlight style={styles.controlBtn}>
              <Icon name="person-stalker" color="#8999a5" size={20}></Icon>
            </TouchableHighlight>
            <TouchableHighlight style={styles.controlBtn2}>
              <Text style={styles.controlBtnText}>编辑个人资料</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoName}>Github</Text>
            <Text style={styles.userInfoAccount}>@Github</Text>
            <View style={styles.userInfoFollow}>
              <Text style={styles.userInfoFollowing}><Text style={styles.fontEm}>183</Text> 正在关注</Text>
              <Text style={styles.userInfoFollower}><Text style={styles.fontEm}>830k</Text> 关注者</Text>
            </View>
          </View>
          {this.state.bannerTop<=0?<View></View>:<Image style={[styles.banner,{top: this.state.bannerTop}]} source={require("./img/banner.png")}></Image>}
          {this.state.bannerTop<=0?<View></View>:<Image style={[styles.banner,{top: this.state.bannerTop, opacity:this.state.opacity}]} source={require("./img/bannerBlur.png")}></Image>}
          <Text style={{position:"absolute",left:160, fontSize:20, fontWeight:"500", top: this.state.bannerTop+90,opacity:this.state.opacity, backgroundColor:"transparent", color:"#fff"}}>Github</Text>
          <View style={styles.segment}>
            <SegmentedControlIOS values={['推文', '媒体', '喜欢']}  selectedIndex={0} tintColor="#2aa2ef"/>
          </View>
				</View>
				<ScrollView contentInset={{top:0}} style={styles.detailScroll} scrollEnabled={this.state.scrollEnabled}>
					<View style={{width:Util.size.width,backgroundColor:"#f5f8fa"}}>
            <Image style={{width:Util.size.width, height:0.835*Util.size.width, resizeMode:"contain"}} source={require('./img/moreinfo.png')}></Image>
          </View>
				</ScrollView>
			</View>
		)
	}
})

var TwitterTab = React.createClass({
  getInitialState: function () {
    return {
      selectedTab:'我',
    }
  },
  changeTab(tabName) {
      this.setState({
        selectedTab: tabName
      });
  },
  render: function(){
    return (
      <TabBarIOS
        barTintColor="#fff"
        tintColor="#1b95e0">
        <Icon.TabBarItem
        title="主页"
        iconName="ios-home-outline"
        selectedIconName="ios-home"
        onPress={ () => this.changeTab('主页') }
        selected={ this.state.selectedTab === '主页' }>
          <TwitterUser></TwitterUser>
        </Icon.TabBarItem>
        <Icon.TabBarItem
        title="通知"
        iconName="ios-bell-outline"
        selectedIconName="ios-bell"
        onPress={ () => this.changeTab('通知') }
        selected={ this.state.selectedTab === '通知'}>
          <TwitterUser></TwitterUser>
        </Icon.TabBarItem>
        <Icon.TabBarItem
        title="私信"
        iconName="ios-email-outline"
        selectedIconName="ios-email"
        onPress={ () => this.changeTab('私信') }
        selected={ this.state.selectedTab === '私信'}>
          <TwitterUser></TwitterUser>
        </Icon.TabBarItem>
        <Icon.TabBarItem
        title="我"
        iconName="ios-person-outline"
        selectedIconName="ios-person"
        onPress={ () => this.changeTab('我') }
        selected={ this.state.selectedTab === '我'}>
          <TwitterUser></TwitterUser>
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
});

var Day9 = React.createClass({
	componentDidMount: function () {
		StatusBarIOS.setStyle(1);
	},
	render: function () {
		return(
			<View style={styles.twitterContainer}>
				<TwitterTab></TwitterTab>
			</View>
		)
	}
})

const styles = StyleSheet.create({
	itemWrapper:{
    	backgroundColor: '#fff'
  },
	twitterContainer:{
    	width: Util.size.width,
    	height: Util.size.height,
      backgroundColor:"#f5f8fa",
  },
	userContainer:{
		width: Util.size.width,
  	height: Util.size.height-50,
  	backgroundColor:"#fff",
  	position:"absolute",
  	top:0,
  	left:0,
	},
	detailScroll:{
		position:"absolute",
		top: 300,
		backgroundColor:"#f5f8fa",
		width: Util.size.width,
  	height: Util.size.height-350,
  	left:0,
    borderTopWidth:Util.pixel,
    borderTopColor:"#9eacb6"
	},
	userPanel:{
		flex:1,
		height:300,
	},
	banner:{
		width: Util.size.width,
		height:125,
		position:"absolute",
		top:0,
		left:0
	},
  iconContainer:{
    position:"absolute",
    left:10,
    top:95,
    borderWidth:5,
    borderColor:"#fff",
    borderRadius:5,
  },
  icon:{
    width:68,
    height:68
  },
  userControl:{
    height:55,
    position:"absolute",
    top:125,
    width: 200,
    right:10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  controlBtn:{
    borderColor:"#8999a5",
    borderWidth:1,
    paddingTop:3,paddingLeft:5,paddingBottom:3,paddingRight:5,
    borderRadius:3,
    width:40,
    height:30,
    alignItems:"center",
    justifyContent:"center"
  },
  controlBtn2:{
    borderColor:"#8999a5",
    borderWidth:1,
    paddingTop:3,paddingLeft:5,paddingBottom:3,paddingRight:5,
    borderRadius:3,
    width:120,
    height:30,
    alignItems:"center",
    justifyContent:"center"
  },
  controlIcon:{
    width: 30
  },
  controlBtnText:{
    color:"#8999a5",
    fontSize:14
  },
  userInfo:{
    width: Util.size.width,
    position:"absolute",
    top: 165,
    paddingTop:15, paddingLeft:15, paddingBottom:15,
    left:0,
    height:90,
  },
  userInfoName:{
    color:"#292f33",
    fontSize:20,
    fontWeight:"500",
    paddingBottom:5
  },
  userInfoAccount:{
    color:"#66757f",
    paddingBottom:5
  },
  userInfoFollower:{
    color:"#95a4ae",
    width:110
  },
  userInfoFollowing:{
    color:"#95a4ae",
    width:110
  },
  userInfoFollow:{
    flexDirection:"row"
  },
  fontEm:{
    color:"#292f33",
    fontWeight:"500"
  },
  segment:{
    position: "absolute",
    top: 263,
    left:0,
    width: Util.size.width-15,
    paddingLeft:15,
    height:40,
  }
});

module.exports = Day9;