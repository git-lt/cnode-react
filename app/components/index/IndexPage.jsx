var React = require('react'),
	superagent = require('superagent'),
	NavBar = require('./NavBar'),
	TopicList = require('./TopicList');

var IndexPage = React.createClass({
    getInitialState: function() {
        return {
        	hostname: 'localhost',
            topicList: [],
            checkMore: false,
            nextPage: 1,
            tab: ''
        };
    },
    /**
     * 初次加载的时候请求数据
     */
    componentDidMount: function() {
        var _nextPage = this.state.nextPage;
        var _tab = this.props.location.query.tab || 'all';
        superagent
            .get('http://' + this.state.hostname + ':5001/getPage?page=' + _nextPage + '&tab=' + _tab)
            .end(function(err, data) {
                if (err) {
                    console.error(err);
                    return;
                }
                var topicList = data.body;
                if (this.isMounted()) {
                    this.setState({
                        topicList: topicList,
                        checkMore: true,
                        nextPage: 2,
                        tab: _tab
                    });
                }

            }.bind(this));
    },
    /**
     * 每次点击顶部的tab切换时候请求数据
     */
    componentWillReceiveProps: function(nextProps) {
       	var _tab = nextProps.location.query.tab;
        superagent
            .get('http://' + this.state.hostname + ':5001/getPage?tab=' + _tab + '&page=1')
            .end(function(err, data) {
                if (err) {
                    console.error(err);
                    return;
                }
                var topicList = data.body;
                this.setState({
                    topicList: topicList,
                    tab: _tab,
                    nextPage: 2
                });
            }.bind(this));
    },
    /**
     * 请求更多数据
     */
    checkMore: function() {
        var _nextPage = this.state.nextPage;
        var _tab = this.state.tab;
        superagent
            .get('http://' + this.state.hostname + ':5001/getPage?page=' + _nextPage + '&tab=' + _tab)
            .end(function(err, data) {
                var topicList = this.state.topicList.concat(data.body);
                if (err) {
                    console.error(err);
                    return;
                }
                this.setState({
                    topicList: topicList,
                    nextPage: (this.state.nextPage + 1)
                });

            }.bind(this));
    },
	render: function() {
		return (
			<div>
				<NavBar />
				<TopicList topicList={this.state.topicList} checkMore={this.checkMore} />
			</div>
		);
	}
});

module.exports = IndexPage;