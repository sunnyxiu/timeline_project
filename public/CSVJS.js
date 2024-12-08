console.log("0.1.37");

function readCSV(event) {

  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = XLSX.read(e.target.result, { type: 'binary' });

      // 假設您的數據在第一个工作表中
      const worksheet = data.Sheets[data.SheetNames[0]];
      jsonData = XLSX.utils.sheet_to_json(worksheet);

      // jsonData 现在是一个包含所有数据的 JavaScript 对象数组
      console.log(jsonData);

      // ... (您后续的处理逻辑，使用 jsonData 代替 data)
      newdata = jsonData;
      sortSerializedDatesDescending(jsonData);
      agreeArray = [];
      disagreeArray = [];

      // 遍歷 jsonData，根據條件將資料分到不同的陣列
      jsonData.forEach(item => {
        if (item["贊成論點/其他想法"] === "贊成論點") {
          agreeArray.push(item);
        } else {
          disagreeArray.push(item);
        }
      });
      renew()
    };
    reader.readAsBinaryString(file);

  }

}

function fetchAndReadCSV(fileUrl,callback) {
  fetch(fileUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.arrayBuffer(); // 以 ArrayBuffer 讀取檔案
    })
    .then(buffer => {
      const data = new Uint8Array(buffer); // 將 ArrayBuffer 轉成 Uint8Array
      const workbook = XLSX.read(data, { type: 'array' }); // 使用 XLSX 解析檔案

      // 假設您的數據在第一个工作表中
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('解析後的 JSON 資料:', jsonData);

      
      sortSerializedDatesDescending(jsonData);
      // 自訂處理邏輯
      handleData(jsonData);

      if (callback) callback(jsonData);
    })
    .catch(error => {
      console.error('讀取檔案時發生錯誤:', error);
    });
}
function handleData(jsonData) {
  agreeArray = [];
  disagreeArray = [];

  // 遍歷 jsonData，根據條件將資料分到不同的陣列
  jsonData.forEach(item => {
    item["timestamp_Real"] = new Date(item.timestamp).getTime();
    if (item["贊成論點/其他想法"] === "贊成論點") {
      agreeArray.push(item);
    } else {
      disagreeArray.push(item);
    }
  }); console.log('贊成陣列:', agreeArray);
  console.log('反對陣列:', disagreeArray);

  // 呼叫自訂的更新邏輯
  renew(agreeArray, disagreeArray);
}


function pushDiv(data) {
  const commentDiv = document.createElement('div');
  commentDiv.innerHTML = `
    <!-- ko template: {name: templateToUse, afterRender: afterRenderMessageShowTemplate} -->
  <div class="flex-center align-baseline message-text-wrap">
	<div class="seconded-message-list">
		<div class="seconded-message-card mb-4 secondary-background" data-bind="css: {&#39;secondary-background&#39;: isSideTypePositive, &#39;primary-background&#39;: isSideTypeNegative}">
			<div class="flex-between mb-2">
				<div class="flex-start message-user-wrapper">
					<img class="message-user-image mr-2" src="./要求政府修訂航空動物運輸條例，確保寵物安全及權益，以符合國際動物保護規範。- 提點子 -公共政策網路參與平臺_files/lecture_detail_03.jpg" data-original="/images/lecture_detail_03.jpg" data-bind="attr:{src:checkAuthorPicture($element)}" alt="">
					<span class="message-user-title">
						<span data-bind="text: author.displayName">${data.留言者名稱}</span>
						<span data-bind="visible: isBlankAuthorName" style="display: none;">匿名</span>
					</span>
				</div>
				<span class="text-gray message-date">
					<span class="mr-3" data-bind="html: sideFloorNumberText">#${data.序號}&nbsp;</span>
					<!--ko text: beforeNow-->${data.timestamp}<!--/ko-->
				</span>
			</div>

			<!--ko if: hasImages--><!--/ko-->

							<p style="text-align: left;" data-bind="html: content4Html">${data.留言內容}</p>
				<!-- ko foreach: {data: links, as: 'rdqLink'} --><!-- /ko -->
			

			<div class="flex-between message-tool-wrapper">
				<div class="flex-start flex-wrap">
					<div>
						<a class="good-num mr-2" role="button" title="點擊贊成此留言" data-bind="click: agreeAction,css: {&#39;now&#39; : agreed()}, attr:{&#39;title&#39;: agreeBtnTitle}">
							<span data-bind="ceilCounter: agreeCount" title="數量：${data.贊成數量}">${data.贊成數量}</span>
						</a>
						<a class="other-num mr-4" role="button" title="點擊反對此留言" data-bind="click: disagreeAction,css: {&#39;now&#39;: disagreed()},attr:{&#39;title&#39;: disagreeBtnTitle}">
							<span data-bind="ceilCounter: disagreeCount" title="數量：${data.反對數量}">${data.反對數量}</span>
						</a>
					</div>
					<div>
						<a tabindex="0" class="report-btn text-gray" role="button" title="" data-bind="mcbReport: true" data-original-title="檢舉不當發言">檢舉</a>
					</div>
				</div>


			</div>
		</div>
	</div>
</div>
<!-- /ko -->
    `;
  return commentDiv;
}

function pushDiv2(data) {
  const commentDiv = document.createElement('div');
  commentDiv.innerHTML = `
    
<!-- ko template: {name: templateToUse, afterRender: afterRenderMessageShowTemplate} -->
              <div class="flex-center align-baseline message-text-wrap">
                <div class="seconded-message-list">
                  <div class="seconded-message-card mb-4 primary-background"
                    data-bind="css: {&#39;secondary-background&#39;: isSideTypePositive, &#39;primary-background&#39;: isSideTypeNegative}">
                    <div class="flex-between mb-2">
                      <div class="flex-start message-user-wrapper">
                        <img class="message-user-image mr-2"
                          src="./要求政府修訂航空動物運輸條例，確保寵物安全及權益，以符合國際動物保護規範。- 提點子 -公共政策網路參與平臺_files/lecture_detail_03.jpg"
                          data-original="/images/lecture_detail_03.jpg"
                          data-bind="attr:{src:checkAuthorPicture($element)}" alt="">
                        <span class="message-user-title">
                          <span data-bind="text: author.displayName">${data.留言者名稱}</span>
                        </span>
                      </div>
                      <span class="text-gray message-date">
                        <span class="mr-3" data-bind="html: sideFloorNumberText">#${data.序號}&nbsp;</span>
                        <!--ko text: beforeNow-->${data.timestamp}<!--/ko-->
                      </span>
                    </div>

                    <!--ko if: hasImages--><!--/ko-->

                      <p style="text-align: left;" data-bind="html: content4Html">${data.留言內容}</p>
                      <!-- ko foreach: {data: links, as: 'rdqLink'} --><!-- /ko -->
                    

                    <div class="flex-between message-tool-wrapper">
                      <div class="flex-start flex-wrap">
                        <div>
                          <a class="good-num mr-2" role="button" title="點擊贊成此留言"
                            data-bind="click: agreeAction,css: {&#39;now&#39; : agreed()}, attr:{&#39;title&#39;: agreeBtnTitle}">
                            <span data-bind="ceilCounter: agreeCount" title="數量：${data.贊成數量}">${data.贊成數量}</span>
                          </a>
                          <a class="other-num mr-4" role="button" title="點擊反對此留言"
                            data-bind="click: disagreeAction,css: {&#39;now&#39;: disagreed()},attr:{&#39;title&#39;: disagreeBtnTitle}">
                            <span data-bind="ceilCounter: disagreeCount" title="數量：${data.反對數量}">${data.反對數量}</span>
                          </a>
                        </div>
                        <div>
                          <a tabindex="0" class="report-btn text-gray" role="button" title=""
                            data-bind="mcbReport: true" data-original-title="檢舉不當發言">檢舉</a>
                        </div>
                      </div>

                      <span>
                        <a class="link-text collapsed" role="button" title="點擊查看更多留言內容" aria-expanded="false"
                          data-bind="attr:{&#39;data-mcb&#39;: &#39;mcb_&#39;+msgUid(), &#39;aria-controls&#39;: &#39;mcb_&#39;+msgUid()}, mcbCollapse: true"
                          data-mcb="mcb_1721381565914" aria-controls="mcb_1721381565914" style="display: none;">
                          查看更多
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /ko -->
    `;
  return commentDiv;
}

function renew() {
  document.getElementById('comment_positive').innerHTML = "";
  document.getElementById('comment_negative').innerHTML = "";

  agreeArray.forEach(item => {
    console.log("TEST");
    document.getElementById('comment_positive').appendChild(pushDiv(item));

  });
  disagreeArray.forEach(item => {
    console.log("TEST");
    document.getElementById('comment_negative').appendChild(pushDiv2(item));

  });
}

function sortSerializedDatesAscending(data) {
  // 升序排序（舊到新）
  return data.sort((a, b) => {
    //const dateA = new Date(1900, 0, 1);
    const dateA = new Date(a.timestamp).getTime();
    console.log(typeof (a.timestamp));
    console.log(dateA);
    //dateA.setTime(a.timestamp * 86400 * 1000);
    const dateB = new Date(b.timestamp).getTime();
    //dateB.setTime(b.timestamp * 86400 * 1000);
    return dateA - dateB;
  });
}

function sortSerializedDatesDescending(data) {
  // 降序排序（新到舊）
  return data.sort((a, b) => {
    const dateA = new Date(a.timestamp);

    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
}
function sortByLikesDescending(data) {
  return data.sort((a, b) => {
    return b.贊成數量 - a.贊成數量;
  });
}

var jsonData;
var agreeArray = [];
var disagreeArray = [];

console.log("checkpoint");