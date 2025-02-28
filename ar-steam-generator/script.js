// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

 // Get the model-viewer element
 const modelViewer = document.getElementById('modelViewer');

 // Define camera orbits using the hotspot ID as the key
 const cameraSettings = {
   "hotspot-1": {
      orbit: "-69.47deg 78.41deg 0.72m",
      target: "-0.22m 0.19m 0.03m",
      fov: "12deg"
    },
   "hotspot-2": {
      orbit:"-115.2deg 72.54deg 0.7364m",
      target: "-0.22m 0.27m -0.06m",
      fov: "12deg"
    },
    "hotspot-3": {
      orbit:"-70.33deg 80.51deg 0.6927m",
      target: "-0.16m 0.25m 0.01m",
      fov: "12.37deg"
    },
    "hotspot-4": {
      orbit:"-65.27deg 69.14deg 0.648m",
      target: "-0.22m 0.04m 0.03m",
      fov: "12deg"
    },
    "hotspot-5": {
      orbit:"111.6deg 82.32deg 0.7435m",
      target: "0.23m 0.33m -0.05m",
      fov: "12deg"
    },
    "hotspot-6": {
      orbit:"73.02deg 91.96deg 0.686m",
      target: "0.2m 0.32m 0.05m",
      fov: "12deg"
    },
    "hotspot-7": {
      orbit:"-43.13deg 51.8deg 0.876m",
      target: "-0.05m 0.37m 0.05m",
      fov: "12deg"
    },
    "hotspot-8": {
      orbit:"-22.83deg 67.05deg 0.9783m",
      target: "-0.01m 0.15m 0.08m",
      fov: "12deg"
    },
 };

 // Get all hotspot buttons
 const hotspots = document.querySelectorAll('.Hotspot');

 // Add event listeners to each hotspot
 hotspots.forEach(hotspot => {
  hotspot.addEventListener('click', () => {
    const hotspotId = hotspot.id; // Get the ID of the clicked hotspot
    const settings = cameraSettings[hotspotId]; // Get the corresponding settings

    if (settings) {
      modelViewer.setAttribute('camera-orbit', settings.orbit); // Update camera orbit
      modelViewer.setAttribute('camera-target', settings.target); // Update camera target
      modelViewer.setAttribute('field-of-view', settings.fov); // Update camera target
      console.log(`Camera orbit changed to: ${settings.orbit}, Target set to: ${settings.target}`);
    }
  });
});