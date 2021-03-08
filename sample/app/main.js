	// DOMの読み込み終了時の処理を登録
	window.addEventListener('DOMContentLoaded', function() {
		// id="calc" のボタンを1つ選択
		let elCalc = document.querySelector('#calc');

		// ボタンをクリックしたときの処理を追加
		elCalc.addEventListener('click', function() {
			// class="price" 要素（商品1～3の金額）を全て選択
			let prices = document.querySelectorAll('.price');

			// 金額の合計を得る
			let priceSum = 0;	// 合計額用の変数
			for (let i = 0; i < prices.length; i ++) {
				let priceVal = prices[i].value;	// 入力欄の値を得る
				priceSum += parseInt(priceVal);	// 値を整数にして加算
			}

			// 表示用のHTML文字列を作る
			let html = '合計金額：<strong>' + priceSum + '</strong>円</div>';

			// id="output" の要素にHTML文字列を追加
			document.querySelector('#output').innerHTML = html;
		});
	});