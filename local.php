<!DOCTYPE html>
<html>
<head>
	<title>Explore | Go-ogle!</title>
	<? include('inc.php') ?>
</head>

<body>
<? include('nav.php') ?>

<div class="container banner">
	<div class="empty" style="height: 80px;"></div>
</div>
<div class="container" id="map">
</div>
<? include('footer.php') ?>
<script>
	$('.menu li:nth-child(2)').addClass("active");
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap" async defers></script>
</body>
</html>
