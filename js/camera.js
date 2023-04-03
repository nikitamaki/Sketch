// Sketchfab Viewer API: Hover/click interactions
var version = '1.12.1';
var uid = '3a27a2c8e88f4d18bbf9a10e9efbc5f1';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
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
      });
        //////Camera Set position
        // api.getCameraLookAt(function(err, camera) {
        //   window.console.log(camera.position); // [x, y, z]
        //   window.console.log(camera.target); // [x, y, z]
        // });
        // api.setCameraLookAt([0, 13, 10], [0, 10, 0], 4.3, function(err) {
        //   if (!err) {
        //       window.console.log('Camera moved');
        //   }
        // });
        api.getFov(function(err, fov) {
          if (!err) {
              window.console.log('FOV is', fov); // 45
          }
        });
        api.addEventListener(
          'click',
          function(node) {
              window.console.log('click at', node.instanceID);
              var id = 770;
              var id2 = 840;
              if (node.instanceID === id) {
              api.addEventListener('click', function () {
                api.hide(id);
              });}
              if (node.instanceID === id2) {
                api.addEventListener('click', function () {
                  api.hide(id2);
              });}
              document.getElementById('show').addEventListener('click', function () {
                api.show(id);
                api.show(id2);
              });
          },
          { pick: 'fast' }
      );      
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

// function initGui() {
//   var controls = document.getElementById('controls');
//   var buttonsText = 'Hover, Click and check browser dev tools console';
//   controls.innerHTML = buttonsText;
// }
// initGui();

function initGui() {
  var controls = document.getElementById('controls');
  var buttonsText = '';
  buttonsText += '<button id="show">Show</button>';
  // buttonsText += '<button id="hide">Hide</button>';
  controls.innerHTML = buttonsText;
}
initGui();

//////////////////////////////////
// GUI Code end
//////////////////////////////////