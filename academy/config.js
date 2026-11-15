/* MechAtlas Academy: settings. The publishable key is PUBLIC by design (it only lets the browser act as "anon");
   what a visitor can read is decided by the Row Level Security policies in Supabase, not by hiding this key.
   NEVER put a service-role / secret key in any file of this app. */
window.ACADEMY_CONFIG = {
    supabaseUrl: 'https://krifmzrzzytdstjrbbtq.supabase.co',
    publishableKey: 'sb_publishable_gNvmifubDIIy-fgGjSJ3vA__xvBIfUA',
    bucket: 'academy-media',
    /* libraries: bundled in the app (no CDN). Put the files in js/vendor/ — see js/vendor/README_VENDOR.md */
    libs: {
        supabase: './js/vendor/supabase.min.js',
        katexJs: './js/vendor/katex.min.js',
        katexCss: './js/vendor/katex.min.css'
    },
    pageSize: 12,
    signedUrlSeconds: 3600
};
