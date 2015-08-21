package com.assuredlabor.websocketcontrollers;

import java.util.Vector;

import javax.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.assuredlabor.model.IncomingEvent;
import com.assuredlabor.model.Mensaje;
import com.assuredlabor.model.Stock;
import com.assuredlabor.model.StockItem;
import com.assuredlabor.model.enums.Event;

@Slf4j
@Controller
public class BookingGroceryWebSocketController {

	@Autowired
	private SimpMessagingTemplate template;

	private static Vector<StockItem> fruitList;

	private TaskScheduler scheduler = new ConcurrentTaskScheduler();

	static {
		fruitList = new Vector<StockItem>();
		fruitList.add(new StockItem("apple", 110));
		fruitList.add(new StockItem("pineapple", 210));
		fruitList.add(new StockItem("lemon", 310));
		fruitList.add(new StockItem("banana", 410));
		fruitList.add(new StockItem("melon", 510));
		fruitList.add(new StockItem("watermelon", 610));
		fruitList.add(new StockItem("pear", 710));
	}

	public BookingGroceryWebSocketController() {
		log.info("Construyend BookingGroceryWebSocketController");
	}

	@PostConstruct
	private void broadcastLoop() {

		scheduler.scheduleAtFixedRate(new Runnable() {

			@Override
			public void run() {
				broadCast("repaintStock", "Welcome !");
			}

		}, 2000);

	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index() {
		return "index";
	}

	@MessageMapping("/event")
	public void getEvent(IncomingEvent incomingEvent) throws Exception {
		log.info("incoming event: {}", incomingEvent);

		switch (incomingEvent.getEventEnum()) {
		case BUY:
		case SELL:
			recalculateStockToFruitList(incomingEvent.getEventEnum(), incomingEvent.getFruta(), incomingEvent.getCantidad());
			broadCast("repaintStock", null);
			break;
		case ADD_FRUIT:
			addNewFruitToStock(incomingEvent.getFruta(), incomingEvent.getCantidad());
			broadCast("repaintStock_updateFruitsSelect", null);
			break;
		}

	}

	private void recalculateStockToFruitList(Event event, String fruta, Integer cantidad) {
		for (StockItem stockItem : fruitList) {
			if (stockItem.getFruta().trim().equals(fruta.trim())) {

				if (event.equals(Event.BUY))
					stockItem.setCantidad(stockItem.getCantidad() + cantidad);
				else
					stockItem.setCantidad(stockItem.getCantidad() - cantidad);
				break;
			}
		}
	}

	private void addNewFruitToStock(String fruta, Integer cantidad) {
		fruitList.add(new StockItem(fruta, cantidad));
	}

	private void broadCast(String event, String message) {
		Stock stock = new Stock(fruitList);
		Mensaje msj = new Mensaje(event, message, stock);

		template.convertAndSend("/topic/price", msj);
	}

}