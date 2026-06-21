(function () {
  "use strict";

  var STORAGE_KEY = "gameHubMuted";
  var muted = readStoredMute();
  var mediaElements = new Set();
  var savedMediaState = new WeakMap();
  var audioContexts = new Set();
  var syncQueued = false;
  var scheduleFrame = window.requestAnimationFrame
    ? function (callback) {
        window.requestAnimationFrame(callback);
      }
    : function (callback) {
        window.setTimeout(callback, 16);
      };

  function readStoredMute() {
    try {
      var storedMute = window.localStorage.getItem(STORAGE_KEY);
      return storedMute === null ? true : storedMute === "true";
    } catch (error) {
      return true;
    }
  }

  function rememberMedia(media) {
    if (!media || mediaElements.has(media)) {
      return media;
    }

    mediaElements.add(media);
    savedMediaState.set(media, {
      muted: Boolean(media.muted),
      volume: typeof media.volume === "number" ? media.volume : 1,
    });
    syncMedia(media);
    return media;
  }

  function syncMedia(media) {
    if (!media) {
      return;
    }

    var savedState = savedMediaState.get(media) || { muted: false, volume: 1 };

    try {
      if (muted) {
        media.muted = true;
        media.volume = 0;
      } else {
        media.muted = savedState.muted;
        media.volume = savedState.volume;
      }
    } catch (error) {}
  }

  function syncAllMedia() {
    var nodes = document.querySelectorAll ? document.querySelectorAll("audio, video") : [];
    nodes.forEach(rememberMedia);
    mediaElements.forEach(syncMedia);
  }

  function scheduleSyncAllMedia() {
    if (syncQueued) {
      return;
    }

    syncQueued = true;

    scheduleFrame(function () {
      syncQueued = false;
      syncAllMedia();
    });
  }

  function trackAudioContext(context) {
    if (!context || audioContexts.has(context)) {
      return context;
    }

    audioContexts.add(context);

    if (muted) {
      suspendContext(context);
    }

    return context;
  }

  function suspendContext(context) {
    if (!context || typeof context.suspend !== "function" || context.state === "closed") {
      return;
    }

    context.__gameHubMuteSuspended = true;
    Promise.resolve(context.suspend()).catch(function () {});
  }

  function resumeContext(context) {
    if (
      !context ||
      !context.__gameHubMuteSuspended ||
      typeof context.resume !== "function" ||
      context.state === "closed"
    ) {
      return;
    }

    context.__gameHubMuteSuspended = false;
    Promise.resolve(context.resume()).catch(function () {});
  }

  function syncAudioContexts() {
    audioContexts.forEach(function (context) {
      if (muted) {
        suspendContext(context);
      } else {
        resumeContext(context);
      }
    });
  }

  function patchAudioConstructor() {
    if (typeof window.Audio !== "function" || window.Audio.__gameHubMutePatched) {
      return;
    }

    var NativeAudio = window.Audio;

    function HubAudio() {
      var audio = Reflect.construct(NativeAudio, arguments, HubAudio);
      return rememberMedia(audio);
    }

    HubAudio.prototype = NativeAudio.prototype;

    try {
      Object.setPrototypeOf(HubAudio, NativeAudio);
    } catch (error) {}

    HubAudio.__gameHubMutePatched = true;
    window.Audio = HubAudio;
  }

  function patchMediaPrototype() {
    if (!window.HTMLMediaElement || window.HTMLMediaElement.prototype.__gameHubMutePatched) {
      return;
    }

    var mediaPrototype = window.HTMLMediaElement.prototype;
    var nativePlay = mediaPrototype.play;

    mediaPrototype.play = function () {
      rememberMedia(this);
      return nativePlay.apply(this, arguments);
    };

    mediaPrototype.__gameHubMutePatched = true;
  }

  function patchAudioContext(name) {
    var NativeContext = window[name];

    if (typeof NativeContext !== "function" || NativeContext.__gameHubMutePatched) {
      return;
    }

    var nativeResume = NativeContext.prototype.resume;

    function HubAudioContext() {
      var context = Reflect.construct(NativeContext, arguments, HubAudioContext);
      return trackAudioContext(context);
    }

    HubAudioContext.prototype = NativeContext.prototype;

    try {
      Object.setPrototypeOf(HubAudioContext, NativeContext);
    } catch (error) {}

    if (typeof nativeResume === "function" && !NativeContext.prototype.__gameHubResumePatched) {
      NativeContext.prototype.resume = function () {
        if (muted) {
          suspendContext(this);
          return Promise.resolve();
        }

        return nativeResume.apply(this, arguments);
      };
      NativeContext.prototype.__gameHubResumePatched = true;
    }

    HubAudioContext.__gameHubMutePatched = true;
    window[name] = HubAudioContext;
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    syncAllMedia();
    syncAudioContexts();
  }

  patchAudioConstructor();
  patchMediaPrototype();
  patchAudioContext("AudioContext");
  patchAudioContext("webkitAudioContext");

  window.GameHubMute = {
    isMuted: function () {
      return muted;
    },
    setMuted: setMuted,
    sync: function () {
      setMuted(readStoredMute());
    },
  };

  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "game-hub-mute") {
      setMuted(event.data.muted);
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) {
      setMuted(event.newValue === "true");
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncAllMedia);
  } else {
    syncAllMedia();
  }

  if (window.MutationObserver && document.documentElement) {
    new MutationObserver(scheduleSyncAllMedia).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
