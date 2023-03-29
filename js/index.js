// Sketchfab Viewer API: Start/Stop the viewer
var version = '1.12.1';
var uid = '3a27a2c8e88f4d18bbf9a10e9efbc5f1';
var iframe = document.getElementById('api-frame');
var client = new Sketchfab(iframe);
var error = function error() {
  console.error('Sketchfab API error');
};
var success = function success(api) {
  api.start(function () {
    api.addEventListener('viewerready', function () {
      api.getSceneGraph(function (err, result) {
        if (err) {
          console.log('Error getting nodes');
          return;
        }
        // get the id from that log
        console.log(result);
      });
      var id = 765;

      document.getElementById('hide').addEventListener('click', function () {
        api.hide(id);
      });
      document.getElementById('show').addEventListener('click', function () {
        api.show(id);
      });
      // temp Second ID
      var id2 = 835;

      document.getElementById('hide').addEventListener('click', function () {
        api.hide(id2);
      });
      document.getElementById('show').addEventListener('click', function () {
        api.show(id2);
      });
    });
  });
};
client.init(uid, {
  success: success,
  error: error,
  autostart: 1,
  preload: 1
});
//////////////////////////////////
// GUI Code
//////////////////////////////////
function initGui() {
  var controls = document.getElementById('controls');
  var buttonsText = '';
  buttonsText += '<button id="show">Show</button>';
  buttonsText += '<button id="hide">Hide</button>';
  controls.innerHTML = buttonsText;
}
initGui();

//////////////////////////////////
// GUI Code end
//////////////////////////////////