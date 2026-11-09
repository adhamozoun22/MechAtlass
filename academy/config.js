/* MechAtlas Academy: settings. The publishable key is PUBLIC by design (it only lets the browser act as "anon");
   what a visitor can read is decided by the Row Level Security policies in Supabase, not by hiding this key.
   NEVER put a service-role / secret key in any file of this app. */
window.ACADEMY_CONFIG = {
    supabaseUrl: 'https://krifmzrzzytdstjrbbtq.supabase.co',
    publishableKey: 'sb_publishable_gNvmifubDIIy-fgGjSJ3vA__xvBIfUA',
    bucket: 'academy-media',
    /* external libraries (loaded only when the Academy is opened; exact versions, change here only) */
    libs: {
        supabase: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.9',
        katexJs: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js',
        katexCss: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css'
    },
    pageSize: 12,
    signedUrlSeconds: 3600
};
