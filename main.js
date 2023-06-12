let cityData = [
  { name: "", lat: "", lon: ""},
  { name: "元智", lat: 24.9703173, lon: 121.2608673 }
];

$(function(){
  for(let x=0;x<cityData.length;x++){
    $("#citySelect").append(
        `<option value='${x}'>${cityData[x].name}</option>`
    );
}
loadServer();
});
var count_red=0,count_green=0,count_milktea=0;
$(".box").on({
  "dragstart": function(event){
    console.log("dragstart");
  event.originalEvent.dataTransfer.setData('text/plain',event.target.id)
  },
  "dragend": function(){
    console.log("dragend");
    $(".target").removeClass("over")
  }
})
$(".box").on("click", function(event) {
  var id = $(this).attr("id");
  $(this).clone().appendTo("#target2");
  switch (id) {
    case "box1":
      count_red++;
      $(".red-tea a").text(count_red);
      break;
    case "box2":
      count_green++;
      $(".green-tea a").text(count_green);
      break;
    case "box3":
      count_milktea++;
      $(".milk-tea a").text(count_milktea);
      break;
    default:
      break;
  }
});
$("#target2").on({
  "dragenter": function(event){
    event.preventDefault();
    console.log("dragenter");
  },
  "dragover": function(event){
    event.preventDefault();
    $(this).addClass("over")
    
    console.log("dragover");
    
  },
  "dragleave": function(){
    console.log("dragleave");
    $(".target").removeClass("over")
    
  },
  "drop": function(event){
    event.preventDefault();
    console.log("drop");
    let id = event.originalEvent.dataTransfer.getData('text/plain');
    $("#"+id).clone().appendTo(event.target);
    switch (id) {
      case "box1":
        count_red++;
        $(".red-tea a").text(count_red);
        break;
      case "box2":
        count_green++;
        $(".green-tea a").text(count_green);
        break;
      case "box3":
        count_milktea++;
        $(".milk-tea a").text(count_milktea);
        break;
      default:
        break;
    }
  }
})
$("#target2").on("dblclick", ".box", function(event) {
  $(this).remove();
  var id = $(this).attr("id");
  switch (id) {
    case "box1":
      count_red--;
      $(".red-tea a").text(count_red);
      break;
    case "box2":
      count_green--;
      $(".green-tea a").text(count_green);
      break;
    case "box3":
      count_milktea--;
      $(".milk-tea a").text(count_milktea);
      break;
    default:
      break;
  }
});
$(document).ready(function() {
  $("#submit").click(function() {
    // 開啟新視窗
    var newWindow = window.open("", "_blank", "width=500,height=500");

    var meterElement = "<meter id='progressMeter' min='0' max='20' value='0'></meter>";
    newWindow.document.write(meterElement);

    // 定義計時器 每秒增加進度條值
    var progressValue = 0;
    var timer = setInterval(function() {
      progressValue++;
      newWindow.document.getElementById('progressMeter').value = progressValue;
      
      // 判斷是否達到最大值，若是則停止計時器
      if (progressValue >= 20) {
        clearInterval(timer);
      }
    }, 1000);

    // 設定定時器，在 20 秒後關閉新視窗
    setTimeout(function() {
      let mp3 = new Audio('y1698.mp3')
      mp3.loop = false;
      mp3.play()
      setTimeout(function() {
        mp3.pause();
        mp3.currentTime = 0;
        newWindow.close();
      }, 5000);
      newWindow.close();
    }, 20000);

    // 在新視窗中添加其他內容
    newWindow.document.write("<h2>餐點製作中，看些報紙耗時間！</h2>");
    loadServerData(newWindow);

  });
  $("#clear").click(function() {
    $("#target2").empty();
    count_red = 0;
    count_green = 0;
    count_milktea = 0;
    $(".red-tea a").text(count_red);
    $(".green-tea a").text(count_green);
    $(".milk-tea a").text(count_milktea);
  });
});
function loadServerData(newWindow) {
  let rss2json = "https://api.rss2json.com/v1/api.json?rss_url=";
  $.getJSON(rss2json + "https://www.mohw.gov.tw/rss-16-1.html")
    .done(function(data) {
      var tableElement = "<table id='myTable'><thead><tr><th>標題</th><th>日期</th></tr></thead><tbody></tbody></table>";
      newWindow.document.write(tableElement);

      for (let x = 0; x < data.items.length; x++) {
        newWindow.document.querySelector("#myTable tbody").innerHTML +=
          `<tr><td><a target='_blank' href='${data.items[x].link}'>${data.items[x].title}</a></td><td>${data.items[x].pubDate.split(" ")[0]}</td></tr>`;
      }
      console.log("Success");
    })
    .fail(function() {
      console.log("Error");
    })
    .always(function() {
      console.log("Always");
    });
}
function loadServer(){
  console.log("[loadServerData] in");

  $("#result").empty();
  if(this.value == 0) return;
  // Request Weather Data
  let weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?";
  let weatherMapAPIKey = "5608cab827d968d5a63c6dddf541c53e";
  $.getJSON(weatherAPI_URL,{
      lat:cityData[1].lat,
      lon:cityData[1].lon,
      appid:weatherMapAPIKey,
      units:'metric',
      lang:'zh_tw'
  })
  .done(function(data){
      console.log(data);
      $("#result").append(
          `<p>氣溫：${data.main.temp_min} ~ ${data.main.temp_max}</p>`
      );
      $("#result").append(
          `<p><img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'>${data.weather[0].description}</p>`
      );
  })
  .fail(function(){console.log("Error")})
  .always(function(){console.log("Always")});

}
