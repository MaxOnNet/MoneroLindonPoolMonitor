$(document).ready(function() {
	// неведомая магия присвоения и получения кошелька
	var getWallet = " ", // значение из поля ввода кошелька
		walletAddress; // кошелек, за которым хотим следить
	$("#setWallet").click(function() {
		$("#settings").modal("show");
	});
	// переменные, которые хранят все данные
	var getMinerStats = "https://monero.lindon-pool.win/api/miner/" + localStorage.getItem("setting_wallet") + "/stats", // генерирует url для запроса данных о майнере
		networkDifficulty, // сложность сети
		networkHash, // хеш сети
		networkHeight, // высота
		networkLastBlockFoundTime, // когда сетью был найден последний блок
		reward, // награда за нахождение блока
		poolHashrate, // хешрейт пула
		poolTotalHashes, // сколько пул получил хешей от майнеров
		poolRoundHashes, // сколько нужно хешей для нахождения блока
		poolLastBlockFound, // когда пулом был найден последний блок
		poolTotalBlocksFound, // сколько блоков нашел пул
		poolMiners, // сколько майнеров на пуле
		currentEffort, // текущий effort
		minerHashrate, // хешрейт майнера, за которым следите
		minerTotalHashes, // сколько хешей отправил майнер
		minerUnpaid, // сколько невыплачено майнеру
		minerPaid, // сколько выплачено майнеру
		minerCoins, // сколько всего добыто
		toUSD, // курс Monero к USD
		toRUB; // курс Monero к Рублю
	// функция, переводящая время формата unix-timestamp в нормальное
	function timeConverter(UNIX_timestamp) {
		var a = new Date(UNIX_timestamp * 1000),
			months = ['01','02','03','04','05','06','07','08','09','10','11','12'],
			year = a.getFullYear(),
			month = months[a.getMonth()],
			date = a.getDate(),
			hour = a.getHours(),
			min = a.getMinutes(),
			sec = a.getSeconds(),
			time = date+'.'+month+'.'+year+', '+hour+':'+min+':'+sec;
		return time;
	};
	// функция собирает и выводит всю статистику
	function getStats() {
		// запрос к api на получение и вывод статистики о сети
		$.getJSON("https://monero.lindon-pool.win/api/network/stats", function(network) {
			networkDifficulty = network.difficulty;
			networkHash = network.hash;
			networkHeight = network.height;
			networkLastBlockFound = timeConverter(network.ts);
			reward = network.value/1000000000000;
			var network = `
				<li class="list-group-item"><b>Сложность:</b> ${networkDifficulty}</li>
				<li class="list-group-item"><b>Хеш:</b> <a href="https://xmrchain.net/block/${networkHash}" target="_blank">${networkHash}</a></li>
				<li class="list-group-item"><b>Высота:</b> ${networkHeight}</li>
				<li class="list-group-item"><b>Время последнего блока:</b> ${networkLastBlockFound}</li>
				<li class="list-group-item"><b>Награда за блок:</b> ${reward.toFixed(5)} XMR</li>
			`;
			$("#network").html(network);
		});
		// запрос к api на получение и вывод статистики о пуле
		$.getJSON("https://monero.lindon-pool.win/api/pool/stats", function(pool) {
			poolHashrate = pool.pool_statistics.hashRate/1000;
			poolTotalHashes = pool.pool_statistics.totalHashes/1000000000000;
			poolRoundHashes = pool.pool_statistics.roundHashes/1000000000;
			poolLastBlockFound = timeConverter(pool.pool_statistics.lastBlockFoundTime);
			poolTotalBlocksFound = pool.pool_statistics.totalBlocksFound,
			poolMiners = pool.pool_statistics.miners;
			var pool = `
				<li class="list-group-item"><b>Хешрейт:</b> ${poolHashrate.toFixed(2)} KH/s</li>
				<li class="list-group-item"><b>Принято хешей:</b> ${poolTotalHashes.toFixed(2)} TH</li>
				<li class="list-group-item"><b>Хешей в текущем блоке:</b> ${poolRoundHashes.toFixed(2)} GH</li>
				<li class="list-group-item"><b>Время последнего блока:</b> ${poolLastBlockFound}</li>
				<li class="list-group-item"><b>Найдено блоков:</b> ${poolTotalBlocksFound}</li>
				<li class="list-group-item"><b>Майнеры:</b> ${poolMiners}</li>
			`;
			$("#pool").html(pool);
		});
		// запрос к api на получение и вывод статистики о майнере на пуле
		$.getJSON(getMinerStats, function(api) {
			minerHashrate = api.hash/1000;
			minerTotalHashes = api.totalHashes/1000000;
			minerUnpaid = api.amtDue/1000000000000;
			minerPaid = api.amtPaid/1000000000000;
			minerCoins = (minerUnpaid+minerPaid).toFixed(5);
			currentEffort = poolRoundHashes/networkDifficulty*100000000000;
			if (minerHashrate == undefined) {
				minerHashrate = 0;
			} else {
				minerHashrate = api.hash/1000;
			};
			var mining = `
				<li class="list-group-item"><b>Текущий effort:</b> ${currentEffort.toFixed(2)}%</li>
				<li class="list-group-item"><b>Хешрейт:</b> ${minerHashrate.toFixed(2)} KH/s</li>
				<li class="list-group-item"><b>Всего хешей:</b> ${minerTotalHashes.toFixed(2)} MH</li>
				<li class="list-group-item"><b>Валидные шары:</b> ${api.validShares}</li>
				<li class="list-group-item"><b>Битые шары:</b> ${api.invalidShares}</li>
			`;
			$("#mining").html(mining);
		});
		$.getJSON("https://api.cryptonator.com/api/ticker/xmr-btc", function(xmrBTC) {
			toBTC = xmrBTC.ticker.price;
			if (toBTC == undefined) {
				toBTC = 0;
			} else {
				toBTC = xmrBTC.ticker.price;
			};
		});
		$.getJSON("https://api.cryptonator.com/api/ticker/xmr-usd", function(xmrUSD) {
			toUSD = xmrUSD.ticker.price*minerCoins;
			if (toUSD == undefined) {
				toUSD = 0;
			} else {
				toUSD = xmrUSD.ticker.price*minerCoins;
			};
		});
		$.getJSON("https://api.cryptonator.com/api/ticker/xmr-rub", function(xmrRUB) {
			toRUB = xmrRUB.ticker.price;
			if (toRUB == undefined) {
				toRUB = 0;
			} else {
				toRUB = xmrRUB.ticker.price*minerCoins;
			};
			var account = `
				<li class="list-group-item"><b>Баланс:</b> ${minerUnpaid.toFixed(5)} XMR</li>
				<li class="list-group-item"><b>Выплачено:</b> ${minerPaid.toFixed(5)} XMR</li>
				<li class="list-group-item"><b>Всего:</b> ${minerCoins} XMR (${toUSD.toFixed(2)} USD / ${toRUB.toFixed(2)} RUB)</li>
				<li class="list-group-item"><b>Адрес кошелька:</b> ${localStorage.getItem("setting_wallet")}</li>
			`;
			$("#balance").html(account);
		});
	};
	// выполнение всех функций
	getStats();
	// авто-обновление статистики без перезагрузки страницы
	setInterval(getStats, 3000);
	// сохранение и загрузка настроек
	$("#save").click(function() {
		getWallet = $("#wallet").val();
		localStorage.setItem("setting_wallet", getWallet);
		walletAddress = localStorage.getItem("setting_wallet");
		$("#wallet").val(walletAddress);
		getMinerStats = "https://monero.lindon-pool.win/api/miner/" + localStorage.getItem("setting_wallet") + "/stats"
		getStats();
	});
});