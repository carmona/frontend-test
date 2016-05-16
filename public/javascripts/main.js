//Google Fonts

WebFontConfig = {
  google: { families: [ 'Montserrat::latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

// your code
(function(){

  var rankItems = [];
  var localURL = window.location.origin;
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = parseData;
  httpRequest.open('GET', localURL+'/fazenda.json');
  httpRequest.send();

  function parseData() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        rankItems = JSON.parse(httpRequest.responseText).data;
        sortItems();
        renderItems();
      } else {
        alert('Houve um problema com a conexão ou seu navegador. Por favor, tente novamente.');
      }
    }
  }

  function sortItems() {
    rankItems.forEach(function(item){
      item.score = item.negativePercentage = item.positivePercentage = 0;

      if(item.positive && item.negative){
        item.negative = item.negative*1;
        item.positive = item.positive*1;
        item.total = item.negative + item.positive;
        item.negativePercentage = (item.negative / item.total).toFixed(2) * 100;
        item.positivePercentage = (item.positive / item.total).toFixed(2) * 100;
      }

    });
    rankItems = rankItems.sort(function(a,b){return b.positivePercentage-a.positivePercentage});
  }

  function renderItems(){
    var templateRequest = new XMLHttpRequest();
    var templateString = "";
    var listElem = document.querySelector('#rank-list');
    templateRequest.onreadystatechange = parseTemplate;
    templateRequest.open('GET', localURL+'/partial-rank-item.html');
    templateRequest.send();

    function parseTemplate() {
      if (templateRequest.readyState === XMLHttpRequest.DONE) {
        if (templateRequest.status === 200) {
          templateString = templateRequest.responseText;
          iterateItems();
        } else {
          alert('Houve um problema com a conexão ou seu navegador. Por favor, tente novamente.');
        }
      }
    }

    function iterateItems() {
      console.time('render foreach');
      rankItems.forEach(function(item, index){
        var thisString = templateString.replace('{{picture}}',item.picture)
                            .replace('{{position}}',index+1)
                            .replace('{{name}}',item.name)
                            .replace('{{description}}',item.description)
                            .replace('{{positivePercentage}}',item.positivePercentage)
                            .replace('{{negativePercentage}}',item.negativePercentage);
        listElem.innerHTML += thisString;
      });
      console.timeEnd('render foreach');
    }
  }
})();