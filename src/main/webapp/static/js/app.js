$(document).ready(
		function() {
			var welcome = function(msj) {
				$("#welcomeMsg").text(msj);
			};

			var isSelectDraw = false;

			var drawSelect = function(stock) {
				$("#frutasSelect").empty();

				var $select = $("<select>").attr("name", "frutasSelect");

				stock.frutas.forEach(function(entry) {
					var $op = $("<option>").attr("value", entry.fruta).text(
							entry.fruta);

					$select.append($op);

					$("#frutasSelect").append($select);
				});
				isSelectDraw = true;
			};

			var drawStock = function(stock) {
				$("#stock tbody").empty();

				var i = 1;
				stock.frutas.forEach(function(entry) {

					var $tr = $("<tr>");

					var $td = $("<td>").text(entry.fruta);
					$tr.append($td);

					$td = $("<td>").text(entry.cantidad);
					$tr.append($td);

					if (i % 2 == 0)
						$tr.addClass('alt');

					$("#stock tbody").append($tr);
					i++;
				});

			};

			var socket = null;
			var stompClient = null;

			var firstTime = true;

			var initWs = function() {

				socket = new SockJS("/booking-spring-mvc-websockets/ws");
				stompClient = Stomp.over(socket);

				var onWelcomeMessage = function(data) {
					welcome(data.msj);

					drawStock(data.stock);

					drawSelect(data.stock);
				}

				var onRepaintStockMessage = function(data) {
					drawStock(data.stock);
				}

				var onUpdateFruitsSelect = function(data) {
					drawSelect(data.stock);
				}

				var onmessage = function(message) {

					var data = JSON.parse(message.body);
					var on = data.on;

					console.debug(on)

					if (on === "welcome")
						onWelcomeMessage(data);

					else if (on === "repaintStock") {

						if (firstTime) {
							onWelcomeMessage(data);
							firstTime = false;
						} else
							onRepaintStockMessage(data);

					}

					else if (on === "repaintStock_updateFruitsSelect") {
						onRepaintStockMessage(data);
						onUpdateFruitsSelect(data);
					}
				};

				var onerror = function() {
					console.log('error')
				}

				var onopen = function() {
					console.log('conexion establecida');
					stompClient.subscribe('/topic/price', onmessage);
				}

				/*
				 * socket.onclose = function() { console.log('close');
				 * reviewSocketConnection(); }
				 */

				stompClient.connect("guest", "guest", onopen, onerror);

			};

			var reviewSocketConnection = function() {
				/*
				 * if(!socket || socket.readyState == 3) initWs();
				 */
			}

			initWs();

			setInterval(reviewSocketConnection, 2000);

			$("#buyBtn").on('click', function(event) {
				event.preventDefault();
				sendEvent('buy');
			});

			$("#sellBtn").on('click', function(event) {
				event.preventDefault();
				sendEvent('sell');
			});

			var sendEvent = function(event) {
				var value = $("#cantidadTxt").val().trim();

				if (value === "" || isNaN(value)) {
					alertify.alert("Please enter a integer number.");
					$("#cantidadTxt").val("")
				} else {
					var json = {
						event : event,
						fruta : $("#frutasSelect option:selected").text(),
						cantidad : value
					};
					if (stompClient != null)
						stompClient
								.send("/app/event", {}, JSON.stringify(json));
				}
			};

			$("#addFruit").on("click", function(event) {
				event.preventDefault();
				$("#addFruitNameTxt").val("");
				$("#addQuantityTxt").val("");
				$("#hiddenDiv").slideDown('slow');
			});

			$("#cancelAddBtn").on("click", function(event) {
				event.preventDefault();
				$("#addFruitNameTxt").val("");
				$("#addQuantityTxt").val("");
				$("#hiddenDiv").slideUp('slow');
			});

			$("#addFruitBtn").on(
					"click",
					function(event) {
						event.preventDefault();

						var value = $("#addQuantityTxt").val().trim();

						if (value === "" || isNaN(value)) {
							alertify.alert("Please enter a integer number.");
							$("#addQuantityTxt").val("")
						} else {
							var json = {
								event : "add_fruit",
								fruta : $("#addFruitNameTxt").val(),
								cantidad : value
							};
							if (stompClient != null)
								stompClient.send("/app/event", {}, JSON
										.stringify(json));

							$("#cancelAddBtn").click();
						}

					});

			/*
			 * socket.onopen = function() { console.log('conexion establecida') }
			 * 
			 * socket.onerror = function() { console.log('error') }
			 * 
			 * socket.onclose = function() { console.log('close') }
			 * 
			 * socket.onmessage = function(message) {
			 * 
			 * var data = JSON.parse(message.data); var on = data.on;
			 * 
			 * console.debug(on)
			 * 
			 * if (on === "welcome") onWelcomeMessage(data);
			 * 
			 * else if (on === "repaintStock") onRepaintStockMessage(data); };
			 * 
			 * var onWelcomeMessage = function(data) { welcome(data.msj);
			 * 
			 * drawStock(data.stock);
			 * 
			 * drawSelect(data.stock); }
			 * 
			 * var onRepaintStockMessage = function(data) {
			 * drawStock(data.stock) }
			 */

		});