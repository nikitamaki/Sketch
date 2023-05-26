// Sketchfab Viewer API: Hover/click interactions
var version = '1.12.1';
var uid = '9d25a8be1c0241adaf7c45dbfdeac664';
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
        // api.getFov(function(err, fov) {
        //   if (!err) {
        //       window.console.log('FOV is', fov); // 45
        //   }
        // });
        // ------------ Hide some ID -----------
        api.addEventListener('click', function(node) {
              window.console.log('click at', node.instanceID);
              var id = 758;
              var id2 = 792;
              if (node.instanceID === id) {
                api.addEventListener('click', function () {
                  api.hide(id);
              });}
              else if (node.instanceID === id2) {
                api.addEventListener('click', function () {
                  api.hide(id2);
              });}
              // show if unselected
              else {
                api.addEventListener('click', function () {
                api.show(id);
                api.show(id2);
              });}
              // if (node.instanceID === null) {
              //   api.addEventListener('click', function () {
              //   api.show(id);
              //   api.show(id2);
              // });}

              // document.getElementById('show').addEventListener('click', function () {
              //   api.show(id);
              //   api.show(id2);
              // });
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