<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Booking Grocery App</title>
<link rel="stylesheet" type="text/css"
	href="/booking-spring-mvc-websockets/static/css/form-style.css">

<link rel="stylesheet" type="text/css"
	href="/booking-spring-mvc-websockets/static/css/alertify.core.css" />
<link rel="stylesheet" type="text/css"
	href="/booking-spring-mvc-websockets/static/css/alertify.default.css"
	id="toggleCSS" />
</head>
<body>
	<h2>Booking Grocery App</h2>
	<h3 id="welcomeMsg">loading...</h3>

	<input type="button" id="addFruit" value="Add Fruit" />

	<br />
	<br />

	<div id="hiddenDiv" style="display: none;">
		<div class="datagrid" style="width: 50%;">
			<table>
				<thead>
					<tr>
						<th colspan="2">Add Fruit</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Fruit</td>
						<td><input type="text" id="addFruitNameTxt" /></td>
					</tr>
					<tr>
						<td>Quantity</td>
						<td><input type="text" id="addQuantityTxt"
							placeholder="(only integers please)" /></td>
					</tr>
					<tr>
						<td></td>
						<td><input type="button" value="Cancel" id="cancelAddBtn" />
							<input type="button" value="Add" id="addFruitBtn" /></td>

					</tr>
				</tbody>
			</table>
		</div>
		<br />
	</div>

	<div class="datagrid" style="width: 80%;">
		<table id="stock">
			<thead>
				<tr>
					<th>Fruits</th>
					<th>Quantity</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>

	<br />

	<div class="datagrid" style="width: 50%;">
		<table>
			<thead>
				<tr>
					<th colspan="2">Order</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Fruit</td>
					<td id="frutasSelect">loading...</td>
				</tr>
				<tr>
					<td>Quantity</td>
					<td><input type="text" id="cantidadTxt"
						placeholder="(only integers please)" /></td>
				</tr>
				<tr>
					<td></td>
					<td><input type="button" value="Buy" id="buyBtn" /> <input
						type="button" value="Sell" id="sellBtn" /></td>

				</tr>
			</tbody>
		</table>
	</div>

	<script src="/booking-spring-mvc-websockets/static/js/jquery-1.11.1.js"></script>
	<script src="/booking-spring-mvc-websockets/static/js/alertify.min.js"></script>
	<!-- <script src="/socket.io/socket.io.js"></script> -->
	<script src="/booking-spring-mvc-websockets/static/js/sockjs-0.3.4.js"></script>
	<script src="/booking-spring-mvc-websockets/static/js/stomp.js"></script>
	<script src="/booking-spring-mvc-websockets/static/js/app.js"></script>

</body>
</html>