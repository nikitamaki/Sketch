function SketchfabAPIUtility(n, t, i) {
    var r = this, u;
    if (this.version = "3.0.0.3",
    this.api = null,
    this.client = null,
    this.clientInitObject = {
        merge_materials: 0,
        graph_optimizer: 0
    },
    i !== null)
        for (u in i)
            r.clientInitObject[u] = i[u];
    this.textureCache = {};
    this.isInitialized = !1;
    this.iframe = t;
    this.urlID = n;
    this.materialHash = {};
    this.nodeHash = {};
    this.materialsUIDPending = {};
    this.nodeTypeMatrixtransform = "MatrixTransform";
    this.nodeTypeGeometry = "Geometry";
    this.nodeTypeGroup = "Group";
    this.nodeTypeRigGeometry = "RigGeometry";
    r.nodeHash[r.nodeTypeMatrixtransform] = {};
    r.nodeHash[r.nodeTypeGeometry] = {};
    r.nodeHash[r.nodeTypeGroup] = {};
    r.nodeHash[r.nodeTypeRigGeometry] = {};
    this.nodeHashIDMap = {};
    this.eventListeners = {};
    this.nodesRaw = null;
    this.enableDebugLogging = !1;
    this.AOPBR = "AOPBR";
    this.AlbedoPBR = "AlbedoPBR";
    this.BumpMap = "BumpMap";
    this.CavityPBR = "CavityPBR";
    this.DiffuseColor = "DiffuseColor";
    this.DiffuseIntensity = "DiffuseIntensity";
    this.DiffusePBR = "DiffusePBR";
    this.EmitColor = "EmitColor";
    this.GlossinessPBR = "GlossinessPBR";
    this.MetalnessPBR = "MetalnessPBR";
    this.NormalMap = "NormalMap";
    this.Opacity = "Opacity";
    this.RoughnessPBR = "RoughnessPBR";
    this.SpecularColor = "SpecularColor";
    this.SpecularF0 = "SpecularF0";
    this.SpecularHardness = "SpecularHardness";
    this.SpecularPBR = "SpecularPBR";
    this.ClearCoat = "ClearCoat";
    this.ClearCoatNormalMap = "ClearCoatNormalMap";
    this.ClearCoatRoughness = "ClearCoatRoughness";
    this.Matcap = "Matcap";
    this.SubsurfaceScattering = "SubsurfaceScattering";
    this.SubsurfaceTranslucency = "SubsurfaceTranslucency";
    this.vectorForward = [0, -1, 0];
    this.vectorBackward = [0, 1, 0];
    this.vectorLeft = [-1, 0, 0];
    this.vectorRight = [1, 0, 0];
    this.vectorUp = [0, 0, .999];
    this.vectorDown = [0, 0, -.999];
    this.textureLoadingCount = 0;
    this.gamma = 2.4;
    this.annotations = [];
    this.animationClips = {};
    this.annotationLength = 0;
    this.animationClipsLength = 0;
    this.currentAnnotationIndex = -1;
    this.currentAnnotationObject;
    this.currentAnimationObject = {};
    this.animationTimerIntervalID = null;
    this.playAnimationClipOnceOnly = !1;
    this.materialPreprocessCompleted = !1;
    this.nodePreprocessCompleted = !1;
    this.annotationPreprocessCompleted = !1;
    this.animationPreprocessCompleted = !1;
    this.sceneTexturesPreprocessCompleted = !1;
    this.EVENT_INITIALIZED = "event_initialized";
    this.EVENT_CLICK = "event_click";
    this.EVENT_MOUSE_ENTER = "event_mouse_enter";
    this.EVENT_MOUSE_LEAVE = "event_mouse_leave";
    this.EVENT_TEXTURE_APPLIED = "event_texture_applied";
    this.EVENT_ANNOTATION_CHANGED = "event_annotation_changed";
    this.EVENT_ANNOTATION_MOUSE_ENTER = "event_annotation_mouse_enter";
    this.EVENT_ANNOTATION_MOUSE_LEAVE = "event_annotation_mouse_leave";
    this.create = function() {
        r.client = new Sketchfab(r.iframe);
        r.clientInitObject.success = r.onClientInit;
        r.clientInitObject.error = r.onClientError;
        r.client.init(r.urlID, r.clientInitObject)
    }
    ;
    this.onClientError = function() {
        console.error('a call to "init()" on the sketchfab client object has failed')
    }
    ;
    this.onClientInit = function(n) {
        r.api = n;
        r.api.addEventListener("viewerready", r.onViewerReady)
    }
    ;
    this.onViewerReady = function() {
        r.api.getMaterialList(r.generateMaterialHash);
        r.api.getSceneGraph(r.generateNodeHashRecursive);
        r.api.getAnnotationList(r.generateAnnotationControls);
        r.api.getAnimations(r.generateAnimationControls);
        r.api.getTextureList(r.getSceneTextures)
    }
    ;
    this.getSceneTextures = function(n, t) {
        var i, u;
        if (n) {
            console.log("Error when calling getSceneTextures");
            return
        }
        for (r.enableDebugLogging && (console.log("textures listing"),
        console.log(t)),
        i = 0; i < t.length; i++)
            u = t[i].name.split(".")[0],
            r.textureCache[u] = t[i].uid;
        r.sceneTexturesPreprocessCompleted = !0;
        r.validateUtilGenerationPreprocess()
    }
    ;
    this.validateUtilGenerationPreprocess = function() {
        r.materialPreprocessCompleted && r.nodePreprocessCompleted && r.annotationPreprocessCompleted && r.animationPreprocessCompleted && r.sceneTexturesPreprocessCompleted && (r.isInitialized = !0,
        r.dispatchEvent(r.EVENT_INITIALIZED, !0))
    }
    ;
    this.generateAnimationControls = function(n, t) {
        var i, u;
        if (n) {
            console.log("Error when calling getAnimations");
            return
        }
        for (r.enableDebugLogging && (console.log("animation listing"),
        console.log(t)),
        i = 0; i < t.length; i++)
            u = r.animationClips[t[i][1]] = {},
            u.name = t[i][1],
            u.uid = t[i][0],
            u.length = t[i][2];
        r.animationClipsLength = t.length;
        r.animationPreprocessCompleted = !0;
        r.validateUtilGenerationPreprocess()
    }
    ;
    this.getAnimationObject = function(n) {
        var t = r.animationClips[n];
        return t === null ? (console.error("a call to  getAnimationObject using key/name " + n + " has failed , no such object found"),
        null) : t
    }
    ;
    this.generateMaterialHash = function(n, t) {
        if (n) {
            console.log("Error when calling getMaterialList");
            return
        }
        r.enableDebugLogging && console.log("materials listing");
        for (var i = 0; i < t.length; i++)
            r.materialHash[t[i].name] = t[i],
            r.enableDebugLogging && console.log("name: " + t[i].name);
        r.materialPreprocessCompleted = !0;
        r.validateUtilGenerationPreprocess()
    }
    ;
    this.addEventListener = function(n, t) {
        if (r.eventListeners[n] === null || r.eventListeners[n] === undefined) {
            if (r.eventListeners[n] = [],
            n == r.EVENT_CLICK)
                if (r.isInitialized)
                    r.api.addEventListener("click", r.onClick, {
                        pick: "slow"
                    });
                else {
                    console.log("a call to add a click event listener has been rejected because this utility has not completed initialization");
                    return
                }
            if (n == r.EVENT_MOUSE_ENTER)
                if (r.isInitialized)
                    r.api.addEventListener("nodeMouseEnter", r.onNodeMouseEnter, {
                        pick: "slow"
                    });
                else {
                    console.log("a call to add a mouse enter event listener has been rejected because this utility has not completed initialization");
                    return
                }
            if (n == r.EVENT_MOUSE_LEAVE)
                if (r.isInitialized)
                    r.api.addEventListener("nodeMouseLeave", r.onNodeMouseLeave, {
                        pick: "slow"
                    });
                else {
                    console.log("a call to add a mouse leave event listener has been rejected because this utility has not completed initialization");
                    return
                }
            if (n == r.EVENT_ANNOTATION_MOUSE_ENTER)
                if (r.isInitialized)
                    r.api.addEventListener("annotationMouseEnter", r.onAnnotationMouseEnter);
                else {
                    console.log("a call to add a annotation enter event listener has been rejected because this utility has not completed initialization");
                    return
                }
            if (n == r.EVENT_ANNOTATION_MOUSE_LEAVE)
                if (r.isInitialized)
                    r.api.addEventListener("annotationMouseLeave", r.onAnnotationMouseLeave);
                else {
                    console.log("a call to add a annotation leave event listener has been rejected because this utility has not completed initialization");
                    return
                }
        }
        r.eventListeners[n].push(t)
    }
    ;
    this.removeEventListener = function(n, t) {
        if (r.eventListeners[n] !== null) {
            for (var i = r.eventListeners[n].length - 1; i >= 0; i--)
                r.eventListeners[n][i] == t && r.eventListeners[n].splice(i, 1);
            r.eventListeners[n].length === 0 && (r.eventListeners[n] = null,
            n == r.EVENT_CLICK && r.api.removeEventListener("click", r.onClick),
            n == r.EVENT_MOUSE_ENTER && r.api.removeEventListener("nodeMouseEnter", r.onNodeMouseEnter),
            n == r.EVENT_MOUSE_LEAVE && r.api.removeEventListener("nodeMouseLeave", r.onNodeMouseLeave),
            n == r.EVENT_ANNOTATION_MOUSE_ENTER && r.api.removeEventListener("annotationMouseEnter", r.onAnnotationMouseEnter),
            n == r.EVENT_ANNOTATION_MOUSE_LEAVE && r.api.removeEventListener("annotationMouseLeave", r.onAnnotationMouseLeave))
        }
    }
    ;
    this.dispatchEvent = function(n, t) {
        var i = r.eventListeners[n], u;
        if (i !== null && i !== undefined)
            for (u = 0; u < i.length; u++)
                i[u](t)
    }
    ;
    this.getfirstAncestorOfTypeGroup = function(n) {
        var t = n.parent;
        if (t !== null && t !== undefined)
            while (t.type !== r.nodeTypeGroup)
                t = t.parent;
        return t
    }
    ;
    this.getfirstAncestorOfTypeMatrixTransform = function(n) {
        var t = n.parent;
        if (t !== null && t !== undefined)
            while (t.type !== r.nodeTypeMatrixtransform)
                t = t.parent;
        return t
    }
    ;
    this.onClick = function(n) {
        if (n.instanceID !== null && n.instanceID !== undefined && n.instanceID !== -1) {
            var t = r.getNodeObject(n.instanceID);
            n.node = t;
            n.firstAncestorOfTypeGroup = r.getfirstAncestorOfTypeGroup(t);
            n.firstAncestorOfTypeMatrixTransform = r.getfirstAncestorOfTypeMatrixTransform(t);
            r.dispatchEvent(r.EVENT_CLICK, n)
        }
    }
    ;
    this.onNodeMouseEnter = function(n) {
        if (n.instanceID !== null && n.instanceID !== undefined && n.instanceID !== -1) {
            var t = r.getNodeObject(n.instanceID);
            n.node = t;
            n.firstAncestorOfTypeGroup = r.getfirstAncestorOfTypeGroup(t);
            n.firstAncestorOfTypeMatrixTransform = r.getfirstAncestorOfTypeMatrixTransform(t);
            r.dispatchEvent(r.EVENT_MOUSE_ENTER, n)
        }
    }
    ;
    this.onNodeMouseLeave = function(n) {
        if (n.instanceID !== null && n.instanceID !== undefined && n.instanceID !== -1) {
            var t = r.getNodeObject(n.instanceID);
            n.node = t;
            n.firstAncestorOfTypeGroup = r.getfirstAncestorOfTypeGroup(t);
            n.firstAncestorOfTypeMatrixTransform = r.getfirstAncestorOfTypeMatrixTransform(t);
            r.dispatchEvent(r.EVENT_MOUSE_LEAVE, n)
        }
    }
    ;
    this.onAnnotationMouseEnter = function(n) {
        isNaN(n) || n !== -1 && r.dispatchEvent(r.EVENT_ANNOTATION_MOUSE_ENTER, r.annotations[n])
    }
    ;
    this.onAnnotationMouseLeave = function(n) {
        isNaN(n) || n !== -1 && r.dispatchEvent(r.EVENT_ANNOTATION_MOUSE_LEAVE, r.annotations[n])
    }
    ;
    this.validateNodeName = function(n) {
        var t = n.split(" ").join("").toLowerCase();
        return t === null || t === undefined ? !1 : typeof t == "string" && (t.length === 0 || t == "rootmodel" || t.indexOf("rootnode") != -1 || t == "scene-polygonnode" || t.indexOf("fbx") != -1 || t.indexOf("undefined") != -1) ? !1 : !0
    }
    ;
    this.generateNodeName = function(n) {
        return n.name === null || n.name === undefined || n.name === "undefined" ? "undefined_" + n.instanceID : n.name
    }
    ;
    this.handleNode = function(n, t, i) {
        var s, u, f, o, e, h;
        if (t.indexOf(n.type) >= 0) {
            if (s = n.type,
            u = r.generateNodeName(n),
            n.name = u,
            f = r.nodeHash[s],
            n.isVisible = !0,
            n.localMatrixCached = n.localMatrix,
            n.parent = i,
            n.index = 0,
            f[u] !== undefined && f[u] !== null ? Array.isArray(f[u]) ? (f[u].push(n),
            n.index = f[u].length - 1,
            r.nodeHashIDMap[n.instanceID] = f[u]) : (o = f[u],
            f[u] = null,
            f[u] = [],
            f[u].push(o),
            o.index = f[u].length - 1,
            f[u].push(n),
            n.index = f[u].length - 1,
            r.nodeHashIDMap[n.instanceID] = f[u]) : (f[u] = n,
            r.nodeHashIDMap[n.instanceID] = f[u]),
            n.children === null || n.children === undefined)
                return;
            if (n.children.length === 0)
                return;
            for (e = 0; e < n.children.length; e++)
                h = n.children[e],
                this.handleNode(h, t, n)
        }
    }
    ;
    this.generateNodeHashRecursive = function(n, t) {
        var u, f, i, e, o;
        if (n) {
            console.log("Error when calling getSceneGraph", n);
            return
        }
        if (r.nodesRaw = t,
        u = [r.nodeTypeMatrixtransform, r.nodeTypeGeometry, r.nodeTypeGroup, r.nodeTypeRigGeometry],
        r.handleNode(t, u, null),
        r.enableDebugLogging)
            for (f = 0; f < u.length; f++) {
                console.log(" ");
                console.log("nodes listing " + u[f]);
                i = r.nodeHash[u[f]];
                for (e in i)
                    if (Array.isArray(i[e]))
                        for (console.log("multiple nodes with same name ,use name and index to reference a single instance, if no index is passed in conjunction with this name, all nodes with this name would be affected: "),
                        o = 0; o < i[e].length; o++)
                            console.log("name: " + i[e][o].name + " index: " + o);
                    else
                        console.log("unique node name, use only name to retrieve: "),
                        console.log("name: " + i[e].name)
            }
        r.nodePreprocessCompleted = !0;
        r.validateUtilGenerationPreprocess()
    }
    ;
    this.logObjectkeysAndValues = function(n) {
        var t, i;
        if (Array.isArray(n))
            for (t = 0; t < n.length; t++)
                console.log("array index: " + t + " = " + n[t]);
        else
            for (i in n)
                console.log(i + " = " + n[i])
    }
    ;
    this.annotationChanged = function(n) {
        isNaN(n) || n !== -1 && (r.currentAnnotationIndex = n,
        r.currentAnnotationObject = r.annotations[r.currentAnnotationIndex],
        r.dispatchEvent(r.EVENT_ANNOTATION_CHANGED, r.currentAnnotationObject))
    }
    ;
    this.generateAnnotationControls = function(n, t) {
        if (n) {
            console.log("Error when calling getAnnotationList");
            return
        }
        r.enableDebugLogging && (console.log("annotations listing"),
        console.log(t));
        r.annotations = t;
        r.annotationLength = t.length;
        for (var i = 0; i < t.length; i++)
            r.annotations[i].description = r.annotations[i].content.raw || "";
        r.annotationPreprocessCompleted = !0;
        r.annotationLength > 0 && r.api.addEventListener("annotationSelect", r.annotationChanged);
        r.validateUtilGenerationPreprocess()
    }
    ;
    this.gotoNextAnnotation = function() {
        r.annotationLength !== 0 && (r.currentAnnotationIndex++,
        r.currentAnnotationIndex >= r.annotationLength && (r.currentAnnotationIndex = 0),
        r.currentAnnotationObject = r.annotations[r.currentAnnotationIndex],
        r.api.gotoAnnotation(r.currentAnnotationIndex))
    }
    ;
    this.gotoPreviousAnnotation = function() {
        r.annotationLength !== 0 && (r.currentAnnotationIndex--,
        r.currentAnnotationIndex < 0 && (r.currentAnnotationIndex = r.annotationLength - 1),
        r.currentAnnotationObject = r.annotations[r.currentAnnotationIndex],
        r.api.gotoAnnotation(r.currentAnnotationIndex))
    }
    ;
    this.gotoAnnotation = function(n) {
        if (r.annotationLength !== 0) {
            if (isNaN(n)) {
                console.error("A call to gotoAnnotation requires you pass in a number for the index");
                return
            }
            n >= r.annotationLength ? n = r.annotationLength - 1 : n < 0 && (n = 0);
            r.currentAnnotationIndex = n;
            r.currentAnnotationObject = r.annotations[r.currentAnnotationIndex];
            r.api.gotoAnnotation(r.currentAnnotationIndex)
        }
    }
    ;
    this.getNodeObject = function(n, t, i) {
        var u, f = i || r.nodeTypeMatrixtransform;
        if (u = typeof n == "string" || n instanceof String ? r.nodeHash[f][n] : r.nodeHashIDMap[n],
        u === null || u === undefined)
            return console.error("a call to  getNodeObject using " + i + " list id and using node name " + n + " has failed , no such node found"),
            null;
        if (t !== null && Array.isArray(u)) {
            if (t < 0 || t >= u.length) {
                console.error("a call to  getNodeObject using node name " + n + " has failed , the nodeIndex is out of range. You can pass an array index ranging : 0 - " + (u.length - 1));
                return
            }
            u = u[t]
        }
        return u
    }
    ;
    this.lookat = function(n, t, i, u, f, e) {
        var s = r.getNodeObject(n, null, r.nodeTypeMatrixtransform), h, o, c;
        s !== null && s !== undefined && ((t === null || t === undefined) && (t = r.vectorForward),
        (i === null || i === undefined) && (i = 10),
        Array.isArray(s) ? (console.log("multiple nodes returned during call to lookat, first node will be used"),
        h = s[0]) : h = s,
        o = [h.localMatrix[12], h.localMatrix[13], h.localMatrix[14]],
        c = [o[0] + t[0] * i, o[1] + t[1] * i, o[2] + t[2] * i],
        f !== null && f !== undefined && Array.isArray(f) && (c[0] += f[0],
        c[1] += f[1],
        c[2] += f[2],
        o[0] += f[0],
        o[1] += f[1],
        o[2] += f[2]),
        r.api.setCameraLookAt(c, o, u, e))
    }
    ;
    this.getVectorMagnitude = function(n) {
        return Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2])
    }
    ;
    this.getVectorNormalized = function(n) {
        var t = r.getVectorMagnitude(n);
        return n[0] /= t,
        n[1] /= t,
        n[2] /= t,
        n
    }
    ;
    this.combineVectorDirections = function() {
        for (var t = [0, 0, 0], n = 0; n < arguments.length; n++)
            t[0] += arguments[n][0],
            t[1] += arguments[n][1],
            t[2] += arguments[n][2];
        return r.getVectorNormalized(t)
    }
    ;
    this.refreshMatrix = function(n) {
        console.log("refreshMatrix called");
        var t = r.getNodeObject(n, null, r.nodeTypeMatrixtransform);
        if (t !== null && t !== undefined) {
            function i(n, i) {
                if (console.log("matrixRefreshed called"),
                n) {
                    console.log("an error occured while called refreshMatrix. Error: " + n);
                    return
                }
                for (var r in i)
                    console.log(r + " = " + i[r]);
                t.localMatrix = i.local;
                t.localMatrixisCached = null
            }
            console.log("about to call getMatrix");
            r.api.getMatrix(t.instanceID, i)
        }
    }
    ;
    this.setPosition = function(n, t, i, u, f) {
        (i === null || i === undefined) && (i = 1);
        var e = r.getNodeObject(n, null, r.nodeTypeMatrixtransform), o;
        if (e !== null && e !== undefined) {
            Array.isArray(e) ? (console.log("multiple nodes returned during call to setPosition, first node will be used"),
            o = e[0]) : o = e;
            function s(t, i) {
                if (t) {
                    console.log("an error occured while called setPosition. Error: " + t);
                    return
                }
                r.refreshMatrix(n);
                f && f(t, i)
            }
            r.api.translate(o.instanceID, t, {
                duration: i,
                easing: u
            }, s)
        }
    }
    ;
    this.translate = function(n, t, i, u, f, e) {
        var s = r.getNodeObject(n, null, r.nodeTypeMatrixtransform), o, c, h;
        s !== null && s !== undefined && ((t === null || t === undefined) && (t = r.vectorForward),
        (i === null || i === undefined) && (i = 1),
        Array.isArray(s) ? (console.log("multiple nodes returned during call to translate, first node will be used"),
        o = s[0]) : o = s,
        c = [o.localMatrix[12], o.localMatrix[13], o.localMatrix[14]],
        h = [c[0] + t[0] * i, c[1] + t[1] * i, c[2] + t[2] * i],
        o.localMatrix[12] = h[0],
        o.localMatrix[13] = h[1],
        o.localMatrix[14] = h[2],
        r.api.translate(o.instanceID, h, {
            duration: u,
            easing: f
        }, e))
    }
    ;
    this.rotateOnAxis = function(n, t, i) {
        var a = r.getNodeObject(n, null, r.nodeTypeMatrixtransform), it;
        a !== null && a !== undefined && (Array.isArray(a) ? (console.log("multiple nodes returned during call to rotateOnAxisX, first node will be used"),
        it = a[0]) : it = a);
        var pt = t * .0174533, u = [], f = it.localMatrix, e = i[0], o = i[1], s = i[2], l = Math.hypot(e, o, s), c, v, h, rt, ut, ft, et, ot, st, ht, ct, lt, at, vt, yt, y, p, w, b, k, d, g, nt, tt;
        if (l < 1e-6)
            return null;
        l = 1 / l;
        e *= l;
        o *= l;
        s *= l;
        c = Math.sin(pt);
        v = Math.cos(pt);
        h = 1 - v;
        rt = f[0];
        ut = f[1];
        ft = f[2];
        et = f[3];
        ot = f[4];
        st = f[5];
        ht = f[6];
        ct = f[7];
        lt = f[8];
        at = f[9];
        vt = f[10];
        yt = f[11];
        y = e * e * h + v;
        p = o * e * h + s * c;
        w = s * e * h - o * c;
        b = e * o * h - s * c;
        k = o * o * h + v;
        d = s * o * h + e * c;
        g = e * s * h + o * c;
        nt = o * s * h - e * c;
        tt = s * s * h + v;
        u[0] = rt * y + ot * p + lt * w;
        u[1] = ut * y + st * p + at * w;
        u[2] = ft * y + ht * p + vt * w;
        u[3] = et * y + ct * p + yt * w;
        u[4] = rt * b + ot * k + lt * d;
        u[5] = ut * b + st * k + at * d;
        u[6] = ft * b + ht * k + vt * d;
        u[7] = et * b + ct * k + yt * d;
        u[8] = rt * g + ot * nt + lt * tt;
        u[9] = ut * g + st * nt + at * tt;
        u[10] = ft * g + ht * nt + vt * tt;
        u[11] = et * g + ct * nt + yt * tt;
        f !== u && (u[12] = f[12],
        u[13] = f[13],
        u[14] = f[14],
        u[15] = f[15]);
        r.api.setMatrix(it.instanceID, u)
    }
    ;
    this.setNodeVisibilityAll = function(n, t, i) {
        var o = !1, h, c, e, s, f, u;
        n === null && (o = !0);
        h = i || r.nodeTypeMatrixtransform;
        c = r.nodeHash[h];
        for (e in c)
            if (r.validateNodeName(e)) {
                if (s = !1,
                t !== null && t !== undefined)
                    for (f = 0; f < t.length; f++)
                        if (t[f] == e) {
                            s = !0;
                            break
                        }
                if (!s && (u = r.getNodeObject(e, null, i),
                u !== null && u !== undefined))
                    if (Array.isArray(u))
                        for (f = 0; f < u.length; f++)
                            o && (u[f].isVisible = !u[f].isVisible,
                            n = u[f].isVisible),
                            u[f].isVisible = n,
                            n ? r.api.show(u[f].instanceID) : r.api.hide(u[f].instanceID);
                    else
                        o && (u.isVisible = !u.isVisible,
                        n = u.isVisible),
                        u.isVisible = n,
                        n ? r.api.show(u.instanceID) : r.api.hide(u.instanceID)
            }
    }
    ;
    this.setNodeVisibility = function(n, t, i, u) {
        var h = !1;
        t === null && (h = !0);
        var f = r.getNodeObject(n, null, u), o, s = !1, e = 0;
        if (f !== null && f !== undefined) {
            if (Array.isArray(f))
                if (i === null)
                    s = !0,
                    o = f[0];
                else {
                    if (i < 0 || i >= f.length) {
                        console.error("a call to  setNodeVisibility using node name " + n + " has failed , this name is mapped to multiple objects and requires you to pass an array index ranging : 0 - " + (f.length - 1));
                        return
                    }
                    o = f[i]
                }
            else
                o = f;
            if (h && (o.isVisible = !o.isVisible,
            t = o.isVisible),
            o.isVisible = t,
            s)
                for (e = 1; e < f.length; e++)
                    f[e].isVisible = t;
            if (t) {
                if (r.api.show(o.instanceID),
                s)
                    for (e = 1; e < f.length; e++)
                        r.api.show(f[e].instanceID)
            } else if (r.api.hide(o.instanceID),
            s)
                for (e = 1; e < f.length; e++)
                    r.api.hide(f[e].instanceID)
        }
    }
    ;
    this.toggleNodeVisibility = function(n, t, i) {
        r.setNodeVisibility(n, null, t, i)
    }
    ;
    this.getMaterialObject = function(n) {
        var t = r.materialHash[n];
        return t === null || t === undefined ? (console.error("a call to getMaterialObject using material name " + n + " has failed , no such material found"),
        null) : t
    }
    ;
    this.getChannelObject = function(n, t) {
        var i = n.channels[t];
        return i === null || i === undefined ? (console.error("a call to getChannelObject using channelName name " + t + " has failed , no such channelName found"),
        null) : i
    }
    ;
    this.setChannelProperties = function(n, t, i) {
        var u = r.getMaterialObject(n)
          , f = r.getChannelObject(u, t);
        r.setChannelPropertiesActual(f, i);
        r.api.setMaterial(u)
    }
    ;
    this.setChannelPropertiesActual = function(n, t) {
        for (var i in t)
            n[i] = t[i]
    }
    ;
    this.setTextureProperties = function(n, t, i) {
        var u = r.getMaterialObject(n)
          , f = r.getChannelObject(u, t);
        r.setTexturePropertiesActual(f, i)
    }
    ;
    this.setTexturePropertiesActual = function(n, t) {
        if (n.texture !== null && n.texture !== undefined)
            for (var i in t)
                n.texture[i] = t[i]
    }
    ;
    this.logChannelPropertiesAndValues = function(n, t) {
        console.log("----------------");
        console.log("Channel " + t);
        console.log("----------------");
        var i = r.getChannelObject(r.getMaterialObject(n), t);
        r.logPropertiesAndValuesRecursive("", "", i)
    }
    ;
    this.logPropertiesAndValuesRecursive = function(n, t, i) {
        for (u in i)
            if (i[u] === Object(i[u])) {
                console.log(u + " : ");
                var f = t;
                t += "      ";
                r.logPropertiesAndValuesRecursive(n, t, i[u]);
                t = f
            } else
                console.log(t + u + " : " + i[u])
    }
    ;
    this.setFactor = function(n, t, i, u) {
        var e, f;
        if (i === null) {
            console.error("a call to setAlpha needs to pass both the material name and the factor value to set the alpha");
            return
        }
        if (u = u || !1,
        e = r.getMaterialObject(n),
        e !== null && (f = r.getChannelObject(e, t),
        f !== null && f !== undefined)) {
            if (u) {
                if (f.factorIsCached !== undefined) {
                    f.factor = f.factorCached;
                    r.api.setMaterial(e);
                    return
                }
                r.enableDebugLogging && console.log("a call to reset factor has been ignored since the factor has not changed");
                return
            }
            f.factorIsCached === undefined && (f.factorIsCached = !0,
            f.factorCached = f.factor);
            f.factor = i;
            r.api.setMaterial(e)
        }
    }
    ;
    this.resetFactor = function(n, t) {
        r.setFactor(n, t, 0, !0)
    }
    ;
    this.setOpacity = function(n, t) {
        r.setFactor(n, r.Opacity, t)
    }
    ;
    this.resetOpacity = function(n) {
        r.setFactor(n, r.Opacity, 0, !0)
    }
    ;
    this.resetMaterialUID = function(n, t) {
        var u = r.getMaterialObject(n), i;
        u !== null && u !== undefined && (i = r.getChannelObject(u, t),
        i !== null && i !== undefined && i.textureIsCached !== undefined && i.textureIsCached !== null && (i.texture = i.textureCached,
        r.api.setMaterial(u)))
    }
    ;
    this.setMaterialUIDPending = function(n, t, i, u, f) {
        var e, o;
        if (i === null || i === undefined || i === "") {
            error.log('a call to "setMaterialUIDPending" has been aborted. The argument UIDKey must have a valid string value so this can be used to look up the UID at a later point');
            return
        }
        e = {};
        e.materialName = n;
        e.channelName = t;
        e.textureObjectDefaults = u;
        e.channelObjectDefaults = f;
        o = r.materialsUIDPending[i];
        (o === null || o === undefined) && (o = r.materialsUIDPending[i] = []);
        o.push(e)
    }
    ;
    this.applyMaterialUIDPending = function(n) {
        var u, h, e, t, i, s;
        if (n !== null && n !== undefined && n !== "" && (u = r.materialsUIDPending[n],
        h = r.textureCache[n],
        u !== null && u !== undefined)) {
            for (e = 0; e < u.length; e++) {
                var o = u[e]
                  , a = o.materialName
                  , v = o.channelName
                  , c = o.textureObjectDefaults
                  , l = o.channelObjectDefaults
                  , f = r.getMaterialObject(a);
                if (f !== null && f !== undefined && (t = r.getChannelObject(f, v),
                t !== null && t !== undefined))
                    if (h === "")
                        (t.color === null || t.color === undefined) && r.setColor(a, v, null, "#ffffff"),
                        t.texture = null,
                        delete t.texture,
                        r.api.setMaterial(f);
                    else {
                        if (t.color && (t.color = null,
                        delete t.color),
                        (t.textureIsCached === undefined || t.textureIsCached === null) && (t.textureIsCached = !0,
                        t.textureCached = t.texture),
                        l !== null && l !== undefined && r.setChannelPropertiesActual(t, l),
                        i = {},
                        s = null,
                        t.textureCached === null || t.textureCached === undefined)
                            i = {},
                            i.internalFormat = "RGB",
                            i.magFilter = "LINEAR",
                            i.minFilter = "LINEAR_MIPMAP_LINEAR",
                            i.texCoordUnit = 0,
                            i.textureTarget = "TEXTURE_2D",
                            i.uid = 0,
                            i.wrapS = "REPEAT",
                            i.wrapT = "REPEAT";
                        else
                            for (s in t.textureCached)
                                i[s] = t.textureCached[s];
                        t.texture = i;
                        c !== null && c !== null && r.setTexturePropertiesActual(t, c);
                        t.texture.uid = h;
                        r.api.setMaterial(f)
                    }
            }
            r.materialsUIDPending[n] = null;
            u = null;
            delete r.materialsUIDPending[n];
            r.dispatchEvent(r.EVENT_TEXTURE_APPLIED, n)
        }
    }
    ;
    this.removeTextureFromMaterialChannel = function(n, t) {
        var u = r.getMaterialObject(n), i;
        u !== null && u !== undefined && (i = r.getChannelObject(u, t),
        i !== null && i !== undefined && ((i.color === null || i.color === undefined) && r.setColor(n, t, null, "#ffffff"),
        i.texture = null,
        delete i.texture,
        r.api.setMaterial(u)))
    }
    ;
    this.addTexture = function(n, t, i) {
        function u(n, i) {
            r.textureCache[t] = i;
            r.applyMaterialUIDPending(t);
            r.dispatchEvent(r.EVENT_TEXTURE_LOADED, {
                UIDKey: t
            })
        }
        if (i = i || !1,
        t === null || t === undefined || t === "") {
            error.log('a call to "addTexture" has been aborted. The argument UIDKey must have a valid string value so this texture has a means to be looked up at a later point');
            return
        }
        if (i && r.textureCache[t] !== null && r.textureCache[t] !== undefined) {
            r.enableDebugLogging && console.log('a call to addTexture found an existing textureCache for UIDKey "' + t + '", applyMaterialUIDPending called immediately.');
            r.applyMaterialUIDPending(t);
            return
        }
        r.textureCache[t] !== null && r.textureCache[t] !== undefined ? r.api.updateTexture(n, r.textureCache[t], u) : r.api.addTexture(n, u)
    }
    ;
    this.resetTexture = function(n, t) {
        r.resetMaterialUID(n, t)
    }
    ;
    this.setColor = function(n, t, i, u, f) {
        var o, s, e, c, h;
        if (i = i || "color",
        o = i + "cached",
        f = f || !1,
        s = r.getMaterialObject(n),
        s !== null && s !== undefined && (e = r.getChannelObject(s, t),
        e !== null && e !== undefined)) {
            if (f) {
                if (e[o] !== undefined && e[o] !== null) {
                    e[i][0] = e[o][0];
                    e[i][1] = e[o][1];
                    e[i][2] = e[o][2];
                    r.api.setMaterial(s);
                    return
                }
                r.enableDebugLogging && console.log("a call to reset a color has been ignored since the color has not changed");
                return
            }
            c = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            u = u.replace(c, function(n, t, i, r) {
                return t + t + i + i + r + r
            });
            (e[i] === null || e[i] === undefined) && (e[i] = [1, 1, 1]);
            e.texture && (e.texture = null,
            delete e.texture);
            h = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(u);
            (e[o] === undefined || e[o] === null) && (e[o] = [],
            e[o][0] = e[i][0],
            e[o][1] = e[i][1],
            e[o][2] = e[i][2]);
            e[i][0] = r.srgbToLinear(parseInt(h[1], 16) / 255);
            e[i][1] = r.srgbToLinear(parseInt(h[2], 16) / 255);
            e[i][2] = r.srgbToLinear(parseInt(h[3], 16) / 255);
            r.api.setMaterial(s)
        }
    }
    ;
    this.resetColor = function(n, t, i) {
        r.setColor(n, t, i, "", !0)
    }
    ;
    this.linearToSrgb = function(n) {
        var t = 0;
        return n < .0031308 ? n > 0 && (t = n * 12.92) : t = 1.055 * Math.pow(n, 1 / r.gamma) - .055,
        t
    }
    ;
    this.srgbToLinear = function(n) {
        var t = 0;
        return n < .04045 ? n >= 0 && (t = n * (1 / 12.92)) : t = Math.pow((n + .055) * (1 / 1.055), r.gamma),
        t
    }
}
(function(n, t) {
    typeof exports == "object" && typeof module == "object" ? module.exports = t() : typeof define == "function" && define.amd ? define([], t) : typeof exports == "object" ? exports.Sketchfab = t() : n.Sketchfab = t()
}
)(this, function() {
    return function(n) {
        function t(r) {
            if (i[r])
                return i[r].exports;
            var u = i[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return n[r].call(u.exports, u, u.exports, t),
            u.l = !0,
            u.exports
        }
        var i = {};
        return t.m = n,
        t.c = i,
        t.d = function(n, i, r) {
            t.o(n, i) || Object.defineProperty(n, i, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }
        ,
        t.n = function(n) {
            var i = n && n.__esModule ? function() {
                return n["default"]
            }
            : function() {
                return n
            }
            ;
            return t.d(i, "a", i),
            i
        }
        ,
        t.o = function(n, t) {
            return Object.prototype.hasOwnProperty.call(n, t)
        }
        ,
        t.p = "/static/builds/web/dist/",
        t(t.s = 39)
    }([function(n) {
        var t = n.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
        typeof __g == "number" && (__g = t)
    }
    , function(n) {
        var t = {}.hasOwnProperty;
        n.exports = function(n, i) {
            return t.call(n, i)
        }
    }
    , function(n, t, i) {
        var r = i(42)
          , u = i(14);
        n.exports = function(n) {
            return r(u(n))
        }
    }
    , function(n, t, i) {
        var r = i(4)
          , u = i(13);
        n.exports = i(5) ? function(n, t, i) {
            return r.f(n, t, u(1, i))
        }
        : function(n, t, i) {
            return n[t] = i,
            n
        }
    }
    , function(n, t, i) {
        var r = i(12)
          , u = i(31)
          , f = i(20)
          , e = Object.defineProperty;
        t.f = i(5) ? Object.defineProperty : function(n, t, i) {
            if (r(n),
            t = f(t, !0),
            r(i),
            u)
                try {
                    return e(n, t, i)
                } catch (o) {}
            if ("get"in i || "set"in i)
                throw TypeError("Accessors not supported!");
            return "value"in i && (n[t] = i.value),
            n
        }
    }
    , function(n, t, i) {
        n.exports = !i(9)(function() {
            return Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a != 7
        })
    }
    , function(n, t, i) {
        var r = i(17)("wks")
          , e = i(11)
          , u = i(0).Symbol
          , f = typeof u == "function"
          , o = n.exports = function(n) {
            return r[n] || (r[n] = f && u[n] || (f ? u : e)("Symbol." + n))
        }
        ;
        o.store = r
    }
    , function(n) {
        var t = n.exports = {
            version: "2.5.3"
        };
        typeof __e == "number" && (__e = t)
    }
    , function(n) {
        n.exports = function(n) {
            return typeof n == "object" ? n !== null : typeof n == "function"
        }
    }
    , function(n) {
        n.exports = function(n) {
            try {
                return !!n()
            } catch (t) {
                return !0
            }
        }
    }
    , function(n, t, i) {
        var r = i(29)
          , u = i(18);
        n.exports = Object.keys || function(n) {
            return r(n, u)
        }
    }
    , function(n) {
        var t = 0
          , i = Math.random();
        n.exports = function(n) {
            return "Symbol(".concat(n === undefined ? "" : n, ")_", (++t + i).toString(36))
        }
    }
    , function(n, t, i) {
        var r = i(8);
        n.exports = function(n) {
            if (!r(n))
                throw TypeError(n + " is not an object!");
            return n
        }
    }
    , function(n) {
        n.exports = function(n, t) {
            return {
                enumerable: !(n & 1),
                configurable: !(n & 2),
                writable: !(n & 4),
                value: t
            }
        }
    }
    , function(n) {
        n.exports = function(n) {
            if (n == undefined)
                throw TypeError("Can't call method on  " + n);
            return n
        }
    }
    , function(n) {
        var t = Math.ceil
          , i = Math.floor;
        n.exports = function(n) {
            return isNaN(n = +n) ? 0 : (n > 0 ? i : t)(n)
        }
    }
    , function(n, t, i) {
        var r = i(17)("keys")
          , u = i(11);
        n.exports = function(n) {
            return r[n] || (r[n] = u(n))
        }
    }
    , function(n, t, i) {
        var r = i(0)
          , u = "__core-js_shared__"
          , f = r[u] || (r[u] = {});
        n.exports = function(n) {
            return f[n] || (f[n] = {})
        }
    }
    , function(n) {
        n.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }
    , function(n, t, i) {
        var u = i(0)
          , e = i(7)
          , o = i(47)
          , s = i(3)
          , f = "prototype"
          , r = function(n, t, i) {
            var b = n & r.F, v = n & r.G, k = n & r.S, w = n & r.P, d = n & r.B, g = n & r.W, l = v ? e : e[t] || (e[t] = {}), p = l[f], a = v ? u : k ? u[t] : (u[t] || {})[f], h, y, c;
            v && (i = t);
            for (h in i)
                (y = !b && a && a[h] !== undefined,
                y && h in l) || (c = y ? a[h] : i[h],
                l[h] = v && typeof a[h] != "function" ? i[h] : d && y ? o(c, u) : g && a[h] == c ? function(n) {
                    var t = function(t, i, r) {
                        if (this instanceof n) {
                            switch (arguments.length) {
                            case 0:
                                return new n;
                            case 1:
                                return new n(t);
                            case 2:
                                return new n(t,i)
                            }
                            return new n(t,i,r)
                        }
                        return n.apply(this, arguments)
                    };
                    return t[f] = n[f],
                    t
                }(c) : w && typeof c == "function" ? o(Function.call, c) : c,
                w && ((l.virtual || (l.virtual = {}))[h] = c,
                n & r.R && p && !p[h] && s(p, h, c)))
        };
        r.F = 1;
        r.G = 2;
        r.S = 4;
        r.P = 8;
        r.B = 16;
        r.W = 32;
        r.U = 64;
        r.R = 128;
        n.exports = r
    }
    , function(n, t, i) {
        var r = i(8);
        n.exports = function(n, t) {
            if (!r(n))
                return n;
            var i, u;
            if (t && typeof (i = n.toString) == "function" && !r(u = i.call(n)) || typeof (i = n.valueOf) == "function" && !r(u = i.call(n)) || !t && typeof (i = n.toString) == "function" && !r(u = i.call(n)))
                return u;
            throw TypeError("Can't convert object to primitive value");
        }
    }
    , function(n) {
        n.exports = !0
    }
    , function(n) {
        n.exports = {}
    }
    , function(n, t, i) {
        var u = i(4).f
          , f = i(1)
          , r = i(6)("toStringTag");
        n.exports = function(n, t, i) {
            n && !f(n = i ? n : n.prototype, r) && u(n, r, {
                configurable: !0,
                value: t
            })
        }
    }
    , function(n, t, i) {
        t.f = i(6)
    }
    , function(n, t, i) {
        var u = i(0)
          , r = i(7)
          , f = i(21)
          , e = i(24)
          , o = i(4).f;
        n.exports = function(n) {
            var t = r.Symbol || (r.Symbol = f ? {} : u.Symbol || {});
            n.charAt(0) == "_" || n in t || o(t, n, {
                value: e.f(n)
            })
        }
    }
    , function(n, t) {
        t.f = {}.propertyIsEnumerable
    }
    , function(n, t, i) {
        n.exports = {
            "default": i(40),
            __esModule: !0
        }
    }
    , function(n, t, i) {
        var r = i(14);
        n.exports = function(n) {
            return Object(r(n))
        }
    }
    , function(n, t, i) {
        var r = i(1)
          , u = i(2)
          , f = i(43)(!1)
          , e = i(16)("IE_PROTO");
        n.exports = function(n, t) {
            var s = u(n)
              , h = 0
              , o = [];
            for (var i in s)
                i != e && r(s, i) && o.push(i);
            while (t.length > h)
                r(s, i = t[h++]) && (~f(o, i) || o.push(i));
            return o
        }
    }
    , function(n) {
        var t = {}.toString;
        n.exports = function(n) {
            return t.call(n).slice(8, -1)
        }
    }
    , function(n, t, i) {
        n.exports = !i(5) && !i(9)(function() {
            return Object.defineProperty(i(32)("div"), "a", {
                get: function() {
                    return 7
                }
            }).a != 7
        })
    }
    , function(n, t, i) {
        var u = i(8)
          , r = i(0).document
          , f = u(r) && u(r.createElement);
        n.exports = function(n) {
            return f ? r.createElement(n) : {}
        }
    }
    , function(n, t, i) {
        "use strict";
        function e(n) {
            return n && n.__esModule ? n : {
                "default": n
            }
        }
        t.__esModule = !0;
        var o = i(49)
          , f = e(o)
          , s = i(61)
          , r = e(s)
          , u = typeof r.default == "function" && typeof f.default == "symbol" ? function(n) {
            return typeof n
        }
        : function(n) {
            return n && typeof r.default == "function" && n.constructor === r.default && n !== r.default.prototype ? "symbol" : typeof n
        }
        ;
        t.default = typeof r.default == "function" && u(f.default) === "symbol" ? function(n) {
            return typeof n == "undefined" ? "undefined" : u(n)
        }
        : function(n) {
            return n && typeof r.default == "function" && n.constructor === r.default && n !== r.default.prototype ? "symbol" : typeof n == "undefined" ? "undefined" : u(n)
        }
    }
    , function(n, t, i) {
        "use strict";
        var o = i(21)
          , e = i(19)
          , a = i(35)
          , s = i(3)
          , v = i(1)
          , h = i(22)
          , y = i(53)
          , p = i(23)
          , w = i(56)
          , r = i(6)("iterator")
          , u = !([].keys && "next"in [].keys())
          , b = "@@iterator"
          , c = "keys"
          , f = "values"
          , l = function() {
            return this
        };
        n.exports = function(n, t, i, k, d, g, nt) {
            y(i, t, k);
            var et = function(n) {
                if (!u && n in tt)
                    return tt[n];
                switch (n) {
                case c:
                    return function() {
                        return new i(this,n)
                    }
                    ;
                case f:
                    return function() {
                        return new i(this,n)
                    }
                }
                return function() {
                    return new i(this,n)
                }
            }, ct = t + " Iterator", st = d == f, ht = !1, tt = n.prototype, it = tt[r] || tt[b] || d && tt[d], rt = !u && it || et(d), at = d ? st ? et("entries") : rt : undefined, lt = t == "Array" ? tt.entries || it : it, ft, ot, ut;
            if (lt && (ut = w(lt.call(new n)),
            ut !== Object.prototype && ut.next && (p(ut, ct, !0),
            o || v(ut, r) || s(ut, r, l))),
            st && it && it.name !== f && (ht = !0,
            rt = function() {
                return it.call(this)
            }
            ),
            (!o || nt) && (u || ht || !tt[r]) && s(tt, r, rt),
            h[t] = rt,
            h[ct] = l,
            d)
                if (ft = {
                    values: st ? rt : et(f),
                    keys: g ? rt : et(c),
                    entries: at
                },
                nt)
                    for (ot in ft)
                        ot in tt || a(tt, ot, ft[ot]);
                else
                    e(e.P + e.F * (u || ht), t, ft);
            return ft
        }
    }
    , function(n, t, i) {
        n.exports = i(3)
    }
    , function(n, t, i) {
        var o = i(12)
          , s = i(54)
          , e = i(18)
          , h = i(16)("IE_PROTO")
          , u = function() {}
          , f = "prototype"
          , r = function() {
            var t = i(32)("iframe"), u = e.length, o = "<", s = ">", n;
            for (t.style.display = "none",
            i(55).appendChild(t),
            t.src = "javascript:",
            n = t.contentWindow.document,
            n.open(),
            n.write(o + "script" + s + "document.F=Object" + o + "/script" + s),
            n.close(),
            r = n.F; u--; )
                delete r[f][e[u]];
            return r()
        };
        n.exports = Object.create || function(n, t) {
            var i;
            return n !== null ? (u[f] = o(n),
            i = new u,
            u[f] = null,
            i[h] = n) : i = r(),
            t === undefined ? i : s(i, t)
        }
    }
    , function(n, t) {
        t.f = Object.getOwnPropertySymbols
    }
    , function(n, t, i) {
        var r = i(29)
          , u = i(18).concat("length", "prototype");
        t.f = Object.getOwnPropertyNames || function(n) {
            return r(n, u)
        }
    }
    , function(n, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var u = i(27)
          , f = i.n(u)
          , e = i(33)
          , o = i.n(e)
          , s = i(72)
          , h = i(73)
          , r = function(n, t) {
            var r = n
              , i = t;
            (typeof n == "undefined" ? "undefined" : o()(n)) === "object" && (i = n,
            r = null);
            this._version = r;
            this._initPending = !1;
            this._optionsPending = !0;
            this._urlOptions = this._getURLOptions();
            this._target = i;
            i.allow || (i.allow = "vr; autoplay; fullscreen");
            this._client = undefined;
            this._options = undefined
        };
        r.prototype = {
            _urlOptionsDict: {
                skfb_api_token: {
                    "default": undefined,
                    type: "string"
                },
                skfb_api_version: {
                    "default": undefined,
                    type: "string"
                },
                skfb_api_domain: {
                    "default": "sketchfab",
                    type: "string"
                }
            },
            _optionsLoaded: function(n) {
                this._urlOptions = n;
                this._version = this._getURLOption("skfb_api_version", this._version || "1.2.0");
                var t = this._getURLOption("skfb_api_domain");
                this._url = "https://" + t + ".com/models/XXXX/embed";
                this._optionsPending = !1;
                this._initPending && this._RealInit()
            },
            _getURLOption: function(n, t) {
                var r = this._urlOptionsDict[n], i;
                return r ? (t === undefined && (t = r.default),
                i = this._urlOptions[n],
                !i || !i.length) ? t : i[0] : t
            },
            _getURLOptions: function() {
                function e() {
                    if (parseInt(this.readyState, 10) === 4)
                        if (parseInt(this.status, 10) === 200)
                            try {
                                var n = JSON.parse(this.responseText);
                                n.email.split("@")[1] === "sketchfab.com" && i(t)
                            } catch (r) {
                                i({})
                            }
                        else
                            i({})
                }
                var t, r, f, u, i, n;
                if (!window || !window.location.search)
                    return this._optionsLoaded({});
                t = Object(h.a)(window.location.search);
                r = !1;
                for (f in t)
                    if (this._urlOptionsDict[f]) {
                        r = !0;
                        break
                    }
                if (u = t.skfb_api_token,
                !u || !r)
                    return this._optionsLoaded({});
                i = this._optionsLoaded.bind(this);
                n = new XMLHttpRequest;
                n.addEventListener("load", e);
                n.open("GET", "https://api.sketchfab.com/v3/me");
                n.setRequestHeader("Authorization", "Token " + u[0]);
                n.send()
            },
            getEmbedURL: function(n, t) {
                var i = this._url + "?api_version=" + this._version + "&api_id=" + this._client.getIdentifier();
                return t && f()(t).forEach(function(n) {
                    t[n] != null && typeof t[n] != "function" && (i += "&" + n.toString() + "=" + t[n].toString())
                }),
                i.replace("XXXX", n)
            },
            init: function(n, t) {
                this._options = t;
                this._urlid = n;
                this._optionsPending || this._RealInit();
                this._initPending = !0
            },
            _RealInit: function() {
                this._client = new s.a(this._target.contentWindow);
                window.addEventListener("message", function(n) {
                    n.data.type === "api.ready" && n.data.instanceId === this._client.getIdentifier() && this._client.use(this._version, function(n, t) {
                        if (n)
                            throw n;
                        this.success.call(this, t)
                    }
                    .bind(this))
                }
                .bind(this));
                this._target.onload = function(n) {
                    try {
                        var t = n.currentTarget.contentDocument.title;
                        (t.startsWith("Page not found") || t.startsWith("400 - ")) && this.error.call(this, "Model not found " + this._urlid)
                    } catch (i) {}
                }
                .bind(this);
                this._target.src = this.getEmbedURL(this._urlid, this._options)
            },
            success: function(n) {
                this._options.success && typeof this._options.success == "function" && this._options.success(n)
            },
            error: function(n) {
                this._options.error && typeof this._options.error == "function" && this._options.error(n)
            }
        };
        t["default"] = r
    }
    , function(n, t, i) {
        i(41);
        n.exports = i(7).Object.keys
    }
    , function(n, t, i) {
        var r = i(28)
          , u = i(10);
        i(46)("keys", function() {
            return function(n) {
                return u(r(n))
            }
        })
    }
    , function(n, t, i) {
        var r = i(30);
        n.exports = Object("z").propertyIsEnumerable(0) ? Object : function(n) {
            return r(n) == "String" ? n.split("") : Object(n)
        }
    }
    , function(n, t, i) {
        var r = i(2)
          , u = i(44)
          , f = i(45);
        n.exports = function(n) {
            return function(t, i, e) {
                var s = r(t), h = u(s.length), o = f(e, h), c;
                if (n && i != i) {
                    while (h > o)
                        if (c = s[o++],
                        c != c)
                            return !0
                } else
                    for (; h > o; o++)
                        if ((n || o in s) && s[o] === i)
                            return n || o || 0;
                return !n && -1
            }
        }
    }
    , function(n, t, i) {
        var r = i(15)
          , u = Math.min;
        n.exports = function(n) {
            return n > 0 ? u(r(n), 9007199254740991) : 0
        }
    }
    , function(n, t, i) {
        var r = i(15)
          , u = Math.max
          , f = Math.min;
        n.exports = function(n, t) {
            return n = r(n),
            n < 0 ? u(n + t, 0) : f(n, t)
        }
    }
    , function(n, t, i) {
        var r = i(19)
          , u = i(7)
          , f = i(9);
        n.exports = function(n, t) {
            var i = (u.Object || {})[n] || Object[n]
              , e = {};
            e[n] = t(i);
            r(r.S + r.F * f(function() {
                i(1)
            }), "Object", e)
        }
    }
    , function(n, t, i) {
        var r = i(48);
        n.exports = function(n, t, i) {
            if (r(n),
            t === undefined)
                return n;
            switch (i) {
            case 1:
                return function(i) {
                    return n.call(t, i)
                }
                ;
            case 2:
                return function(i, r) {
                    return n.call(t, i, r)
                }
                ;
            case 3:
                return function(i, r, u) {
                    return n.call(t, i, r, u)
                }
            }
            return function() {
                return n.apply(t, arguments)
            }
        }
    }
    , function(n) {
        n.exports = function(n) {
            if (typeof n != "function")
                throw TypeError(n + " is not a function!");
            return n
        }
    }
    , function(n, t, i) {
        n.exports = {
            "default": i(50),
            __esModule: !0
        }
    }
    , function(n, t, i) {
        i(51);
        i(57);
        n.exports = i(24).f("iterator")
    }
    , function(n, t, i) {
        "use strict";
        var r = i(52)(!0);
        i(34)(String, "String", function(n) {
            this._t = String(n);
            this._i = 0
        }, function() {
            var t = this._t, i = this._i, n;
            return i >= t.length ? {
                value: undefined,
                done: !0
            } : (n = r(t, i),
            this._i += n.length,
            {
                value: n,
                done: !1
            })
        })
    }
    , function(n, t, i) {
        var r = i(15)
          , u = i(14);
        n.exports = function(n) {
            return function(t, i) {
                var e = String(u(t)), f = r(i), h = e.length, o, s;
                return f < 0 || f >= h ? n ? "" : undefined : (o = e.charCodeAt(f),
                o < 55296 || o > 56319 || f + 1 === h || (s = e.charCodeAt(f + 1)) < 56320 || s > 57343 ? n ? e.charAt(f) : o : n ? e.slice(f, f + 2) : (o - 55296 << 10) + (s - 56320) + 65536)
            }
        }
    }
    , function(n, t, i) {
        "use strict";
        var u = i(36)
          , f = i(13)
          , e = i(23)
          , r = {};
        i(3)(r, i(6)("iterator"), function() {
            return this
        });
        n.exports = function(n, t, i) {
            n.prototype = u(r, {
                next: f(1, i)
            });
            e(n, t + " Iterator")
        }
    }
    , function(n, t, i) {
        var r = i(4)
          , u = i(12)
          , f = i(10);
        n.exports = i(5) ? Object.defineProperties : function(n, t) {
            u(n);
            for (var i = f(t), s = i.length, e = 0, o; s > e; )
                r.f(n, o = i[e++], t[o]);
            return n
        }
    }
    , function(n, t, i) {
        var r = i(0).document;
        n.exports = r && r.documentElement
    }
    , function(n, t, i) {
        var u = i(1)
          , f = i(28)
          , r = i(16)("IE_PROTO")
          , e = Object.prototype;
        n.exports = Object.getPrototypeOf || function(n) {
            return (n = f(n),
            u(n, r)) ? n[r] : typeof n.constructor == "function" && n instanceof n.constructor ? n.constructor.prototype : n instanceof Object ? e : null
        }
    }
    , function(n, t, i) {
        var r;
        i(58);
        var c = i(0)
          , l = i(3)
          , e = i(22)
          , o = i(6)("toStringTag")
          , s = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(",");
        for (r = 0; r < s.length; r++) {
            var u = s[r]
              , h = c[u]
              , f = h && h.prototype;
            f && !f[o] && l(f, o, u);
            e[u] = e.Array
        }
    }
    , function(n, t, i) {
        "use strict";
        var u = i(59)
          , r = i(60)
          , f = i(22)
          , e = i(2);
        n.exports = i(34)(Array, "Array", function(n, t) {
            this._t = e(n);
            this._i = 0;
            this._k = t
        }, function() {
            var t = this._t
              , i = this._k
              , n = this._i++;
            return !t || n >= t.length ? (this._t = undefined,
            r(1)) : i == "keys" ? r(0, n) : i == "values" ? r(0, t[n]) : r(0, [n, t[n]])
        }, "values");
        f.Arguments = f.Array;
        u("keys");
        u("values");
        u("entries")
    }
    , function(n) {
        n.exports = function() {}
    }
    , function(n) {
        n.exports = function(n, t) {
            return {
                value: t,
                done: !!n
            }
        }
    }
    , function(n, t, i) {
        n.exports = {
            "default": i(62),
            __esModule: !0
        }
    }
    , function(n, t, i) {
        i(63);
        i(69);
        i(70);
        i(71);
        n.exports = i(7).Symbol
    }
    , function(n, t, i) {
        "use strict";
        var w = i(0), r = i(1), nt = i(5), e = i(19), yt = i(35), oi = i(64).KEY, pt = i(9), tt = i(17), it = i(23), si = i(11), a = i(6), hi = i(24), ci = i(25), li = i(65), ai = i(66), rt = i(12), vi = i(8), b = i(2), ut = i(20), ft = i(13), v = i(36), wt = i(67), bt = i(68), kt = i(4), yi = i(10), dt = bt.f, c = kt.f, gt = wt.f, u = w.Symbol, k = w.JSON, d = k && k.stringify, h = "prototype", f = a("_hidden"), ni = a("toPrimitive"), pi = {}.propertyIsEnumerable, y = tt("symbol-registry"), s = tt("symbols"), p = tt("op-symbols"), o = Object[h], l = typeof u == "function", et = w.QObject, ot = !et || !et[h] || !et[h].findChild, st = nt && pt(function() {
            return v(c({}, "a", {
                get: function() {
                    return c(this, "a", {
                        value: 7
                    }).a
                }
            })).a != 7
        }) ? function(n, t, i) {
            var r = dt(o, t);
            r && delete o[t];
            c(n, t, i);
            r && n !== o && c(o, t, r)
        }
        : c, ti = function(n) {
            var t = s[n] = v(u[h]);
            return t._k = n,
            t
        }, ht = l && typeof u.iterator == "symbol" ? function(n) {
            return typeof n == "symbol"
        }
        : function(n) {
            return n instanceof u
        }
        , g = function(n, t, i) {
            return (n === o && g(p, t, i),
            rt(n),
            t = ut(t, !0),
            rt(i),
            r(s, t)) ? (i.enumerable ? (r(n, f) && n[f][t] && (n[f][t] = !1),
            i = v(i, {
                enumerable: ft(0, !1)
            })) : (r(n, f) || c(n, f, ft(1, {})),
            n[f][t] = !0),
            st(n, t, i)) : c(n, t, i)
        }, ii = function(n, t) {
            rt(n);
            for (var i = li(t = b(t)), r = 0, f = i.length, u; f > r; )
                g(n, u = i[r++], t[u]);
            return n
        }, wi = function(n, t) {
            return t === undefined ? v(n) : ii(v(n), t)
        }, ri = function(n) {
            var t = pi.call(this, n = ut(n, !0));
            return this === o && r(s, n) && !r(p, n) ? !1 : t || !r(this, n) || !r(s, n) || r(this, f) && this[f][n] ? t : !0
        }, ui = function(n, t) {
            if (n = b(n),
            t = ut(t, !0),
            n !== o || !r(s, t) || r(p, t)) {
                var i = dt(n, t);
                return !i || !r(s, t) || r(n, f) && n[f][t] || (i.enumerable = !0),
                i
            }
        }, fi = function(n) {
            for (var i = gt(b(n)), u = [], e = 0, t; i.length > e; )
                r(s, t = i[e++]) || t == f || t == oi || u.push(t);
            return u
        }, ei = function(n) {
            for (var i = n === o, u = gt(i ? p : b(n)), f = [], e = 0, t; u.length > e; )
                r(s, t = u[e++]) && (i ? r(o, t) : !0) && f.push(s[t]);
            return f
        }, ct, lt, at, vt;
        for (l || (u = function() {
            if (this instanceof u)
                throw TypeError("Symbol is not a constructor!");
            var n = si(arguments.length > 0 ? arguments[0] : undefined)
              , t = function(i) {
                this === o && t.call(p, i);
                r(this, f) && r(this[f], n) && (this[f][n] = !1);
                st(this, n, ft(1, i))
            };
            return nt && ot && st(o, n, {
                configurable: !0,
                set: t
            }),
            ti(n)
        }
        ,
        yt(u[h], "toString", function() {
            return this._k
        }),
        bt.f = ui,
        kt.f = g,
        i(38).f = wt.f = fi,
        i(26).f = ri,
        i(37).f = ei,
        nt && !i(21) && yt(o, "propertyIsEnumerable", ri, !0),
        hi.f = function(n) {
            return ti(a(n))
        }
        ),
        e(e.G + e.W + e.F * !l, {
            Symbol: u
        }),
        ct = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),
        lt = 0; ct.length > lt; )
            a(ct[lt++]);
        for (at = yi(a.store),
        vt = 0; at.length > vt; )
            ci(at[vt++]);
        e(e.S + e.F * !l, "Symbol", {
            "for": function(n) {
                return r(y, n += "") ? y[n] : y[n] = u(n)
            },
            keyFor: function(n) {
                if (!ht(n))
                    throw TypeError(n + " is not a symbol!");
                for (var t in y)
                    if (y[t] === n)
                        return t
            },
            useSetter: function() {
                ot = !0
            },
            useSimple: function() {
                ot = !1
            }
        });
        e(e.S + e.F * !l, "Object", {
            create: wi,
            defineProperty: g,
            defineProperties: ii,
            getOwnPropertyDescriptor: ui,
            getOwnPropertyNames: fi,
            getOwnPropertySymbols: ei
        });
        k && e(e.S + e.F * (!l || pt(function() {
            var n = u();
            return d([n]) != "[null]" || d({
                a: n
            }) != "{}" || d(Object(n)) != "{}"
        })), "JSON", {
            stringify: function(n) {
                for (var i = [n], u = 1, t, r; arguments.length > u; )
                    i.push(arguments[u++]);
                if (r = t = i[1],
                (vi(t) || n !== undefined) && !ht(n))
                    return ai(t) || (t = function(n, t) {
                        return typeof r == "function" && (t = r.call(this, n, t)),
                        ht(t) ? void 0 : t
                    }
                    ),
                    i[1] = t,
                    d.apply(k, i)
            }
        });
        u[h][ni] || i(3)(u[h], ni, u[h].valueOf);
        it(u, "Symbol");
        it(Math, "Math", !0);
        it(w.JSON, "JSON", !0)
    }
    , function(n, t, i) {
        var r = i(11)("meta")
          , o = i(8)
          , f = i(1)
          , s = i(4).f
          , h = 0
          , u = Object.isExtensible || function() {
            return !0
        }
          , c = !i(9)(function() {
            return u(Object.preventExtensions({}))
        })
          , e = function(n) {
            s(n, r, {
                value: {
                    i: "O" + ++h,
                    w: {}
                }
            })
        }
          , l = function(n, t) {
            if (!o(n))
                return typeof n == "symbol" ? n : (typeof n == "string" ? "S" : "P") + n;
            if (!f(n, r)) {
                if (!u(n))
                    return "F";
                if (!t)
                    return "E";
                e(n)
            }
            return n[r].i
        }
          , a = function(n, t) {
            if (!f(n, r)) {
                if (!u(n))
                    return !0;
                if (!t)
                    return !1;
                e(n)
            }
            return n[r].w
        }
          , v = function(n) {
            return c && y.NEED && u(n) && !f(n, r) && e(n),
            n
        }
          , y = n.exports = {
            KEY: r,
            NEED: !1,
            fastKey: l,
            getWeak: a,
            onFreeze: v
        }
    }
    , function(n, t, i) {
        var r = i(10)
          , u = i(37)
          , f = i(26);
        n.exports = function(n) {
            var t = r(n)
              , i = u.f;
            if (i)
                for (var e = i(n), h = f.f, o = 0, s; e.length > o; )
                    h.call(n, s = e[o++]) && t.push(s);
            return t
        }
    }
    , function(n, t, i) {
        var r = i(30);
        n.exports = Array.isArray || function(n) {
            return r(n) == "Array"
        }
    }
    , function(n, t, i) {
        var f = i(2)
          , r = i(38).f
          , e = {}.toString
          , u = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : []
          , o = function(n) {
            try {
                return r(n)
            } catch (t) {
                return u.slice()
            }
        };
        n.exports.f = function(n) {
            return u && e.call(n) == "[object Window]" ? o(n) : r(f(n))
        }
    }
    , function(n, t, i) {
        var u = i(26)
          , f = i(13)
          , e = i(2)
          , o = i(20)
          , s = i(1)
          , h = i(31)
          , r = Object.getOwnPropertyDescriptor;
        t.f = i(5) ? r : function(n, t) {
            if (n = e(n),
            t = o(t, !0),
            h)
                try {
                    return r(n, t)
                } catch (i) {}
            if (s(n, t))
                return f(!u.f.call(n, t), n[t])
        }
    }
    , function() {}
    , function(n, t, i) {
        i(25)("asyncIterator")
    }
    , function(n, t, i) {
        i(25)("observable")
    }
    , function(n, t) {
        "use strict";
        var r = function(n, t) {
            n.forEach(function(n) {
                this[n] = function() {
                    var u = t._requestIdCounter++, i = Array.prototype.slice.call(arguments), r, f;
                    i.length > 0 && (f = i[i.length - 1],
                    typeof f == "function" && (r = i.pop()));
                    r && (t._pendingRequests[u] = r.bind(this));
                    t._target.postMessage({
                        type: "api.request",
                        instanceId: t.getIdentifier(),
                        requestId: u,
                        member: n,
                        arguments: i
                    }, "*")
                }
            }, this);
            this.addEventListener = function(n, i, r) {
                n === "viewerready" && t.isViewerReady && i();
                t._eventListeners[n] || (t._eventListeners[n] = []);
                t._eventListeners[n].push(i);
                r && this.setListenerOptions && (r.name = n,
                this.setListenerOptions(r))
            }
            ;
            this.removeEventListener = function(n, i) {
                if (t._eventListeners[n]) {
                    var r = t._eventListeners[n].indexOf(i);
                    r !== -1 && t._eventListeners[n].splice(r, 1)
                }
            }
        }
          , i = function(n) {
            this._target = n;
            this._requestIdCounter = 0;
            this._pendingRequests = {};
            this._eventListeners = {};
            this._ready = !1;
            var t = Math.random().toString();
            this._identifier = t.substr(t.indexOf(".") + 1);
            this.listenServer()
        };
        i.prototype = {
            getIdentifier: function() {
                return this._identifier
            },
            use: function(n, t) {
                this._version = n;
                var u = function(n, t) {
                    var i = this._requestIdCounter++;
                    this._pendingRequests[i] = function(n, i, u) {
                        n ? t.call(this, n) : t.call(this, null, new r(u,this))
                    }
                    .bind(this);
                    this._target.postMessage({
                        type: "api.initialize",
                        requestId: i,
                        name: n
                    }, "*")
                }
                .bind(this)
                  , i = function() {
                    u(n, t)
                }
                .bind(this);
                this._ready ? i() : this.initAPI = i
            },
            listenServer: function() {
                window.addEventListener("message", function(n) {
                    var t, i, r;
                    if ((n.data.type === "api.ready" || n.data.type === "api.initialize.result" || n.data.type === "api.request.result" || n.data.type === "api.event") && n.data.instanceId === this.getIdentifier())
                        if (n.data.type === "api.ready" && (this._ready || (this._ready = !0,
                        this.initAPI && this.initAPI())),
                        n.data.type === "api.event") {
                            if (t = n.data.results,
                            i = t[0],
                            this._eventListeners["*"] || this._eventListeners.all) {
                                ["*", "all"].forEach(function(n) {
                                    this._eventListeners[n] && this._eventListeners[n].forEach(function(n) {
                                        n.apply(n, t)
                                    })
                                }, this);
                                return
                            }
                            r = t.slice(1);
                            this._eventListeners[i] ? this._eventListeners[i].forEach(function(n) {
                                n.apply(n, r)
                            }) : i === "viewerready" && (this.isViewerReady = !0)
                        } else {
                            if (!this._pendingRequests[n.data.requestId])
                                return;
                            this._pendingRequests[n.data.requestId].apply(null, n.data.results)
                        }
                }
                .bind(this))
            }
        };
        t.a = i
    }
    , function(n, t, i) {
        "use strict";
        function r(n) {
            var t = {};
            return s()(n).forEach(function(i) {
                t[i] = Array.isArray(n[i]) ? n[i] : [n[i]]
            }),
            t
        }
        function u(n) {
            return (typeof n == "undefined" ? "undefined" : e()(n)) === "object" ? r(n) : (n[0] === "?" && (n = n.substr(1)),
            n.split(/&+/g).reduce(function(n, t) {
                var i, r, u;
                return t.length === 0 ? n : (i = t.indexOf("="),
                i === -1 && (i = t.length),
                r = decodeURIComponent(t.substr(0, i).replace(/\+/g, "%20")),
                u = decodeURIComponent(t.substr(i + 1).replace(/\+/g, "%20")),
                typeof n[r] == "undefined" && (n[r] = []),
                n[r].push(u),
                n)
            }, {}))
        }
        var h;
        t.a = u;
        var f = i(33)
          , e = i.n(f)
          , o = i(27)
          , s = i.n(o);
        h = {
            normalize: r,
            parse: u
        }
    }
    ])["default"]
})
