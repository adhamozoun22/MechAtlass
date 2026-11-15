/* MechAtlas: automatic push notifications inside the Capacitor (Android) app — Batch 13.
   Plugin: @capacitor-firebase/messaging (only). No button, no web push, no server: on the very first launch the system permission
   dialog is shown once; once allowed, the FCM token is read and THIS DEVICE subscribes itself to the topic below.
   In a normal browser (Netlify / PWA) this file does nothing at all.
   Plugin functions used: checkPermissions, requestPermissions, getToken, subscribeToTopic (+ listeners tokenReceived, notificationActionPerformed). */
(function () {
    'use strict';
    var TOPIC = 'academy_updates', ASKED = 'mechatlas_push_asked', TOKEN = 'mechatlas_fcm_token', TOPIC_OK = 'mechatlas_push_topic';
    var C = window.Capacitor;
    var native = !!(C && typeof C.isNativePlatform === 'function' && C.isNativePlatform());
    var FM = null;
    if (native) {   /* the native bridge normally lists the plugin in Capacitor.Plugins; otherwise ask the bridge for it */
        try { FM = (C.Plugins && C.Plugins.FirebaseMessaging) || (typeof C.isPluginAvailable === 'function' && C.isPluginAvailable('FirebaseMessaging') && typeof C.registerPlugin === 'function' ? C.registerPlugin('FirebaseMessaging') : null); } catch (e) { FM = null; }
    }
    var ls = {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    };
    var state = { native: native, plugin: FM ? 'firebase-messaging' : null, permission: null, token: ls.get(TOKEN), topic: ls.get(TOPIC_OK) === TOPIC, error: null };
    var log = function (m, e) { if (window.console) console.warn('[push] ' + m, e || ''); };
    /* a notification tap may carry data.route such as "#/academy/item/<slug>": open it inside the app (Academy routes only) */
    function openRoute(data) {
        var r = data && data.route;
        if (typeof r !== 'string' || !/^#\/academy(\/[A-Za-z0-9_\-%]+){0,3}(\?q=[A-Za-z0-9_\-%]{0,80})?$/.test(r)) return;
        if (location.hash === r && typeof navigate === 'function') { navigate('academy'); return; }
        location.hash = r;
    }
    function saveToken(t) { if (t) { state.token = t; ls.set(TOKEN, t); } }
    function subscribe() {
        return FM.subscribeToTopic({ topic: TOPIC }).then(function () { state.topic = true; ls.set(TOPIC_OK, TOPIC); return true; })
            .catch(function (e) { state.error = 'topic'; log('topic subscription failed (retried at the next launch)', e); return false; });
    }
    function activate() {
        return FM.getToken().then(function (r) { saveToken(r && r.token); }).then(subscribe);
    }
    function start() {
        if (!FM) return Promise.resolve(state);
        try {
            FM.addListener('tokenReceived', function (e) { saveToken(e && e.token); });
            FM.addListener('notificationActionPerformed', function (e) { openRoute(e && e.notification && e.notification.data); });
        } catch (e) { log('listeners', e); }
        return FM.checkPermissions().then(function (st) {
            state.permission = st && st.receive;
            if (state.permission === 'granted') return activate();             /* every launch: refreshes token + topic (cheap) */
            var canAsk = state.permission === 'prompt' || state.permission === 'prompt-with-rationale';
            if (!canAsk || ls.get(ASKED)) return null;                         /* denied, or already asked once: never nag */
            ls.set(ASKED, '1');                                                /* the dialog is shown only on the first launch */
            return FM.requestPermissions().then(function (r) {
                state.permission = r && r.receive;
                return state.permission === 'granted' ? activate() : null;
            });
        }).catch(function (e) { state.error = 'start'; log('start failed', e); }).then(function () { return state; });
    }
    window.MechAtlasPush = { state: function () { return JSON.parse(JSON.stringify(state)); }, start: start, topic: TOPIC };
    if (FM) {
        if (document.readyState === 'complete') setTimeout(start, 800); else window.addEventListener('load', function () { setTimeout(start, 800); });
    }
})();
