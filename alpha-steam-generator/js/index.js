// Sketchfab Viewer API: Hover/click interactions
var version = '1.12.1';
var uid = '3a27a2c8e88f4d18bbf9a10e9efbc5f1';
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
var error = function error() {
  console.error('Sketchfab API error');
};
const id = 777;
const id2 = 835;
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
        // ------------ Hide some ID -----------
        api.addEventListener('click', function(node) {
              window.console.log('click at', node.instanceID,);
              if (node.instanceID === id) {
                api.addEventListener('click', function () {
                  api.hide(id);
              });}
              else if (node.instanceID === id2) {
                api.addEventListener('click', function () {
                  api.hide(id2);
              });}
              // --------- Show if click outside -------
              else {
                api.addEventListener('click', function () {
                api.show(id);
                api.show(id2);
              });}
          },
          { pick: 'fast' }
      );});
    api.addEventListener('annotationFocus', function(index) {
      if (index === 6) {
        api.hide(id);
      }
      else if (index === 7){
        api.hide(id2);
      }
      else if (index != 7||6){
        api.show(id);
        api.show(id2);
      }
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