var
	$render = ReactDOM.render,
	$cls    = React.createClass,
	$el     = React.createElement,
	$pt     = React.PropTypes;

var Input = $cls({
	propTypes: {
		onTermSubmit: $pt.func.isRequired
	},
	getInitialState: function() {
		return {term: ''};
	},
	handleTermChange: function (ev) {
		this.setState({term: ev.target.value});
	},
	handleSubmit: function (ev) {
		ev.preventDefault();
		this.props.onTermSubmit(this.state.term);
	},
	render: function () {
		return $el('form', {onSubmit: this.handleSubmit},
			$el('input', {
				type:        'text',
				value:       this.state.term,
				placeholder: 'Type any word here...',
				onChange:    this.handleTermChange
			}),
			$el('input', {
				type:  'submit',
				value: '→'
			})
		);
	}
});

var DefinitionList = $cls({
	propTypes: {
		definitions: $pt.array.isRequired
	},
	render: function () {
		var definitions = this.props.definitions.map(function (def) {
			return $el('li', {key: def.key},
				$el('b',    {}, def.word),
				$el('span', {}, def.definition),
				$el('i',    {}, def.example)
			);
		});
		return $el('ul', {id: 'def-list'}, definitions);
	}
});

var App = $cls({
	getInitialState: function() {
		return {definitions: []};
	},
	onTermSubmit: function (term) {
		var self = this;
		$.getJSON('/define', {term: term}, function (reply) {
			if (reply.err) {
				console.log('error: ' + reply.err_str);
				return;
			}
			var definitions = self.state.definitions;
			definitions.unshift({
				key:        reply.key,
				word:       reply.word,
				definition: reply.definition,
				example:    reply.example
			});
			self.setState({definitions: definitions});	
		});
	},
	render: function () {
		return $el('div', {},
			$el('div', {id: 'top-bar'},
				$el('h1', {}, 'my urbandictionary'),
				$el(Input, {onTermSubmit: this.onTermSubmit})
			),
			$el(DefinitionList, {definitions: this.state.definitions})
		);
	}
});

$render(
	$el(App),
	document.getElementById('app')
);
