import { getPvzView } from '@/api/common/index'
let ddView = function (tv, divId, options) {
  let that = {
    sessionId: divId,
    session: undefined,
    app: undefined,
    classCaster: undefined,
    systemPrefs: {
      use3DThumbnails: false,
    },
    modelData: {
      itemsList: [],
      illustrations: []
    },
    observer: {
      session: null,
      tree: null,
      selectionList: null,
      model: null,
    },
    MyModelClass: null,
    webglSettings: {
      showGnomon: true,
      showSpinCenter: true,
      selectionFilter: "PART",
      preselectionFilter: "PART",
      pickMode: "SMART",
      structureEdit: false,
      dragMode: true,
      dragSnap: false,
      dragTranslateStep: 0.05,
      dragRotateStep: 30.0,
      dragSize: 1.0,
      showFloor: false,
      showDropShadow: false,
      transparentFloor: false,
      doNotRoll: false,
      showProgress: true,
      enableCrossSiteAccess: false,
      removeModelsOnLoad: true,
      autoload: true,
      expandAncestors: false,
      targetFrameTime: 40000,
      decayrate: 0.0,
      partselfillHexColor: "#33CC4DBF",
      partseloutlineHexColor: "#CC33CCBF",
      partsecselfillHexColor: "#2EE5E5BF",
      partsecseloutlineHexColor: "#FF0000BF",
      partpreselfillHexColor: "#90F000BF",
      partpreseloutlineHexColor: "#3333CCBF",
      backgroundColorNum: "2",
      backgroundHexColor: "#FFFFFFFF",
      backgroundTopHexColor: "#000000FF",
      backgroundBottomHexColor: "#FFFFFFFF",
      shapeFilters: 0x00300007,
      selectionLogging: false,
      wcTreeBehaviour: false,
      navMode: "CreoView",
      keyboardNavigation: false,
      verticalKeyboardNavigation: false,
      selectHighlightStyle: "FILL",
      selectHighlightWidth: 5.0,
      preSelectHighlightStyle: "FILL",
      preSelectHighlightWidth: 5.0,
      showStatistics: false,
      statsPollingRate: 1000,
      _loaded: false,
    },
  };

  that.overrideAntialiasingPreference = function (prefStr) {
    const mobile =
        /iPad|iPhone|iPod|Android/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 0);
    if (!mobile) return prefStr;

    const prefJson = JSON.parse(prefStr);

    if (
        prefJson.ParseNode &&
        prefJson.ParseNode.Children &&
        Array.isArray(prefJson.ParseNode.Children)
    ) {
      const categories = prefJson.ParseNode.Children;
      for (const category of categories) {
        // Find 'Shape View' category
        if (category.Type === "category" && category.Name === "Shape View") {
          if (category.Children && Array.isArray(category.Children)) {
            for (const preference of category.Children) {
              // Find 'Antialiasing quality' preference
              if (
                  preference.Type === "preference" &&
                  preference.Name === "Antialiasing quality"
              ) {
                // Override value
                if (preference.Value === "2") {
                  preference.Value = "1";
                }
                break;
              }
            }
          }
          break;
        }
      }
    }

    return JSON.stringify(prefJson);
  };

  that.addSystemPreferences = function (prefs, savedPrefs) {
    const prefDlg = document.getElementById("systemPreferenceDialog");
    if (!prefDlg) return null;
    prefDlg.loadPreferences(prefs);
    savedPrefs.push(...prefDlg.getSavedPreferences());
    return prefDlg.getChangedPreferences();
  };

  that.LoadSystemPreferences = function (prefs) {
    // Find 'Shape Scene/Use 3D thumbnails'
    const thumbnails = prefs.find(
        (pref) =>
            pref.category === "Shape Scene" && pref.name === "Use 3D thumbnails"
    );
    if (thumbnails) {
      that.systemPrefs.use3DThumbnails = true;
    }
  };

  that.startThingView = function (cb) {
    tv.SetDefaultSystemPreferences(Module.ApplicationType.CREOVIEW);
    // console.log("Creo View WebGL Viewer is now initialized");
    that.app = tv.CreateCVApplication(that.sessionId);
    that.session = that.app.GetSession();

    that.classCaster = Module.InheritedClassCaster.Create();
    cb && cb()
  };

  that.ExtendClassInterface = function(){
    that.MySelectionListObserverClass = Module.SelectionListObserver.extend("SelectionListObserver", {
      OnBegin: function () {

      },
      OnSelectionListChanged:function(selListInfo) {
        let clear = selListInfo.Cleared();
        // let partsAdded = selListInfo.GetAddedPartIds();
        // let partsRemoved = selListInfo.GetRemovedPartIds();
        // let markupsAdded = selListInfo.GetAddedMarkupUIDs();
        // let markupsRemoved = selListInfo.GetRemovedMarkupUIDs();
        // let featuresAdded = selListInfo.GetAddedFeatures();
        // let featuresRemoved = selListInfo.GetRemovedFeatures();
        let calloutsAdded = selListInfo.GetAddedCalloutIds();
        let calloutsRemoved = selListInfo.GetRemovedCalloutIds();
        // let picks = selListInfo.GetPickResults();
        // callouts
        if(clear) {
          var itemsList = that.model.GetItemsList();
          if (itemsList) {
            for (let i=0;i<that.modelData.itemsList.length;++i) {
              that.modelData.itemsList[i].selected = false;
              that.ToggleTableSelection(i, that.modelData.itemsList[i],false);
            }
            itemsList.delete();
          }
        }
        for (let i=0;i<calloutsRemoved.size();++i) {
          let calloutId = calloutsRemoved.get(i);

          var itemsList = that.model.GetItemsList();
          if (itemsList) {
            for (let i=0;i<that.modelData.itemsList.length;++i) {
              if (that.modelData.itemsList[i].calloutId == calloutId) {
                that.modelData.itemsList[i].selected = false;
                that.ToggleTableSelection(i, that.modelData.itemsList[i], false);
                break;
              }
            }
            itemsList.delete();
          }
        }
        for (let i=0;i<calloutsAdded.size();++i) {
          let calloutId = calloutsAdded.get(i);
          var itemsList = that.model.GetItemsList();
          if (itemsList) {
            for (let i=0;i<that.modelData.itemsList.length;++i) {
              if (that.modelData.itemsList[i].calloutId == calloutId) {
                that.modelData.itemsList[i].selected = true;
                that.ToggleTableSelection(i, that.modelData.itemsList[i],true);
                break;
              }
            }
            itemsList.delete();
          }
        }

      },
      OnEnd: function () {
        //that.SelectionChanged();
      }
    });
  }
  that.ToggleTableSelection = function(divId, selectItem, selected){
    if(selected) {
      options.callOutSelect && options.callOutSelect(divId, selectItem)
    }
  };

  that.itemListSelection = function(label, divId) {
    if(!that.model) return;
    let itemsList = that.model.GetItemsList();
    if (itemsList) {
      window.pvzThat = that;
      var intsVec = new Module.VectorNumber();
      var allVec = new Module.VectorNumber();
      itemsList.SelectItemCallouts(allVec, false);

      for (var i=0;i<that.modelData.itemsList.length;++i) {
        that.modelData.itemsList[i].selected = that.modelData.itemsList[i].label == label;
        if (that.modelData.itemsList[i].selected) {
          var itemIndex = itemsList.GetItemIndexFromCalloutId(that.modelData.itemsList[i].calloutId);
          intsVec.push_back(itemIndex);
        }
      }
      // 如果点击的比较快，对原有的timer进行处理
      if(that.timer.scaleTimer) {
        clearTimeout(that.timer.scaleTimer)
        that.timer.scaleTimer = undefined
      }
      if(intsVec.size() > 0) {
        itemsList.SelectItemCallouts(intsVec, true);
        itemsList.delete();
        that.shapeView.ZoomView(Module.ZoomMode.ZOOM_SELECTED, 1000.0);
        that.timer.scaleTimer = setTimeout(() => {
          that.shapeView.ApplyZoomScale(3.0, 1000.0)
        }, 1300)
      }else{
        that.shapeView.ZoomView(Module.ZoomMode.ZOOM_ALL, 1000.0);
      }
    }
  };
  that.reInit = function(cb) {
    getPvzView().then((res) => {
      let prefsJson = res.data
      prefsJson = JSON.stringify(prefsJson)
      if (prefsJson != null) {
        const prefsJsonDef = that.overrideAntialiasingPreference(prefsJson)
        tv.SetSystemPreferencesFromJson(prefsJsonDef)
        const savedPrefs = []
        const json = that.addSystemPreferences(prefsJsonDef, savedPrefs)
        that.LoadSystemPreferences(savedPrefs)
        if (json) {
          const jsonUser = that.overrideAntialiasingPreference(json)
          tv.AddSystemPreferencesFromJson(jsonUser)
        }
      }
      ThingView.SetDefaultSystemPreferences(Module.ApplicationType.CREOVIEW);
      that.startThingView(cb)
    })
  }
  that.init = function (cb) {
    tv.init('/thingview', () => {
      that.reInit(cb)
    })
  }
  that.timer = {
    loadPartList: undefined,
    scaleTimer: undefined
  };
  /** 卸载界面上的模型文件 */
  that.unLoadModel = function () {
    if (tv.IsPDFSession() || tv.IsSVGSession()) {
      tv.Destroy2DCanvas();
      if (that.session) tv.Show3DCanvas(that.session);
    }
    if(that.model) {
      that.model = null;
    }
    if(that.session) {
      that.session.RemoveAllLoadSources();
    }
    if (that.shapeScene) {
      that.shapeScene.RemoveAllCVMarkups(
          Module.CV_MARKUP_TYPES.CVMARKUPTYPE_ALL
      );
      that.shapeScene.RemoveSectionCut();
      that.shapeScene.RemoveAllModels();
      that.shapeScene.DeleteAllLeaderlineMarkers();
    }
    if(that.shapeView) {
      that.shapeView = null
    }
    if(that.structure) {
      that.structure = null
    }
    if(that.session) {
      that.session.RemoveAllScenes();
    }
    that.unRegisterSelectionObserver();
    that.modelData = {
      itemsList: [],
      illustrations: []
    }
    that.observer= {
      session: null,
      selectionList: null,
      model: null,
    }
    that.MyModelClass = null;
  };
  that.loadIllustrationItemList = () => {
    that.modelData.itemsList = []
    var itemsList =  that.model.GetItemsList();
    if (itemsList) {
      for (let i=0;i<itemsList.GetNumberOfItems();++i) {
        var obj = {
          calloutId: itemsList.GetItemCalloutId(i),
          label: itemsList.GetItemLabel(i),
          nameTag: itemsList.GetItemNameTag(i),
          quantity: itemsList.GetNumInstancesQty(i),
          selected: false
        };
        that.modelData.itemsList.push(obj);
      }
      itemsList.delete();
    }
    that.loadItem = false;
  }
  /** 加载3d的爆炸图 */
  that.LoadViewablePartList = (ops) => {
    var illustrations = that.structure.GetIllustrations();
    that.modelData.illustrations = [];
    if (illustrations.size() > 0) {
      for (let i = 0; i < illustrations.size() ; i++) {
        let illustration = { name: illustrations.get(i).name };
        illustration.humanReadableName = decode_utf8(illustration.name);
        that.modelData.illustrations.push(illustration);
      }
    }
    if(that.timer.loadPartList) {
      clearTimeout(that.timer.loadPartList);
      that.timer.loadPartList = true;
    }
    if(illustrations.size() > 0){
      that.LoadIllustration(that.modelData.illustrations[0])
      that.timer.loadPartList = setTimeout(() => {
        ops.loadPartListCb && ops.loadPartListCb()
      }, 100)
    }
  };
  that.loadItem = false;
  that.LoadIllustration = (figure) => {
    if (that.model) {
      that.model.StopSequence();
      that.model.StopAnimation();
      if (figure) {
        var callback = function (success, pviFile, stepInfoVec) {
          if(success && !that.loadItem) {
            that.loadItem = true;
            // 加载itemsList
            that.loadIllustrationItemList()
            // 缩放数据
            that.shapeView.ZoomView(Module.ZoomMode.ZOOM_ALL, 1000.0);
          }
        };
        that.model.LoadIllustrationWithCallback(figure.name, callback);
      }
    }
  }
  function decode_utf8(s) {
    var res;
    try {
      res = decodeURIComponent(escape(s));
    } catch (e) {
      res = s;
    }
    return res;
  }
  that.observer = {
    selectionList: null
  }
  that.unRegisterSelectionObserver = function() {
    that.observer.selectionList = null

  }
  that.RegisterSelectionObserver = function() {
    if (that.observer.selectionList == null && that.shapeScene) {
      that.observer.selectionList = new that.MySelectionListObserverClass();
      that.shapeScene.AddSelectionListObserver(Module.SelectionList.PRIMARYSELECTION,
          that.observer.selectionList,
          Module.SelectionListGenerateFlags.PART_IDS.value |
          Module.SelectionListGenerateFlags.SELECTABLES.value |
          Module.SelectionListGenerateFlags.MARKUP_UIDS.value |
          Module.SelectionListGenerateFlags.CALLOUT_IDS.value |
          Module.SelectionListGenerateFlags.PICK_RESULTS.value);
    }
  };
  that.registerObserveEvent = function() {
    that.RegisterSelectionObserver()
  }
  that.StructureLoadComplete = function(ops) {
    that.registerObserveEvent();
    ops.loadPartList && that.LoadViewablePartList(ops);
  }
  /** 加载PVZ文件 */
  that.LoadModel = function (url, ops) {
    if (!that.session) {
      that.startThingView(() => {that.LoadModel(url, ops)})
      return;
    }
    that.session.RemoveAllLoadSources();
    if(!that.MySelectionListObserverClass) {
      that.ExtendClassInterface()
    }
    // 重新加载前需要清空数据
    that.session.LoadStructNodeWithURL1(
        url,
        true,
        Module.ExpandThumbnails.COMPLETELY,
        (structNode, errors) => {
          ops.timeCb && ops.timeCb()
          that.structNode = that.classCaster.CastLoadSourceToStructNode(structNode); // keeps smartptr valid after function call ends
          that.structure = that.classCaster.CastLoadSourceToStructure(structNode);

          that.shapeScene = that.session.MakeShapeScene(true);
          that.shapeView = that.shapeScene.MakeShapeView(
              document.getElementById(divId).childNodes[0].id,
              true
          );
          that.model = that.shapeScene.MakeModel();
          that.model.LoadStructNode2(
              structNode,
              Module.AutoloadBehaviour.CREATE_GEOMETRY,
              false,
              true,
              (success, isStructure, errorStack) => {
                ops.loadComplete && ops.loadComplete()
                if(success) {
                  that.StructureLoadComplete(ops);
                }else {
                  ops.errorCb && ops.errorCb('加载失败')
                }
              }
          );
          // Clean up local reference to ThingView objects after finishing using them.
        }
    );
  };
  let dragMode = false
  let viewData = {
    autoSpinCenter: false
  }
  let section = {
    userCreated: false,
    sectioning: false,
    planar: false,
  }
  that.btnOps = {
    step: 0.2,
    resetView: () => that.shapeView && that.shapeView.ZoomView(Module.ZoomMode.ZOOM_ALL, 1000.0),
    zoomSelected: () => that.shapeView && that.shapeView.ZoomView(Module.ZoomMode.ZOOM_SELECTED, 1000.0),
    zoomWindow: () => that.shapeView && that.shapeView.ZoomView(Module.ZoomMode.ZOOM_WINDOW, 1000.0),
    zoomIn: () => {
      that.shapeView && that.shapeView.ApplyZoomScale(1.0 - that.btnOps.step, 1000.0);
    },
    zoomOut: () => {
      that.shapeView && that.shapeView.ApplyZoomScale(1.0 + that.btnOps.step, 1000.0);
    },
    setSpinCenter: () => {
      that.shapeView && that.shapeView.SetSpinCenter();
    },
    autoSpinCenter: () => {
      viewData.autoSpinCenter = !viewData.autoSpinCenter;
      that.shapeView && that.shapeView.SetAutoSpinCenter(viewData.autoSpinCenter)
    },
    setDragMode: () => {
      dragMode = !dragMode
      const dragModeKey = dragMode === true ? Module.DragMode.DRAG : Module.DragMode.NONE
      that.shapeView && that.shapeView.SetDragMode(dragModeKey);
    },
    deleteSectionCut: () => {
      const sectionCut = that.shapeScene.GetSectionCut1();
      if (sectionCut) {
        sectionCut.SetEnable(false);
        section.sectioning = false;
        section.planar = true;
        that.model.RemoveSectionCut();
        sectionCut.delete();
      }
    },
    enableSectionCut: () => {
      if(section.userCreated === true) {
        section.userCreated = false;
        that.btnOps.deleteSectionCut()
        return;
      }
      if (that.shapeScene && that.model) {
        if (section.userCreated === false) {
          let sectionCut = that.shapeScene.GetSectionCut1();
          // Don't create a section cut if one already exists
          if (sectionCut) {
            console.log('You cannot show a section cut when one is already present in the data.');
            section.sectioning = false;
            sectionCut.delete();
            return;
          }
        }

        let bounds = that.shapeScene.GetWorldBoundingBox();
        if (bounds.valid) {
          let x = (bounds.max.x + bounds.min.x) / 2;
          let y = (bounds.max.y + bounds.min.y) / 2;
          let z = (bounds.max.z + bounds.min.z) / 2;
          let sectionCut = that.model.GetSectionCut(true);
          if (!sectionCut) return;

          that.model.ApplySectionCutToScene();

          section.userCreated = true;
          sectionCut.SetDefaultPlane(x, y, z, Module.DefaultAxis.DEFAULTZ);
          sectionCut.SetIntersectAll(true);
          sectionCut.SetEnable(true);
          sectionCut.SetPlanar();
          that.shapeView && that.shapeView.SetDragMode(Module.DragMode.DRAG);
          section.sectioning = true;
          sectionCut.delete();
        }
      }
    }
  }
  return that;
};

export default ddView;