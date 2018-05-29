<!DOCTYPE html>
<html>
<head>
	<title>Go-ogle!</title>
	<? include('inc.php') ?>
</head>

<body>
<? include('nav.php') ?>
<div class="container banner">
	<div class="header">
		<h1>Go-ogle</h1>
		<h2>Explore the world!</h2>
		<p>Get latest news and social feed from across the world at one place.</p>
		<div class="actions">
		<a href="#trending" class="worldwide">Worldwide</a>
		<a href="local.php" class="local">Local</a>
	</div>
	</div>
	<div class="empty"></div>
</div>
<!-- The Modal -->
<div id="confirm" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
  	<span class="close">&times;</span>
  	<p>This page page contain sensitive media. Do you want to allow?</p>
  	<label class="switch" title="Allow media">
		<input type="checkbox" id="media">
		<span class="slider round"></span>
	</label>
  </div>

</div>
<div class="container">
	<div id="trending">
		<div class="c"></div>
		<h1>
			What are people talking about?
		</h1>
		<div class="row">
			<div class="column"></div>
			<div class="column"></div>
			<div class="column"></div>
			<div class="column"></div>
		</div>
	</div>
</div>
<? include('footer.php') ?>
<script>
	$('.menu li:nth-child(1)').addClass("active");
</script>
</body>
</html>