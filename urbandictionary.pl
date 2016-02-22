use Mojolicious::Lite;
use Mojo::UserAgent;
use feature 'state';

use constant DEFINE_URL => 'http://api.urbandictionary.com/v0/define?term=';

get '/' => sub {
	shift->reply->static('index.html');
};

get '/define' => sub {
	state $key;

	my $c    = shift;
	my $term = $c->param('term');

	unless ($term) {
		return $c->render(json => {
			err     => Mojo::JSON->true,
			err_str => 'gimme term'
		});
	}

	my $ua    = Mojo::UserAgent->new;
	my $reply = $ua->get(DEFINE_URL . $term)->res->json;

	if ($reply->{result_type} eq 'no_results') {
		return $c->render(json => {
			err     => Mojo::JSON->true,
			err_str => "no results for '$term'"
		});
	}

	$c->render(json => {
		err        => Mojo::JSON->false,
		key        => ++$key,
		word       => $reply->{list}->[0]->{word},
		definition => $reply->{list}->[0]->{definition},
		example    => $reply->{list}->[0]->{example}
	});
};

app->start;
