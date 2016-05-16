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

  angular.module("r7test",[]);
  angular.module("r7test").controller("MainCtrl", MainCtrl);

  MainCtrl.$inject = ['$http','$window','$sce'];
  function MainCtrl($http, $window, $sce) {
    var thisCtrl = this;
    this.rankItems = [];
    var localURL = $window.location.origin;

    $http({
      method: 'GET',
      url: localURL+'/fazenda.json'
    }).then(function success(response){
      thisCtrl.rankItems = thisCtrl.sortItems(response.data.data);
    }, function error(response){
      alert('Houve um problema com a conexão ou seu navegador. Por favor, tente novamente.');
    });

    this.sortItems = function sortItems(items){
      items.forEach(function(item){
        item.negativePercentage = item.positivePercentage = 0;

        var txt = document.createElement("textarea");
        txt.innerHTML = item.description;
        item.description = txt.value;

        if(item.positive && item.negative){
          item.negative = item.negative*1;
          item.positive = item.positive*1;
          item.total = item.negative + item.positive;
          item.negativePercentage = (item.negative / item.total).toFixed(2) * 100;
          item.positivePercentage = (item.positive / item.total).toFixed(2) * 100;
        }

      });
      return items;
    };
  }
})();