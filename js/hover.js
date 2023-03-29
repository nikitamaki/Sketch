// Sketchfab Viewer API: Hover/click interactions
var version = '1.12.1';
// var uid = 'dd958716be0b4786b8700125eec618e5';
var uid = '3a27a2c8e88f4d18bbf9a10e9efbc5f1';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
var error = function error() {
  console.error('Sketchfab API error');
};
var success = function success(api) {
  api.addEventListener('nodeMouseEnter', function (info) {
    var y = info.material;
    y.channels.EmitColor.factor = 1;
    y.channels.EmitColor.enable = true;
    y.channels.EmitColor.color = [0.5, 0.5, 0.0];
    api.setMaterial(y, function () {
      console.log('highlighted ' + y.name);
    });
    console.log('nodeMouseEnter', info);
  }, {
    pick: 'fast'
  });
  api.addEventListener('nodeMouseLeave', function (info) {
    var y = info.material;
    y.channels.EmitColor.factor = 1;
    y.channels.EmitColor.enable = false;
    y.channels.EmitColor.color = [0.5, 0.5, 0.0];
    api.setMaterial(y, function () {
      console.log('highlighted ' + y.name);
    });
    console.log('nodeMouseLeave', info);
  }, {
    pick: 'fast'
  });
  api.addEventListener('click', function (info) {
    api.pickColor(info.position2D, function (results) {
      var rgba = 'rgba(' + results[0] + ', ' + results[1] + ', ' + results[2] + ', ' + results[3] + ')';
      console.log('pickColor %c ' + rgba, 'background: ' + rgba + ';');
    });
    console.log('click', info);
  }, {
    pick: 'fast'
  });
  api.start(function () {
    api.addEventListener('viewerready', function () {
      api.getSceneGraph(function (err, result) {
        if (err) {
          console.log('Error getting nodes');
          return;
        }
        console.log(result);
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
  var buttonsText = 'Hover, Click and check browser dev tools console';
  controls.innerHTML = buttonsText;
}
initGui();

//////////////////////////////////
// GUI Code end
//////////////////////////////////