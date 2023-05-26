    var iframe = document.getElementById( 'api-frame' );
    var uid = 'a6a707900a7f4ea6a11867f7a742fbd9';

    var model = [];
    model['building'] = {
    id:'a6a707900a7f4ea6a11867f7a742fbd9',
    title: 'Building',
    slider: true
    };

    // By default, the latest version of the viewer API will be used.
    var client = new Sketchfab( iframe );


    var allmaterials; // all materials for the current loaded module are stored name and id
    client.init(model['building'].id, {
    ui_inspector: 0,
    ui_vr: 0,
    success: function onSuccess(api) {
        api.start();
        api.addEventListener('viewerready', function() {
            var layers = document.getElementById( 'layers');
            var html = "";
            // API is ready to use
            // Get initial material list for the model
            api.getMaterialList(function(err, materials) {
                if (!err) {
                    allmaterials = materials;
                    // add materials hide and show div's 
                    settestbuttons(allmaterials);
                }
            });
            function settestbuttons(allmaterials)
            {
                for (let index = 0; index < allmaterials. length; ++index) {
                    const el = document.createElement('button');
                    el.addEventListener('click', function handleClick(event) {

                        if(this.getAttribute('data-show') == 1)
                        {
                        tp = 0;
                        var materialToUpdate = allmaterials[this.getAttribute('data-id')];
                        materialToUpdate.channels.Opacity.enable = true;
                        materialToUpdate.channels.Opacity.factor = tp;
                        api.setMaterial (materialToUpdate); 
                        this.setAttribute( 'data-show', 0);
                        } else {
                        tp = 1;
                        var materialToUpdate = allmaterials[this.getAttribute('data-id')];
                        materialToUpdate.channels.Opacity.enable = true;
                        materialToUpdate.channels.Opacity.factor = tp;
                        api.setMaterial (materialToUpdate); 
                        this.setAttribute ('data-show', 1);
                        }
                    });
                    el.innerHTML = "Layer "+ index;
                    el.setAttribute( 'data-id', index);
                    el.setAttribute( 'data-show', 1);
                    
                    layers.appendChild(el);
                    
                    }
            }
            function togglelayer(id, tp) {
                var materialToUpdate = allmaterials [id];
                materialToUpdate.channels. Opacity.enable = true;
                materialToUpdate.channels. Opacity.factor = tp;
                api.setMaterial (materialToUpdate);
            }
        });
    },
        error: function onError() {
            console.log( 'Viewer error' );
        }
    })
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
    });
  });
};